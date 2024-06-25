"use client"

import React from 'react'
import { sidebarLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import { SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const LeftSidebar = () => {
  const pathName= usePathname();
  return (
    <section className='background-light900_dark200 light_border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px] custom-scrollbar'>
      <div className='flex flex-1 flex-col gap-6    '>

    {sidebarLinks.map((item)=>{

        const isActive=(pathName.includes(item.route) && item.route.length>1)|| pathName===item.route;

return(

<Link href={item.route} className={`${isActive?"primary-gradient rounded-lg text-light-900" :"text-dark300_light900 "}items-center justify-start gap-4 bg-transparent p-4  flex `} key={item.route}>
<Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}>
                {item.label}
              </p>
            </Link>
)
    } )}

      </div>
      <SignedOut>
            <div className="flex flex-col gap-3">
             
                <Link href="/sign-in">
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">

<Image src="/assets/icons/account.svg" alt="login" width={20} height={20} className='"invert-colors lg:hidden "'/>



                    <span className="primary-text-gradient max-lg:hidden"> Log In</span>
                  </Button>
                </Link>
          
             
                <Link href="/sign-up">
                  <Button className="small-medium btn-tertiary text-dark400_light900 light-border-2 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                  <Image src="/assets/icons/sign-up.svg" alt="sign-up" width={20} height={20} className='"invert-colors lg:hidden "'/>



<span className="max-lg:hidden"> Sign up</span>
                  </Button>
                </Link>
            
            </div>
          </SignedOut>






    </section>
  )
}
export default LeftSidebar