/* eslint-disable no-useless-catch */
"use server";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";


export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const {searchQuery,filter,page=1,pageSize=10}=params;
    const query:FilterQuery<typeof Question>={};

    if(searchQuery){
      query.$or=[
        {title:{$regex:new RegExp(searchQuery,'i')}},
        {content:{$regex:new RegExp(searchQuery,'i')}}
      ]
    }

    let sortOptions={}

    switch(filter){
      case "newest":
        sortOptions={createdAt :-1}
        break;
      case "frequent":
        sortOptions={views:-1}
        break;
      case "unanswered":
        query.answers={$size:0}
        break;
      
        default:
        break;
    }
    
    const totalQuestions=await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      });
    
      const isNext=totalQuestions>(page*pageSize);
    return { questions,isNext };
  } catch (error) {
    console.log(error);
  }
}

// Create Question Action
export async function createQuestions(params: CreateQuestionParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create a Question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by +5

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getQuestionByID(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    // Get the question data
    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Upvote Question
export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    // Update Query to pass
    let updateQuery = {};

    // if already upvoted ---> remove from upvotes
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    }
    // if downvoted ---> remove from downvotes and add to upvote
    else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    }
    // If did not do anything yet---> just add to upvotes
    else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation by +10 for upvoting a question
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

// Down Vote Question
export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { userId, questionId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;
    await question.save();
    revalidatePath(path);
  } catch (error) {}
}



// NOTES ---findOneAndUpdate

/* This method is used to search for a tag with a specific name.

{ name: { $regex: new RegExp(^${tag}$, "i") } }: This part of the query is using a regular expression to perform a case-insensitive search for a tag with the given tag name. The ^ symbol denotes the start of the string, and the i flag makes the search case-insensitive.

{ $setOnInsert: { name: tag }, $push: { questions: question._id } }: If the tag is found, it will be updated with this operation. If not found (thanks to the upsert: true option), a new tag with the specified tag name will be inserted. This operation also pushes the _id of a question into the questions array of the tag, associating the question with the tag.

{ upsert: true, new: true }: These options indicate that if the tag does not exist (upsert: true), it should be inserted as a new tag, and the new: true option ensures that the method returns the updated (or newly created) tag document. */
