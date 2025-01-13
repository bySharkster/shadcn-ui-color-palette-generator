import PaletteGenerator from "@/components/PalleteGenerator";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center h-screen mx-auto bg-background text-foreground">
      <PaletteGenerator />
      <Toaster position="bottom-center" />
    </div>
  );
}
