import { Link } from "react-router";
import { FileText } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";

const tools = [
  {
    id: "pdf-redact",
    name: "PDF Redaction",
    description: "Permanently remove sensitive text and images from PDFs in your browser.",
    path: "/pdf/redact",
    status: "ready",
  },
];

export default function Tools() {
  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Tools</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group rounded-xl border bg-card p-6 shadow-sm transition-colors hover:border-[#0066CC]/30"
          >
            <div className="mb-4 flex items-center justify-between">
              <FileText className="h-8 w-8 text-[#0066CC]" />
              <Badge variant="secondary">{tool.status}</Badge>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-[#0066CC]">{tool.name}</h3>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
