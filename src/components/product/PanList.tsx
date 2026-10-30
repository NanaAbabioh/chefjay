import { QuickAdd } from "./QuickAdd";
import { kpataashieGroups, panServings } from "@/lib/catalog";
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

      <div className="mt-10 grid gap-x-14 gap-y-10 sm:grid-cols-2">
        {kpataashieGroups.map((group) => (
          <div key={group.heading}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-bark-faint">
              {group.heading}
            </h3>
            <ul className="mt-3">
              {group.items.map((item) => (
                <li key={item.slug} className="border-t border-bark/15 py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <span className="font-display text-lg font-semibold">
                      {item.name}
                    </span>
                    <span className="text-base tabular-nums text-bark-soft">
                      {/* "Half pan" / "Full pan" are already the labels on the
                          picker below, so the price line says the half and the
                          full and leaves the noun to the control. */}
                      {item.sizes.length > 1
                        ? item.sizes
                            .map(
                              (s) =>
                                `${s.volume.replace(" pan", "")} ${money(s.priceCents)}`,
                            )
                            .join(" · ")
                        : `${item.sizes[0].volume} ${money(item.sizes[0].priceCents)}`}
                    </span>
                  </div>
                  <p className="mt-1 text-base text-bark-faint">{item.blurb}</p>
                  <div className="mt-3">
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
