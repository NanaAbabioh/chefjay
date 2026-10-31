import { QuickAdd } from "./QuickAdd";
import { kpataashieGroups, panServings, type Size } from "@/lib/catalog";
import { money } from "@/lib/format";

/**
 * The Kpataashie pans, grouped as the kitchen quotes them, with the price
 * list doubling as the order form — one list, so a figure can never drift
 * between what is advertised and what is charged.
 *
 * Shared by the shop and the Kpataashie page rather than copied into both.
 * Food is not a seasonal feature: this is here whether or not a promotion is
 * running, and nothing in it is gated.
 */
export function PanList() {
  return (
    <>
      {/* The question every caterer is asked first, above the prices. */}
      <dl className="flex flex-wrap gap-x-10 gap-y-2 text-base">
        {panServings.map((p) => (
          <div key={p.size} className="flex gap-2">
            <dt className="font-semibold">{p.size}</dt>
            <dd className="text-bark-soft">feeds {p.serves}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 space-y-12">
        {kpataashieGroups.map((group) => (
          <div key={group.heading}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-bark-faint">
              {group.heading}
            </h3>
            {/* Each group spans the width and sets its own columns. Rice takes
                two wide ones because its choices need the room; the soups are
                a line each and sit three across. */}
            <ul
              className={`mt-3 grid gap-x-12 ${
                group.items.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"
              }`}
            >
              {group.items.map((item) => (
                <li key={item.slug} className="border-t border-bark/15 py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <span className="font-display text-lg font-semibold">
                      {item.name}
                    </span>
                    <span className="text-base tabular-nums text-bark-soft">
                      {priceLine(item.sizes)}
                    </span>
                  </div>
                  <p className="mt-1 text-base text-bark-faint">{item.blurb}</p>
                  <div className="mt-4">
                    <QuickAdd slug={item.slug} sizes={item.sizes} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * The price beside the name.
 *
 * Exact where there is one price or two. Where a pan is sold eight ways the
 * line gives the span instead — eight figures beside a name is not a price,
 * it is a table — and the precise number for what is actually selected always
 * rides the Add button below.
 */
function priceLine(sizes: Size[]) {
  if (sizes.length === 1) {
    return `${sizes[0].volume} ${money(sizes[0].priceCents)}`;
  }

  const cents = sizes.map((s) => s.priceCents);
  if (sizes.some((s) => s.with)) {
    return `${money(Math.min(...cents))} – ${money(Math.max(...cents))}`;
  }

  // "Half pan" / "Full pan" are already the labels on the picker below, so the
  // line says the half and the full and leaves the noun to the control.
  return sizes
    .map((s) => `${s.volume.replace(" pan", "")} ${money(s.priceCents)}`)
    .join(" · ");
}
