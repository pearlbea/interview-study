"use client";

import { useActionState } from "react";
import { removeCard } from "./actions";
import { Button } from "@/components/ui/button";

export function RemoveCard({ id }: { id: string }) {
  const [state, action, pending] = useActionState(removeCard, {});

  return (
    <form action={action} onSubmit={(event) => {
      if (!window.confirm("Remove this card? Reviewed cards will be archived instead.")) {
        event.preventDefault();
      }
    }}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Removing…" : "Remove"}
      </Button>
      {state.error && <p role="alert" className="text-destructive">{state.error}</p>}
    </form>
  );
}
