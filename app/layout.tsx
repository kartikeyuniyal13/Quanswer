
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import React from 'react'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
<header>
  <UserButton showName />
</header>
          <main>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
         
          {children}
          </SignedIn>
          </main>
         
        </body>
      </html>
    </ClerkProvider>
  )
}