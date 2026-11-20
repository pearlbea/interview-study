import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Questions } from "./Questions";
import "@testing-library/dom";

import { questions } from "../mock-data";

test("Questions", () => {
  render(<Questions questions={questions} />);
  expect(screen.getByText(/answer/)).toBeInTheDocument();
});
