"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose"

export async function createQuestion(params:any){
    try{
     connectToDatabase();
     const {title,content,tags,author,path}=params;
     const question =await Question.create({
        title,content,author
     })
    }
    catch(error){

    }
}