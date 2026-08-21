export interface ScenarioConfig {
  id: string;
  path: string;
  label: string;
  title: string;
  description: string;
  pageTitle: string;
  pageDescription: string;
  introHtml: string;
}

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: "bank-statement",
    path: "/pdf/redact-bank-statement",
    label: "Redact Bank Statement",
    title: "Redact Bank Statement PDF — Remove Account Numbers & Transactions",
    description:
      "Permanently remove account numbers, transaction details, names and addresses from bank statement PDFs. Free, in your browser, no upload.",
    pageTitle: "Redact Bank Statement PDF — Free, No Upload, No Sign Up",
    pageDescription:
      "Remove account numbers, routing numbers, transactions and balances from bank statements. True redaction in your browser — files never leave your device.",
    introHtml: `
      <p class="mb-4 text-muted-foreground">
        Bank statements contain sensitive data: account numbers, routing numbers, transaction history, 
        balances and personal addresses. Use this tool to permanently delete that information from the PDF 
        itself — not just cover it with black boxes.
      </p>
      <ul class="mb-6 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Search & redact account numbers, SSN, names and addresses</li>
        <li>Draw manual rectangles over specific transactions or balances</li>
        <li>Automatic verification confirms nothing extractable remains</li>
        <li>Files stay on your device — zero bytes uploaded</li>
      </ul>
    `,
  },
  {
    id: "ssn",
    path: "/pdf/redact-ssn",
    label: "Redact SSN",
    title: "Redact SSN from PDF — Free Social Security Number Removal",
    description:
      "Remove Social Security Numbers from any PDF permanently. Search by SSN pattern or draw boxes. Browser-based, no upload, no sign-up.",
    pageTitle: "Redact SSN from PDF — Free, No Upload, No Sign Up",
    pageDescription:
      "Instantly find and permanently remove Social Security Numbers from PDFs. Uses regex search and true redaction — verified after every apply.",
    introHtml: `
      <p class="mb-4 text-muted-foreground">
        Social Security Numbers appear in tax forms, loan applications, medical records and employment documents. 
        This tool finds 9-digit SSN patterns automatically and removes them from the PDF structure itself.
      </p>
      <ul class="mb-6 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Auto-detects SSN patterns (XXX-XX-XXXX and XXXXXXXXX)</li>
        <li>Also removes names, addresses and dates of birth if needed</li>
        <li>Verifies zero extractable matches remain after redaction</li>
        <li>Works offline after first load</li>
      </ul>
    `,
  },
  {
    id: "medical-records",
    path: "/pdf/redact-medical-records",
    label: "Redact Medical Records",
    title: "Redact Medical Records PDF — Free HIPAA-Style Redaction",
    description:
      "Remove PHI from medical record PDFs: names, DOB, MRN, diagnoses, provider info. True redaction in browser, no upload.",
    pageTitle: "Redact Medical Records PDF — Free, No Upload, No Sign Up",
    pageDescription:
      "Permanently delete PHI from medical PDFs: patient names, dates of birth, MRNs, diagnoses and provider details. Verified, local, private.",
    introHtml: `
      <p class="mb-4 text-muted-foreground">
        Medical records contain protected health information (PHI) regulated by HIPAA. 
        Sharing records for insurance, legal proceedings or second opinions requires careful redaction 
        of names, dates, medical record numbers, diagnoses and provider identifiers.
      </p>
      <ul class="mb-6 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Search for patient names, MRN, DOB, diagnoses, provider names</li>
        <li>Manual redaction for images, handwriting or non-searchable text</li>
        <li>Full PDF sanitization: metadata, annotations, embedded files removed</li>
        <li>Automatic verification — no hidden text remains</li>
      </ul>
    `,
  },
];

export function getScenarioByPath(path: string): ScenarioConfig | undefined {
  return SCENARIOS.find((s) => s.path === path);
}

export function getScenarioById(id: string): ScenarioConfig | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
