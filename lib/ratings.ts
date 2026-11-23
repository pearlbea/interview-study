export const ratings = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Partially" },
  { value: 3, label: "Pretty much" },
  { value: 4, label: "Easy peasy" },
] as const;

export type Rating = (typeof ratings)[number]["value"];
