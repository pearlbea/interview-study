import { Suspense } from "react";
import { QuizContent } from "../../components/QuizContent";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ topics: string }>;
}) {
  return (
    <>
      <Suspense fallback={<p>Loading quiz...</p>}>
        <QuizContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
