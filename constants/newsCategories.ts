export const NEWS_CATEGORIES = [
  { value: "work-order", label: "Work Order" },
  { value: "acquisitions", label: "Acquisitions" },
  { value: "capacity-expansions", label: "Capacity Expansions" },
  { value: "mou", label: "MOU" },
  { value: "results", label: "Results" },
  { value: "other", label: "Other" },
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]["value"];

export function getCategoryLabel(value: string) {
  return NEWS_CATEGORIES.find((category) => category.value === value)?.label ?? "Other";
}
