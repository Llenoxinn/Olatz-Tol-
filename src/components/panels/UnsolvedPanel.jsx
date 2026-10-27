export default function UnsolvedPanel() {
  return (
    <div className="flex h-full flex-col">
      <h2 className="section-title">Status</h2>
      <p className="font-display text-[28px] leading-none font-extrabold tracking-tight text-neon uppercase">Unsolved</p>
      <p className="mt-1.5 text-xs text-dim">
        Open since 1937 &middot; verified up to 2<sup>68</sup>
      </p>
      <figure className="mt-auto border-l-2 border-neon/60 pl-3">
        <blockquote className="text-[13px] leading-snug text-fg">
          &ldquo;Mathematics is not yet ready for such problems.&rdquo;
        </blockquote>
        <figcaption className="mt-1 text-xs text-faint">Paul Erdős, 1979</figcaption>
      </figure>
    </div>
  )
}
