"use client"
import React from 'react'
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { QuestionsSchema } from '@/lib/validations'





const Question = () => {
    const editorRef = useRef(null);
   
        // 1. Define your form.
        const form = useForm<z.infer<typeof QuestionsSchema>>({
          resolver: zodResolver(QuestionsSchema),
          defaultValues: {
            title: "",
            description: "",
            tags: [],
          },
        })
      
        // 2. Define a submit handler.
        function onSubmit(values: z.infer<typeof QuestionsSchema>) {
          // Do something with the form values.
          // ✅ This will be type-safe and validated.
          console.log(values)
        }
      
      return (
        <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className=" flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 ">
                Question Title
                <span className="ml-1 text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border "
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person
              </FormDescription>
              <FormMessage className="text-red-500" />{/* for showing error*/}
            </FormItem>
          )}
        />
           <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className=" flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 ">
                Detailed Explanation of your problem
                <span className="ml-1 text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                {/* <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                  onInit={(_evt, editor) => {
                    // @ts-expect-error: Type mismatch expected here
                    editorRef.current = editor;
                  }}
                  
                  
        init={{
          height: 350,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | ' +
            'codesample | bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist  ',
            
          content_style: 'body { font-family:Inter; font-size:16px }'
        }}
      /> */}
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )} 
        />
         <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className=" flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 ">
              Tags
                <span className="ml-1 text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border "
                  placeholder='Add tags...'
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person
              </FormDescription>
              <FormMessage className="text-red-500" />{/* for showing error*/}
            </FormItem>
          )}
        />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
}

export default Question