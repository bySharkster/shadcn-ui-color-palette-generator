import PaletteGenerator from "@/components/PalleteGenerator";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center h-screen mx-auto ">
      <PaletteGenerator />
      <Toaster position="bottom-center" />
    </div>
  );
}
