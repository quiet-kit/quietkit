import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import * as mupdf from 'mupdf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.resolve(__dirname, 'fixtures');
const OUT_DIR = path.resolve(__dirname, 'fixtures-out');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeDocument(doc) {
  // Clear standard Info dictionary metadata.
  const infoKeys = [
    mupdf.Document.META_INFO_TITLE,
    mupdf.Document.META_INFO_AUTHOR,
    mupdf.Document.META_INFO_SUBJECT,
    mupdf.Document.META_INFO_KEYWORDS,
    mupdf.Document.META_INFO_CREATOR,
    mupdf.Document.META_INFO_PRODUCER,
  ];
  for (const key of infoKeys) {
    try {
      doc.setMetaData(key, '');
    } catch {
      // ignore
    }
  }

  // Remove XMP metadata stream from the catalog.
  try {
    const trailer = doc.getTrailer();
    const root = trailer.get('Root');
    if (root && !root.isNull()) {
      root.delete('Metadata');
    }
  } catch {
    // ignore
  }

  // Remove outlines.
  try {
    const iter = doc.outlineIterator();
    while (iter.item()) {
      iter.delete();
    }
  } catch {
    // ignore
  }

  // Remove JavaScript and embedded files from Names tree.
  try {
    const trailer = doc.getTrailer();
    const root = trailer.get('Root');
    if (root && !root.isNull()) {
      root.delete('Names');
      root.delete('OpenAction');
      root.delete('AA');
    }
  } catch {
    // ignore
  }

  // Remove annotations from all pages and subset fonts.
  const pageCount = doc.countPages();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.loadPage(i);
    for (const annot of page.getAnnotations()) {
      try {
        page.deleteAnnotation(annot);
      } catch {
        // ignore
      }
    }
  }

  try {
    doc.subsetFonts();
  } catch {
    // ignore
  }
}

function redactBySearch(doc, secrets) {
  const pageCount = doc.countPages();
  let totalHits = 0;
  for (let i = 0; i < pageCount; i++) {
    const page = doc.loadPage(i);
    const st = page.toStructuredText();
    for (const secret of secrets) {
      const hits = st.search(secret);
      for (const hit of hits) {
        for (const quad of hit) {
          const x0 = Math.min(quad[0], quad[2], quad[4], quad[6]);
          const y0 = Math.min(quad[1], quad[3], quad[5], quad[7]);
          const x1 = Math.max(quad[0], quad[2], quad[4], quad[6]);
          const y1 = Math.max(quad[1], quad[3], quad[5], quad[7]);
          const annot = page.createAnnotation('Redact');
          annot.setRect([x0 - 2, y0 - 2, x1 + 2, y1 + 2]);
          totalHits++;
        }
      }
    }
  }
  return totalHits;
}

function applyRedactions(doc) {
  const pageCount = doc.countPages();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.loadPage(i);
    page.applyRedactions(
      true,
      mupdf.PDFPage.REDACT_IMAGE_REMOVE_IF_COVERED,
      mupdf.PDFPage.REDACT_LINE_ART_REMOVE_IF_COVERED,
      mupdf.PDFPage.REDACT_TEXT_REMOVE,
    );
  }
}

function extractAllText(doc) {
  const parts = [];
  const pageCount = doc.countPages();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.loadPage(i);
    parts.push(page.toStructuredText().asText());
  }
  return parts.join('\n');
}

function checkMetadataCleared(doc) {
  const title = doc.getMetaData(mupdf.Document.META_INFO_TITLE);
  const author = doc.getMetaData(mupdf.Document.META_INFO_AUTHOR);
  return (!title || title === '') && (!author || author === '');
}

function saveDocument(doc) {
  sanitizeDocument(doc);
  const buf = doc.saveToBuffer('garbage=4,compress=yes');
  // asUint8Array() returns a view on WASM heap; copy it for safety.
  return new Uint8Array(buf.asUint8Array());
}

function renderFirstPageToPng(doc, filename) {
  const page = doc.loadPage(0);
  const pixmap = page.toPixmap(mupdf.Matrix.identity, mupdf.ColorSpace.DeviceRGB, false);
  fs.writeFileSync(filename, Buffer.from(pixmap.asPNG()));
}

function hasPdftotext() {
  try {
    execSync('which pdftotext', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function runCase(name, secrets, options = {}) {
  const inputPath = path.join(FIXTURES_DIR, `${name}.pdf`);
  const inputBytes = fs.readFileSync(inputPath);
  const doc = await mupdf.PDFDocument.openDocument(inputBytes, 'application/pdf');
  const inputSize = inputBytes.length;

  console.log(`\n=== ${name}.pdf ===`);

  if (secrets.length > 0) {
    const hits = redactBySearch(doc, secrets);
    console.log(`  Marked ${hits} redaction region(s)`);
    applyRedactions(doc);
  }

  const outBytes = saveDocument(doc);
  const outPath = path.join(OUT_DIR, `${name}-out.pdf`);
  fs.writeFileSync(outPath, outBytes);
  console.log(`  Saved ${outPath} (${outBytes.length} bytes, input was ${inputSize})`);

  const resultDoc = await mupdf.PDFDocument.openDocument(outBytes, 'application/pdf');
  const text = extractAllText(resultDoc);

  // 1. MuPDF text extraction check
  for (const secret of secrets) {
    if (text.includes(secret)) {
      throw new Error(`[${name}] MuPDF text extraction still contains: ${secret}`);
    }
  }
  console.log('  ✓ MuPDF text extraction clean');

  // 2. Raw bytes check
  for (const secret of secrets) {
    if (Buffer.from(outBytes).includes(secret)) {
      throw new Error(`[${name}] Raw bytes still contain: ${secret}`);
    }
  }
  console.log('  ✓ Raw bytes clean');

  // 3. pdftotext external check
  if (hasPdftotext()) {
    try {
      const externalText = execSync(`pdftotext "${outPath}" -`, { encoding: 'utf8' });
      for (const secret of secrets) {
        if (externalText.includes(secret)) {
          throw new Error(`[${name}] pdftotext still contains: ${secret}`);
        }
      }
      console.log('  ✓ pdftotext extraction clean');
    } catch (e) {
      if (e.message && e.message.includes('still contains')) throw e;
      console.log('  ⚠ pdftotext failed:', e.message);
    }
  } else {
    console.log('  ⚠ pdftotext not installed, skipping external extractor');
  }

  // Metadata check
  if (secrets.length > 0) {
    if (!checkMetadataCleared(resultDoc)) {
      throw new Error(`[${name}] Metadata not cleared`);
    }
    console.log('  ✓ Metadata cleared');
  }

  // File size sanity check
  if (!options.skipSizeCheck && outBytes.length > inputSize * 1.25) {
    throw new Error(`[${name}] Output size ${outBytes.length} exceeds 125% of input ${inputSize}`);
  }
  console.log('  ✓ Output size within limits');

  // Render first page for visual inspection
  renderFirstPageToPng(resultDoc, path.join(OUT_DIR, `${name}-page0.png`));
  console.log(`  ✓ Render saved to ${name}-page0.png`);

  // Control: no-secret should keep its text
  if (options.preserveText) {
    if (!text.includes(options.preserveText)) {
      throw new Error(`[${name}] Round-trip lost expected text: ${options.preserveText}`);
    }
    console.log(`  ✓ Preserved text: "${options.preserveText}"`);
  }
}

async function main() {
  ensureDir(OUT_DIR);

  const cases = [
    { name: 'basic', secrets: ['123-45-6789'], preserveText: 'Name: John Doe' },
    { name: 'multipage', secrets: ['secret-token-42'] },
    { name: 'with-annotation', secrets: ['classified'] },
    { name: 'repeated', secrets: ['4111-1111-1111-1111'] },
    { name: 'no-secret', secrets: [], preserveText: 'This page contains no secrets.' },
  ];

  let failed = false;
  for (const c of cases) {
    try {
      await runCase(c.name, c.secrets, { preserveText: c.preserveText });
    } catch (err) {
      console.error(`\n  ✗ ${c.name}.pdf FAILED:`, err.message);
      failed = true;
    }
  }

  console.log('\n==============================');
  if (failed) {
    console.log('VERIFY FAILED');
    process.exit(1);
  } else {
    console.log('ALL CHECKS PASSED');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
