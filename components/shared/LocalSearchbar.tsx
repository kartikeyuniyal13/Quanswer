"use client"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createUrlQuery, removeKeysFromQuery } from "@/lib/utils"


interface CustomInputProps {
    route: string
    iconPosition: string
    imgSrc: string
    placeholder: string
    otherClasses?: string
}
const LocalSearchbar = ({
    //route is the path where the search bar will be used, for example, "/tags" or "`/tags/${params.id}`" or "/community"
    route,
    iconPosition,
    imgSrc,
    placeholder,
    otherClasses
}: CustomInputProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const query = searchParams.get('q')
    const [search, setSearch] = useState(query || '')
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (search) {
                const newUrl = createUrlQuery({
                    params: searchParams.toString(),
                    key: 'q',
                    value: search

                })

                router.push(newUrl, { scroll: false })
            } else {

                //Without this check, the q parameter might be removed from the URL even when the user is on a different page, which could lead to unexpected behavior.

                //The line if (pathname === route) ensures that the logic for clearing the q query parameter only runs when the user is on the specified route. This prevents unintended modifications to the URL when the search bar is used on other pages.
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['q']
                    })
                    router.push(newUrl, { scroll: false })
                }
            }
        }, 500)

        return () => clearTimeout(debounceTimer)
    }, [route, pathname, router, search])


    return (
        <div
            className={`background-light800_darkgradient flex min-h-[56px] 
      grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
        >
            {iconPosition === "left" && (
                <Image
                    src={imgSrc}
                    alt="search icon"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
            )}
            <Input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="paragraph-regular no-focus placeholder
         text-dark300_light700 border-none bg-transparent shadow-none outline-none"
            />
            {iconPosition === "right" && (
                <Image
                    src={imgSrc}
                    alt="search icon"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
            )}
        </div>
    )
}

export default LocalSearchbar