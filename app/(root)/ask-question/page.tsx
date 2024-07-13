import React from 'react';
import Question from '@/components/forms/Question';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';

const Page = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const mongoUser = await getUserById({ userId });
  
  if (!mongoUser) {
    // Handle the case where the user is not found
    
    return (
      <div>
        <h1 className='h1-bold text-dark100_light900'>User not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
      <div className='mt-9'>
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
}

export default Page;



/**import React from 'react';
import Question from '@/components/forms/Question';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';

const Page = async () => {
  // const { userId } = auth();

  // }else{
   
  // const clerkId = userId;
  const userId = '123456789';
  
  if (!userId) {
    redirect('/sign-in');
  }

  const mongoUser = await getUserById({ userId });
  
  if (!mongoUser) {
    // Handle the case where the user is not found
    console.error('User not found');
    return (
      <div>
        <h1 className='h1-bold text-dark100_light900'>User not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
      <div className='mt-9'>
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
}

export default Page; */