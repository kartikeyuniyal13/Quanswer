"use client";
import React from "react";
import { Button } from "../ui/button";
import { createUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  pageNumber: number;
  isNext: boolean | undefined;
}

const  Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;

    const newUrl = createUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;
  return (
    <div className=" flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        className=" light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        onClick={() => {
          handleNavigation("prev");
        }}
      >
        <p className=" body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className=" flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className=" body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        className=" light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        onClick={() => {
          handleNavigation("next");
        }}
      >
        <p className=" body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;