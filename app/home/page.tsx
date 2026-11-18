import { grotesk } from "../fonts";
import { Suspense } from "react";
import { Topics } from "../../components/Topics";

export default async function Home({}) {
  return (
    <Suspense fallback="fetching topics">
      <div className="p-8">
        <h1 className={`${grotesk.className} text-6xl w-2/3`}>
          What do you want to practice today?
        </h1>
        <p className="py-4 text-2xl">
          Pick one or more topics. We&rsquo;ll shuffle their cards into one
          deck.
        </p>
        <Topics />
      </div>
    </Suspense>
  );
}
