import { grotesk } from "../fonts";
import { TopicSelector } from "../../components/TopicSelector";

const topics: Record<string, string> = {
  React: "hooks, state, rendering",
  TypeScript: "",
  Postgres: "",
  "System Design": "",
  "Claude Code": "",
  "Web Performance": "",
};

export default function Home({}) {
  return (
    <div className="p-8">
      <h1 className={`${grotesk.className} text-6xl w-2/3`}>
        What do you want to practice today?
      </h1>
      <p className="py-4 text-2xl">
        Pick one or more topics. We&rsquo;ll shuffle their cards into one deck.
      </p>
      <TopicSelector topics={topics} />
    </div>
  );
}
