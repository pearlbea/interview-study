import { beforeEach, expect, test, vi } from "vitest";
import { saveCard, removeCard } from "./actions";
import { redirect } from "next/navigation";

const { getAdminClientMock, rpc } = vi.hoisted(() => ({
  getAdminClientMock: vi.fn(),
  rpc: vi.fn(),
}));
vi.mock("@/lib/supabase/admin", () => ({ getAdminClient: getAdminClientMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn(() => { throw new Error("redirect"); }) }));

const id = "0416d257-31d0-43eb-b6e8-261885235046";

function cardForm() {
  const form = new FormData();
  form.set("id", "");
  form.set("question", "# Question");
  form.set("answer", "Answer");
  form.set("moreInfo", "");
  form.set("status", "draft");
  form.append("topicIds", id);
  return form;
}

beforeEach(() => {
  vi.resetAllMocks();
  getAdminClientMock.mockResolvedValue({
    access: "admin",
    supabase: { rpc },
  });
  vi.mocked(redirect).mockImplementation(() => { throw new Error("redirect"); });
});

test("rejects unauthorized and invalid submissions before writing", async () => {
  getAdminClientMock.mockResolvedValueOnce({ access: "forbidden", supabase: { rpc } });
  expect(await saveCard({}, cardForm())).toEqual({ error: "Admin access is required." });
  const form = cardForm();
  form.delete("topicIds");
  expect((await saveCard({}, form)).error).toBeTruthy();
  expect(rpc).not.toHaveBeenCalled();
});

test("saves Markdown and selected topics through the admin RPC", async () => {
  rpc.mockResolvedValue({ data: id, error: null });
  await expect(saveCard({}, cardForm())).rejects.toThrow("redirect");
  expect(rpc).toHaveBeenCalledWith("admin_save_card", {
    p_id: null,
    p_question: "# Question",
    p_answer: "Answer",
    p_more_info: "",
    p_status: "draft",
    p_topic_ids: [id],
  });
  expect(redirect).toHaveBeenCalledWith("/admin?notice=saved");
});

test("reports removal errors rather than claiming success", async () => {
  rpc.mockResolvedValue({ data: null, error: { message: "failed" } });
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  const form = new FormData();
  form.set("id", id);
  expect(await removeCard({}, form)).toEqual({ error: "Could not remove the question. Please try again." });
  expect(redirect).not.toHaveBeenCalled();
  log.mockRestore();
});

test("reports when a reviewed question is archived", async () => {
  rpc.mockResolvedValue({ data: "archived", error: null });
  const form = new FormData();
  form.set("id", id);
  await expect(removeCard({}, form)).rejects.toThrow("redirect");
  expect(redirect).toHaveBeenCalledWith("/admin?notice=archived");
});
