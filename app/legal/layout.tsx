import Link from "next/link";
import { FrameGlyph } from "@/components/ui/FrameGlyph";

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" aria-label="Inicio" className="text-accent">
          <FrameGlyph shape="round" thickness={0.3} className="h-6 w-auto" />
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-ink">
          Volver
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <article
          className="
            [&_h1]:font-display [&_h1]:text-4xl [&_h1]:leading-tight [&_h1]:tracking-tight
            [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-tight
            [&_li]:text-muted
            [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:leading-relaxed
          "
        >
          {children}
        </article>
      </main>
    </div>
  );
}
