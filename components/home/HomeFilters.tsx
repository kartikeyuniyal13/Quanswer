"use client";
import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { createUrlQuery,removeKeysFromQuery } from "@/lib/utils";

const HomeFilters = () => {
  const [active, setActive] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeClick = (filter: string) => {
    let newUrl = "";

    if (filter === active) {
      setActive("");

      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setActive(filter);

      newUrl = createUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {
        HomePageFilters.map((item) => (
          <Button key={item.value} 
            onClick={() => handleTypeClick(item.value)}
            className={`body-me dium rounded-lg px-6 py-3 capitalize shadow-none ${active === item.value ? 'bg-primary-100 text-primary-500' : 'bg-light-800 text-light-500'}`}>{item.name}</Button>
        ))
      }

    </div>
  );
};

export default HomeFilters;
