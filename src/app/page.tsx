import PaletteGenerator from "@/components/PaletteGenerator";
import { Suspense } from "react";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center h-screen mx-auto ">
      <Suspense fallback={<div>Loading...</div>}>
        <PaletteGenerator />
      </Suspense>
      <Toaster position="bottom-center" />
    </div>
  );
}
