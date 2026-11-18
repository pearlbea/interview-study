export async function QuizContent({
  searchParams,
}: {
  searchParams: Promise<{ topics: string }>;
}) {
  const { topics } = await searchParams;
  const topicList = topics ? topics.split(",").filter(Boolean) : [];

  return (
    <div>
      {topicList.length > 0 ? (
        <ul>
          {topicList.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      ) : (
        <p>No topics selected.</p>
      )}
    </div>
  );
}
