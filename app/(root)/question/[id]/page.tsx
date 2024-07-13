import React from 'react'
import { getQuestionById } from '@/lib/actions/question.action';
const Page = async ({params,searchParams}: {params: any, searchParams: any}) => {
    const question= await getQuestionById({questionId:params.id});
  return (
    <div>
        {question && question.title}
    </div>
  )
}

export default Page