import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import LocalSearchbar from "@/components/shared/LocalSearchbar";

const  Collection=async ({ searchParams }: SearchParamsProps) =>{
    
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const searchQuery=searchParams?.q;

  const result = await getSavedQuestions({ clerkId: userId, searchQuery });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      {/* SEARCHBARS */}
      <div className="mt-11 flex justify-between gap-2  max-md:flex-row max-sm:flex-col max-sm:justify-evenly sm:items-start">
        <LocalSearchbar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search among your saved questions"
          otherClasses="flex-1"
        />
     
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      {/* QUESTION CARD */}
      <div className="mt-10 flex w-full flex-col gap-6 ">
        {result && result.questions && result.questions.length > 0 ? (
          result.questions.map((question: any) => {
            return (
              <QuestionCard
                _id={question._id}
                key={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                answers={question.answers}
                views={question.views}
                createdAt={question.createdAt}
              />
            );
          })
        ) : (
          <NoResults
            title=" There’s no saved questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
export default Collection;