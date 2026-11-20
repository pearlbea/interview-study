import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    variable: "--font-inter",
  }),
  Space_Grotesk: () => ({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
  }),
}));
