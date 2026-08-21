import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { RedactTool } from "@/components/RedactTool";
import { REDACTION_FAQ } from "@/lib/faq";
import type { ScenarioConfig } from "@/lib/scenarios";

interface RedactScenarioProps {
  scenario: ScenarioConfig;
}

export default function RedactScenario({ scenario }: RedactScenarioProps) {
  const softwareApplicationLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `QuietKit ${scenario.label}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (browser)",
    url: `https://quietkit.io${scenario.path}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: scenario.description,
    featureList:
      "True redaction (content deletion), Search & redact with regex presets, Automatic verification, Maximum-security rasterize mode, Offline-capable",
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: REDACTION_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Layout>
      <SEO
        title={scenario.pageTitle}
        description={scenario.pageDescription}
        path={scenario.path}
        jsonLd={[softwareApplicationLd, faqLd]}
      />

      <RedactTool
        title={scenario.title}
        description={scenario.description}
      />

      <section className="mt-16 border-t pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
          Guide: redacting {scenario.label.toLowerCase()}
        </h2>
        <div
          className="prose prose-slate max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: scenario.introHtml }}
        />
      </section>

      <section className="mt-10 border-t pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {REDACTION_FAQ.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-xl border bg-card p-4 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {item.question}
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </Layout>
  );
}
