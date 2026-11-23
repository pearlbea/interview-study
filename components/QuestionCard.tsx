"use client";

export function QuestionCard({ question }: { question: string }) {
  return (
    <>
      <div className="relative pt-4 mt-8">
        <div className="absolute top-0 inset-x-6 bottom-6 bg-(--chart-1) rounded-4xl -rotate-[1.6deg]"></div>
        <div className="absolute top-2 inset-x-3 bottom-3 bg-(--chart-3) rounded-4xl rotate-[1.2deg]"></div>
        <div className="relative bg-white border-2 border-(--foreground) rounded-4xl shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
          <div className="flex">
            <span className="font-bold">QUESTION</span>
          </div>
          <h2 className="font-heading text-xl">{question}</h2>
          <div>
            <span>Your answer</span>
          </div>
        </div>
      </div>
    </>
  );
}
