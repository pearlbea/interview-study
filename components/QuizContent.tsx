export async function QuizContent({
  searchParams,
}: {
  searchParams: Promise<{ topics: string }>;
}) {
  const { topics } = await searchParams;
  const topicList = topics ? topics.split(",").filter(Boolean) : [];

  // TODO: Style topic badges
  return (
    <div className="flex max-w-4xl">
      <div className="flex justify-between gap-8">
        <div>back Topics</div>
        <ul className="flex">
          {topicList.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
