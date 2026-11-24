import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardForm } from "./CardForm";

vi.mock("./actions", () => ({
  saveCard: vi.fn(async () => ({ error: "Could not save the card." })),
}));

test("keeps the admin's entries after a failed save", async () => {
  const user = userEvent.setup();
  render(<CardForm topics={[{ id: "topic-1", name: "React" }]} />);

  await user.type(screen.getByLabelText("Question (Markdown)"), "My **question**");
  await user.type(screen.getByLabelText("Answer"), "My answer");
  await user.click(screen.getByLabelText("React"));
  await user.click(screen.getByRole("button", { name: "Save card" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Could not save the card.");
  expect(screen.getByLabelText("Question (Markdown)")).toHaveValue("My **question**");
  expect(screen.getByLabelText("Answer")).toHaveValue("My answer");
  expect(screen.getByLabelText("React")).toBeChecked();
});
