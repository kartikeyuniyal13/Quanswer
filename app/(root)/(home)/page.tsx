import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NoResults from "@/components/shared/NoResults";

import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import LocalSearchbar from "@/components/shared/search/LocalSearch";
import HomeFilter from "@/components/Home/HomeFilter";
import QuestionCard from "@/components/Card/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";

interface Question {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; picture: string };
  votes: number;
  answers: string[]; // Assuming answers are IDs referencing Answer documents
  views: number;
  createdAt: Date;
}

export default  async function Home () {
        let result: any;
        let questions;

  try {
    // Get the Questions from DB
    result = await getQuestions({});
    questions=result.questions;
  } catch (error) {
    // Handle any errors that occur during the data fetching
    console.error("Error fetching questions:", error);
  }
    

  return (
    <>
      <div className="w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center flex">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      {/* SEARCHBARS */}
      <div className="mt-11 flex h-40 flex-col justify-between gap-2 max-md:flex-row max-sm:flex-col max-sm:justify-evenly sm:items-start">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        <HomeFilter />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question:any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              votes={question.votes}
              answers={question.answers}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResults
            title="No Questions Found"
            description="Be the first one to ask a question!"
            link="/"
            linkText="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

