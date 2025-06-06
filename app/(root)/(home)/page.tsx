export const dynamic = "force-dynamic";
import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearchbar from "@/components/shared/LocalSearchbar";

import { Button } from "@/components/ui/button";

import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import { getQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

export default async function Home({searchParams}:SearchParamsProps) {
  let result;
  try {
    result = await getQuestions({
      searchQuery: searchParams?.q,
      filter:searchParams?.filter,
      page:searchParams.page?+searchParams.page:1,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="h1-bold text-dark100_light900">All Question</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      {/* SEARCHBARS */}
      <div className="mt-11 flex h-40 flex-col justify-between gap-2  max-md:flex-row max-sm:flex-col max-sm:justify-evenly sm:items-start">
        <LocalSearchbar
        route="/"
        iconPosition="left"
        imgSrc="/assets/icons/search.svg"
        placeholder="Search for questions"
        otherClasses="flex-1"
        />
    
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        <HomeFilters />
      </div>

      {/* QUESTION CARD */}
      <div className="mt-10 flex w-full flex-col gap-6 ">
        {result && result.questions && result.questions.length > 0 ? (
          result.questions.map((question) => {
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
            title=" There’s no question to show"
            description="Ask a question or try searching for something else."
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result?.isNext}
        />
      </div>
    </>
  );
}
