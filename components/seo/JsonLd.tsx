/**
 * Generic JSON-LD injector for Schema.org structured data.
 * Safe for Next.js App Router — renders a plain <script> tag during SSR.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
