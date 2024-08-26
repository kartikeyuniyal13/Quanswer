"use server";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import { questions } from "@/constants";
import { FilterQuery } from "mongoose";
import { ITag } from "@/database/tag.model";


export async function getAllTags(params: GetAllTagsParams) {

    try {
        connectToDatabase();
        const { searchQuery,page=1,pageSize=10 } = params;
        const query: FilterQuery<typeof Tag> = {};
        if (searchQuery) {
          query.$or = [
            {
              name: { $regex: new RegExp(searchQuery, "i") },
            },
          ];
        }
        const tags = await Tag.find(query).skip((page - 1) * pageSize).limit(pageSize + 1).limit(pageSize);

        const totalTags = await Tag.countDocuments(query);
        const isNext = totalTags > page * pageSize;
        return { tags, isNext };
    } catch (error) {
        console.log(error);
        throw new Error('Tags not found');
    }
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase();
        const { userId, limit = 1 } = params;


        const tags = await Question.aggregate([
            {
                $match: {
                    $or: [
                        { author: userId },
                        { upvotes: userId },
                        { downvotes: userId }
                    ]
                }
            },
            { $unwind: "$tags" },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tagDetails"
                }
            },
            { $unwind: "$tagDetails" },
            {
                $group: {
                    _id: { tagId: "$tagDetails._id", tagName: "$tagDetails.name" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    tagId: "$_id.tagId",
                    tagName: "$_id.tagName",
                    count: 1
                }
            }
        ]);


        tags.forEach((tag, index) => {
            console.log(`Step ${index + 1}:`, tag);
        });

        console.log("Final Tags:", tags);

        return tags;
    } catch (error) {
        console.error("Error in getTopInteractedTags:", error);
        throw new Error("Tags not found");
    }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
      await connectToDatabase();
      const { tagId, searchQuery, page = 1, pageSize = 10 } = params;
  
      const skipAmount = (page - 1) * pageSize;
  
      const tagFilter: FilterQuery<ITag> = { _id: tagId };
  
      const tag = await Tag.findOne(tagFilter).populate({
        path: "questions",
        model: Question,
        match: searchQuery
          ? { title: { $regex: searchQuery, $options: "i" } }
          : {},
        options: {
          skip: skipAmount,
          limit: pageSize + 1,
          sort: { createdAt: -1 },
        },
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          { path: "author", model: User, select: "_id clerkId name picture" },
        ],
      });
  
      if (!tag) {
        throw new Error("Tag not found");
      }
  
      const isNext = tag.questions.length > pageSize;
      const questions = tag.questions;
  
      return { tagTitle: tag.name, questions, isNext };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }