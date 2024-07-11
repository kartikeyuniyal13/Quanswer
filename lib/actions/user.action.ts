"use server"

import { connectToDatabase } from "../mongoose"
import User from "@/database/user.model";
import { CreateUserParams, DeleteUserParams, GetUserByIdParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params:GetUserByIdParams){
    try{
         connectToDatabase();
         const {userId} =params;
         const user=await User.findOne({clerkId:userId})
            return user;
    }catch(error){
        console.log(error);
        throw new Error('User not found');
    }
}
export async function createUser(params:CreateUserParams){
    try{
         connectToDatabase();

         const {clerkId,name,username,email,picture}=params;
         const newUser =await User.create(params);
         
            return newUser;
    }catch(error){
        console.log(error);
        throw new Error('User not created');
    }
}

export async function updateUser(params:UpdateUserParams){
    try{
      connectToDatabase();
      const {clerkId,updateData,path}=params;
      const user= await User.findOneAndUpdate({clerkId:clerkId},updateData,{new:true})
      revalidatePath(path);
    }catch(error){
        console.log(error);
        throw new Error('User not updated');
    }
}

// Delete User Server Action
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;

    // Find and delete the user by clerkId
    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user-related data from the database
    // Delete user questions
    
    //@ts-ignore
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc

    // User already deleted by clerkId, no need to delete again by _id
    // Return the deleted user information if needed
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
}