'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const query = searchParams.get('global')
  const [search, setSearch] = useState(query || '')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (search) {
        const newUrl = createUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search

        })

        router.push(newUrl, { scroll: false })
      } else {
        //if(query) checks whether we are having an active query in the URL due to the local search if so we can remove the global query key 
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['global','type']
          })
          router.push(newUrl, { scroll: false })
        }
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [ pathname, router, search])
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen)
              setIsOpen(true);

            if (e.target.value === '' && isOpen)
              setIsOpen(false);
          }
          }
          placeholder="Search globally"
          className="paragraph-regular no-focus placeholder text-dark400_light700 background-light800_darkgradient border-none shadow-none outline-none"
        />
      </div>
      {
        isOpen && <GlobalResult/>
      }
    </div>
  );
};

export default GlobalSearch;