import PaletteGenerator from "@/components/PaletteGenerator";
import { Suspense } from "react";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center h-screen mx-auto ">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
              </div>
            </div>
          </div>
        }
      >
        <PaletteGenerator />
      </Suspense>
      <Toaster position="bottom-center" />
    </div>
  );
}
