import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';

/** Two-column legal page with a scroll-spy table of contents. */
export default function LegalLayout({ eyebrow, title, meta, intro, sections, children }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    // Active = last section whose heading has scrolled past the sticky header
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) current = s.id;
      }
      setActive(atBottom ? sections[sections.length - 1].id : current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 grid-bg" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 lg:px-10">
        <header className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
          {meta && <p className="mt-4 text-sm text-ink-400">{meta}</p>}
          {intro && <p className="mt-6 text-lg leading-relaxed text-ink-300">{intro}</p>}
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
          <nav aria-label="On this page" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow mb-3 hidden lg:block">On this page</p>
            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
              {sections.map((s, i) => (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? 'location' : undefined}
                    className={cx(
                      'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors lg:border-0 lg:border-l-2 lg:rounded-none lg:py-1.5',
                      active === s.id
                        ? 'border-brand-500/40 bg-brand-500/10 text-white lg:border-brand-500 lg:bg-transparent'
                        : 'border-white/10 text-ink-300 hover:text-white lg:border-white/[0.06]',
                    )}
                  >
                    <span className="font-mono text-[11px] text-ink-500">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="min-w-0 max-w-3xl space-y-16 [&_h2]:scroll-mt-24 [&_p]:leading-relaxed">
            {children}
          </article>
        </div>
      </div>
    </main>
  );
}

export function LegalSection({ id, title, tag, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      {tag && <p className="eyebrow mb-2 text-brand-300">{tag}</p>}
      <h2 className="mb-5 text-2xl font-semibold">{title}</h2>
      <div className="space-y-5 text-ink-200">{children}</div>
    </section>
  );
}
