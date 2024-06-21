import { Inter, Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import React from 'react'

const inter=Inter({
  subsets:['latin'],weight:['100','200','300','400','500','600','700','800','900'],variable:'--font-inter'
})

const spaceGrotesk=Space_Grotesk({
  subsets:['latin'],weight:['300','400','500','600','700'],variable:'--font-spaceGrotesk'
})
 


export const metadata:Metadata={
    title:"Quanswer",
    description:"A repositiory of knowledge",
    keywords:"nextpro1",
    icons:{
      icon:'/assets/images/site-logo.svg',
    }
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

    <ClerkProvider
    appearance={
      {
        elements:{formButtonPrimary:'primary-gradient',footerActionLink:'primary-text-gradient hover:text-primary-500'},
      }
    }>
     
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
<header>
  <UserButton showName />
</header>
          <main>
            <h1  className='h1-bold'>
              demo text
            </h1>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
             <UserButton showName/>
         
          </SignedIn>
          {children}
          </main>
         
        </body>
  
    </ClerkProvider>
    </html>
  )
}