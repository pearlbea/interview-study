import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown } from "./Markdown";

test("renders Markdown and fenced code without executing raw HTML or unsafe links", () => {
  const { container } = render(
    <Markdown>{[
      "What is **React**?",
      "",
      "```ts",
      "const value = 42;",
      "```",
      "",
      '<script>alert("bad")</script>',
      "",
      "[unsafe](javascript:alert(1))",
    ].join("\n")}</Markdown>,
  );

  expect(screen.getByText("React").tagName).toBe("STRONG");
  expect(container.querySelector("pre code")).toHaveTextContent("const value = 42;");
  expect(container.querySelector("script")).not.toBeInTheDocument();
  expect(screen.getByText("unsafe")).toHaveAttribute("href", "");
});
