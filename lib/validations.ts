
import { z } from "zod";
export const QuestionsSchema = z.object({
    title:z.string().min(10, 'Title must be at least 10 characters long').max(100, 'Title must be at most 100 characters long'),
    description:z.string().min(20, 'Description must be at least 20 characters long').max(500, 'Description must be at most 500 characters long'),
    tags:z.array(z.string().min(1).max(15)).min(1, 'Please select at least one tag').max(5, 'You can select at most 5 tags'),
})