import { Suspense } from "react";
import { Topics } from "../../components/Topics";
import Link from "next/link";

export default async function Home({}) {
  return (
    <Suspense fallback="fetching topics">
      <div className="p-8">
        <h1 className="text-6xl w-2/3 font-heading font-bold">
          What do you want to practice today?
        </h1>
        <p className="py-4 mb-8 text-2xl">
          Pick one or more topics. We&rsquo;ll shuffle their cards into one
          deck.
        </p>
        <Topics />
        <p className="mt-8"><Link href="/admin" className="underline">Manage questions</Link></p>
      </div>
    </Suspense>
  );
}
