import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import hierarchy from "../assets/hierarchy.webp";
import { Button } from "./ui/button";
import { ArrowBigDownDash, ArrowBigUpDash, Eraser, Save } from "lucide-react";

export default function Header({
  onSave,
  onRestore,
  onExport,
  onLoadJSON,
  onClear,
}) {
  const [portfolioUrl, setPortfolioUrl] = useState("kaushikverma-portfolio.vercel.app");

  useEffect(() => {
    const handleGet = async () => {
      try {
        const resp = await fetch("https://pget.vercel.app");
        const data = await resp.json();
        setPortfolioUrl(data.portfolio);
      } catch (e) {
        console.log(e);
      }
    };

    handleGet();
  }, []);

  return (
    <header className="flex justify-between  items-center flex-row  shadow-md  p-1 w-full lg:w-auto rounded-t-md py-2 px-4 bg-[#27272A] text-white ">
      <div className="flex flex-row items-center justify-center gap-2 ">
        <div className="rounded-full w-8 h-8 flex justify-center items-center overflow-hidden ">
          <div className="w-5">
            <img src={hierarchy} alt="Hierarchy" />
          </div>
        </div>
        <p className="text-md sm:text-sm font-medium flex flex-wrap flex-col lg:flex-row gap-1">
          Visual Hierarchy{" "}
          <span className="border-animation">
            <a
              className="text-blue-500 text-sm duration-1000"
              target="_blank"
              href={portfolioUrl}
            >
              by <span className="font-bold">Kaushik Verma</span>
            </a>
          </span>
        </p>
      </div>
      <div className=" justify-center  lg:flex-row  flex items-center space-x-2 lg:space-x-4">
        <Button
          variant={"outline"}
          onClick={onClear}
          className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-500 outline-none active:scale-95 shadow-xs hover:bg-accent bg-input/30 border-input size-9 lg:size-auto lg:px-3 lg:py-2 text-xs text-white"
        >
          <Eraser />
          <span className="hidden lg:inline-block">Clear</span>
        </Button>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="bg-[#6366F1] hover:bg-[#6366F1]/90 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all shadow-xs size-9 lg:size-auto lg:px-3 lg:py-2 text-xs text-white active:scale-90 duration-500 outline-none">
                <ArrowBigDownDash className="w-5 h-5" />
                <span className="hidden lg:inline-block">Load</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className={"cursor-pointer"}
                onClick={onLoadJSON}
              >
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"cursor-pointer"}
                onClick={onRestore}
              >
                From LocalStorage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          onClick={onSave}
          className="border rounded-md py-1 px-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-500 outline-none active:scale-95 shadow-xs hover:bg-accent border-input size-9 lg:size-auto lg:px-3 lg:py-2 text-xs text-green-600 bg-green-600/20 hover:text-green-500 "
        >
          <Save />
          <span className="hidden lg:inline-block"> Save</span>
        </Button>
        <Button
          variant={"outline"}
          className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-1000  shrink-0  outline-none active:scale-95 border shadow-xs hover:bg-accent bg-input/30 border-input size-9 lg:size-auto lg:px-3 lg:py-2 text-xs"
        >
          <ArrowBigUpDash className="w-5 h-5" />
          <span className="hidden lg:inline-block" onClick={onExport}>
            {" "}
            Export Json
          </span>
        </Button>
      </div>
    </header>
  );
}
