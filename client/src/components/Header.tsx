import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [_, setLocation] = useLocation();
  
  return (
    <header className="bg-white shadow-sm px-4 py-2 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="mt-6 flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-2">Monefy Pro</h2>
                <Link href="/" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link href="/budget" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <span className="font-medium">Budget</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <span className="font-medium">Settings</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold">Monefy Pro</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2">
            <Search className="w-6 h-6" />
          </button>
          <button className="p-2" onClick={() => setLocation("/settings")}>
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
