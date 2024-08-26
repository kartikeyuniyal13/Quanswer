"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import console from "console";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";

// Get User By Id Server Action
export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Create User Server Action
export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);
    return newUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Update User Server Action
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Delete User Server Action
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete User from database
    // Delete questions , answers, comments,etc

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc

    // Delete User
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}


export async function getAllUsers(params: GetAllUsersParams) {

  try {
    connectToDatabase();
    const { searchQuery, page = 1, pageSize = 10 } = params;

    const query = searchQuery
      ? {
        $or: [
          { name: { $regex: new RegExp(searchQuery, "i") } },
          { username: { $regex: new RegExp(searchQuery, "i") } },
        ],
      }
      : {};

    const totalUsers = await User.countDocuments();
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const isNext = totalUsers > (page * pageSize);
    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();
    const { userId, questionId, path } = params;


    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}


export async function getSavedQuestions(params: GetSavedQuestionsParams) {


  try {
    connectToDatabase();
    const { clerkId, searchQuery, page = 1, pageSize = 10 } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? {
        title: { $regex: new RegExp(searchQuery, "i") },
      }
      : {};

    const user = await User.findOne({ clerkId })
      .populate({
        path: "saved",
        match: query,
        options: {
          sort: { createdAt: -1 },
          skip: ((page - 1) * pageSize),
          limit: pageSize + 1
        },
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          { path: "author", model: User, select: "_id clerkId name picture" },
        ],
      });

    if (!user) {
      throw new Error("User not found");
    }
    const isNext = user.saved.length > pageSize;

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId, } = params;
    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };


  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNext = totalQuestions > page * pageSize;

    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
  }
}


export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("question", "_id title").populate("author", "_id clerkId name picture");


    const isNext = totalAnswers > page * pageSize;
    return { totalAnswers, answers: userAnswers, isNext };
  } catch (error) {
    console.log(error);
  }
}