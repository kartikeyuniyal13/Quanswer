"use client";

import React from 'react'
import { useTheme } from '@/context/ThemeProvider'
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import Image from 'next/image';
  
const Theme = () => {
    const {mode,setMode} = useTheme();
  return (
    <Menubar className='relative border-none bg-transparent shadow-none'>
  <MenubarMenu>
    <MenubarTrigger className='focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200'>{
        mode==='light' ? (<Image src='/assets/icons/sun.svg' alt='sun' width={20} height={20} className='active-theme'/>):(<Image src='/assets/icons/moon.svg' alt='moon' width={20} height={20} className='active-theme' />)
        
        }</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>

  )
}

export default Theme