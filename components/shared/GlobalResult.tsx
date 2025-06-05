'use client'
import React,{useState,useEffect} from 'react'
import { useSearchParams } from 'next/navigation'
import { ReloadIcon } from "@radix-ui/react-icons";
import { sendStatusCode } from 'next/dist/server/api-utils';

const GlobalResult = () => {
    const searchParams=useSearchParams()
    const global=searchParams.get('global')
    const type=searchParams.get('type')
    const [isLoading,setIsLoading]=useState(false)
    const [result,setResult]=useState([])
    
    useEffect(()=>{
      const searchResult=()=>{ 
         try{

        }catch(error){

        }
        finally{
            
        }}
    },[])

  return (
    <div>
        <div>

            <div>
                {
                    isLoading ?
                    (<div>
                      <ReloadIcon className='animate-spin'/>
                    </div>):(
                        <div>
                        content
                    </div>)
                }
            </div>
        </div>
    </div>
  )
}

export default GlobalResult