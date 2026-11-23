import { beforeEach, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Questions } from "./Questions";
import { rateQuestion } from "@/app/actions";
import "@testing-library/dom";

import { questions } from "../mock-data";

vi.mock("@/app/actions", () => ({ rateQuestion: vi.fn() }));

beforeEach(() => {
  vi.resetAllMocks();
});

test("Questions", () => {
  render(<Questions questions={questions} />);
  expect(screen.getByText(/answer/)).toBeInTheDocument();
});

const quizQuestions = [
  ...questions,
  { ...questions[0], id: "another-question", question: "Second question" },
];

test("keeps an answer through flips and edits, then starts the next question empty", async () => {
  const user = userEvent.setup();
  render(<Questions questions={quizQuestions} />);

  await user.type(screen.getByLabelText("Your answer"), "First answer");
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.getByText("First answer")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /flip back/i }));
  expect(screen.getByLabelText("Your answer")).toHaveValue("First answer");
  await user.type(screen.getByLabelText("Your answer"), " edited");
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.getByText("First answer edited")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /next card/i }));
  expect(screen.getByLabelText("Your answer")).toHaveValue("");
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.queryByText("First answer edited")).not.toBeInTheDocument();
});

test("skipping a question discards its draft before the next question", async () => {
  const user = userEvent.setup();
  render(<Questions questions={quizQuestions} />);

  await user.type(screen.getByLabelText("Your answer"), "Skipped draft");
  await user.click(screen.getByRole("button", { name: /skip/i }));
  expect(screen.getByLabelText("Your answer")).toHaveValue("");
  await user.type(screen.getByLabelText("Your answer"), "Second answer");
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.getByText("Second answer")).toBeInTheDocument();
  expect(screen.queryByText("Skipped draft")).not.toBeInTheDocument();
});

test("does not display a draft when the active question changes", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Questions questions={quizQuestions} />);

  await user.type(screen.getByLabelText("Your answer"), "First draft");
  rerender(<Questions questions={[quizQuestions[1]]} />);
  expect(screen.getByLabelText("Your answer")).toHaveValue("");
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.queryByText("First draft")).not.toBeInTheDocument();
});

test("clears a saved rating when advancing, but preserves it when flipping back", async () => {
  const user = userEvent.setup();
  vi.mocked(rateQuestion).mockResolvedValue({});
  render(<Questions questions={quizQuestions} />);

  await user.click(screen.getByRole("button", { name: /flip card/i }));
  await user.click(screen.getByRole("button", { name: "Not at all" }));
  expect(await screen.findByText("Rating saved!")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /flip back/i }));
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.getByText("Rating saved!")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /next card/i }));
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.queryByText("Rating saved!")).not.toBeInTheDocument();
});

test("clears a rating error when advancing", async () => {
  const user = userEvent.setup();
  vi.mocked(rateQuestion).mockResolvedValue({ error: "Could not save your rating." });
  render(<Questions questions={quizQuestions} />);

  await user.click(screen.getByRole("button", { name: /flip card/i }));
  await user.click(screen.getByRole("button", { name: "Not at all" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Could not save your rating.");

  await user.click(screen.getByRole("button", { name: /next card/i }));
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test.each([
  ["success", {}],
  ["error", { error: "Could not save your rating." }],
  ["rejection", new Error("Request failed")],
])("ignores an earlier question's late %s", async (_result, result) => {
  const user = userEvent.setup();
  let resolveFirst!: (result: { error?: string }) => void;
  let rejectFirst!: (error: Error) => void;
  let resolveSecond!: (result: { error?: string }) => void;
  vi.mocked(rateQuestion)
    .mockImplementationOnce(() => new Promise((resolve, reject) => {
      resolveFirst = resolve;
      rejectFirst = reject;
    }))
    .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve; }));
  render(<Questions questions={quizQuestions} />);

  await user.click(screen.getByRole("button", { name: /flip card/i }));
  await user.click(screen.getByRole("button", { name: "Not at all" }));
  expect(screen.getByText("Saving rating…")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /next card/i }));
  await user.click(screen.getByRole("button", { name: /flip card/i }));
  expect(screen.queryByText("Saving rating…")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Partially" }));
  await act(async () => {
    if (result instanceof Error) {
      rejectFirst(result);
    } else {
      resolveFirst(result);
    }
  });
  expect(screen.getByText("Saving rating…")).toBeInTheDocument();
  expect(screen.queryByText("Rating saved!")).not.toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();

  await act(async () => { resolveSecond({}); });
  expect(screen.getByText("Rating saved!")).toBeInTheDocument();
});
