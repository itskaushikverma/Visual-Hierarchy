import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import hierarchy from '../assets/hierarchy.webp';
import { Button } from './ui/button';
import { ArrowBigDownDash, ArrowBigUpDash, Eraser, Save } from 'lucide-react';

export default function Header({ onSave, onRestore, onExport, onLoadJSON, onClear }) {
  const [portfolioUrl, setPortfolioUrl] = useState('kaushikverma-portfolio.vercel.app');

  useEffect(() => {
    const handleGet = async () => {
      try {
        const resp = await fetch('https://pget.vercel.app');
        const data = await resp.json();
        setPortfolioUrl(data.portfolio);
      } catch (e) {
        console.log(e);
      }
    };

    handleGet();
  }, []);

  return (
    <header className="flex w-full flex-row items-center justify-between rounded-t-md bg-[#27272A] p-1 px-4 py-2 text-white shadow-md lg:w-auto">
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
          <div className="w-5">
            <img src={hierarchy} alt="Hierarchy" />
          </div>
        </div>
        <p className="text-md flex flex-col flex-wrap gap-1 font-medium sm:text-sm lg:flex-row">
          Visual Hierarchy{' '}
          <span className="border-animation">
            <a className="text-sm text-blue-500 duration-1000" target="_blank" href={portfolioUrl}>
              by <span className="font-bold">Kaushik Verma</span>
            </a>
          </span>
        </p>
      </div>
      <div className="flex items-center justify-center space-x-2 lg:flex-row lg:space-x-4">
        <Button
          variant={'outline'}
          onClick={onClear}
          className="hover:bg-accent bg-input/30 border-input inline-flex size-9 cursor-pointer items-center justify-center gap-2 rounded-md text-xs font-medium whitespace-nowrap text-white shadow-xs transition-all duration-500 outline-none active:scale-95 lg:size-auto lg:px-3 lg:py-2"
        >
          <Eraser />
          <span className="hidden lg:inline-block">Clear</span>
        </Button>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="inline-flex size-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#6366F1] text-xs font-medium whitespace-nowrap text-white shadow-xs transition-all duration-500 outline-none hover:bg-[#6366F1]/90 active:scale-90 lg:size-auto lg:px-3 lg:py-2">
                <ArrowBigDownDash className="h-5 w-5" />
                <span className="hidden lg:inline-block">Load</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className={'cursor-pointer'} onClick={onLoadJSON}>
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem className={'cursor-pointer'} onClick={onRestore}>
                From LocalStorage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          onClick={onSave}
          className="hover:bg-accent border-input inline-flex size-9 cursor-pointer items-center justify-center gap-2 rounded-md border bg-green-600/20 px-2 py-1 text-xs font-medium whitespace-nowrap text-green-600 shadow-xs transition-all duration-500 outline-none hover:text-green-500 active:scale-95 lg:size-auto lg:px-3 lg:py-2"
        >
          <Save />
          <span className="hidden lg:inline-block"> Save</span>
        </Button>
        <Button
          variant={'outline'}
          className="hover:bg-accent bg-input/30 border-input inline-flex size-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border text-xs font-medium whitespace-nowrap shadow-xs transition-all duration-1000 outline-none active:scale-95 lg:size-auto lg:px-3 lg:py-2"
        >
          <ArrowBigUpDash className="h-5 w-5" />
          <span className="hidden lg:inline-block" onClick={onExport}>
            {' '}
            Export Json
          </span>
        </Button>
      </div>
    </header>
  );
}
