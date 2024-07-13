"use server";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Question from "@/database/question.model";


export async function getAllTags(params:GetAllTagsParams){
    try{
        connectToDatabase();
        const tags=await Tag.find({});
        return {tags};
    }catch(error){
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