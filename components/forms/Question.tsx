"use client"
import React, { useState} from 'react'
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
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion } from '@/lib/actions/question.action';


const activity:any="create"


const Question = () => {
    const editorRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
   
        // 1. Define schema your form.
        const form = useForm<z.infer<typeof QuestionsSchema>>({
          resolver: zodResolver(QuestionsSchema),
          defaultValues: {
            title: "",
            description: "",
            tags: [],
          },
        })
      
    
        const handleTagRemove=(tag:string,field:any)=>{
            const newTags=field.value.filter((t:string)=>{return t!==tag})
            form.setValue('tags',newTags)

        }

        const handleInputKeyDown=(e:React.KeyboardEvent<HTMLInputElement>,field:any)=>{
            
            if(e.key==='Enter'){
            e.preventDefault();
            const tagInput=e.target as HTMLInputElement;
            const tagValue=tagInput.value.trim();

            if(tagValue!==''){
                if(tagValue.length>15){
                    return form.setError('tags',{
                        type:'required',
                        message:'Tag must be at most 15 characters long'
                    })
                }
               if(!field.value.includes(tagValue as never)){
                      form.setValue('tags',[...field.value,tagValue])
                      tagInput.value='';
                      form.clearErrors('tags')
               }
            }
            else{
                form.trigger();
            }
        }
        }

        
        async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
            setIsSubmitting(true);
        
            try {
             await createQuestion({});
            } catch (error) {
                console.log(error)
            } finally {
              setIsSubmitting(false);
            }
        
            console.log(values);
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
              <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                  onInit={(_evt, editor) => {
                    // @ts-expect-error: Type mismatch expected here
                    editorRef.current = editor;
                  }}
                 onBlur={field.onBlur}
                 onEditorChange={(content)=>field.onChange(content)} 
                  
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
      /> 
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
                <>
                <Input
                
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border "
                  placeholder='Add tags...'
                  onKeyDown={(e)=>handleInputKeyDown(e,field)}
                />
                {
                   field.value.length>0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                        {
                            field.value.map((tag:any)=>{
                                return(
                                    <Badge 
                                    className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                                    key={tag} 
                                    onClick={()=>{handleTagRemove(tag,field)}}>
                                        {tag}
                                        <Image src='/assets/icons/close.svg' width={12} height={12} alt='close'
                                        className='cursor-pointer object-contain invert-0 dark:invert' />
                                    </Badge>
                                )
                            })
                        }
                    </div>
                   )
                }

                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add upto 3 tags to describe what your question is about. You
                need to enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />{/* for showing error*/}
            </FormItem>
          )}
        />
             <Button
          type="submit"
          disabled={isSubmitting}
          className="primary-gradient w-fit !text-light-900"
        >
          {isSubmitting ? (
            <>{activity === "edit" ? "Editing" : "Posting..."}</>
          ) : (
            <>{activity === "edit" ? "Edit" : "Ask a Question"}</>
          )}
        </Button>
          </form>
        </Form>
      )
}

export default Question