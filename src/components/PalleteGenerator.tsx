"use client";
import { useEffect, useState } from "react";
import chroma from "chroma-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "./ui/card";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Mockup from "./Mockup";
import { useRouter, useSearchParams } from "next/navigation";

// const colorKeys = [
//   "background",
//   "foreground",
//   "card",
//   "card-foreground",
//   "popover",
//   "popover-foreground",
//   "primary",
//   "primary-foreground",
//   "secondary",
//   "secondary-foreground",
//   "muted",
//   "muted-foreground",
//   "accent",
//   "accent-foreground",
//   "destructive",
//   "destructive-foreground",
//   "border",
//   "input",
//   "ring",
// ];

const PaletteGenerator = () => {
  const [palette, setPalette] = useState<Record<string, string>>({});
  const [cssSnippet, setCssSnippet] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlPalette = searchParams.get("palette");
    const dark = searchParams.get("dark");
    if (urlPalette) {
      try {
        const decodedPalette = JSON.parse(atob(urlPalette as string));
        setPalette(decodedPalette);
        setIsDarkMode(dark === "true");
      } catch (error) {
        console.error("Error parsing palette from URL:", error);
      }
    }
  }, [searchParams]);

  const generateAccessiblePalette = () => {
    try {
      const newPalette: Record<string, string> = {};

      // Generate a random base hue
      const baseHue = Math.random() * 360;

      const generateColor = (
        hue: number,
        saturation: number,
        lightness: number
      ): string => {
        const h = Math.round(hue % 360);
        const s = Math.round(saturation * 100);
        const l = Math.round(lightness * 100);
        // Avoid pure white and pure black
        const adjustedL = isDarkMode
          ? Math.max(5, Math.min(l, 95))
          : Math.max(5, Math.min(l, 95));
        return `hsl(${h}, ${s}%, ${adjustedL}%)`;
      };

      // Generate base colors
      newPalette["primary"] = generateColor(
        baseHue,
        0.6,
        isDarkMode ? 0.6 : 0.4
      );
      newPalette["secondary"] = generateColor(
        (baseHue + 30) % 360,
        0.5,
        isDarkMode ? 0.7 : 0.3
      );
      newPalette["accent"] = generateColor((baseHue + 60) % 360, 0.7, 0.5);
      newPalette["destructive"] = generateColor(
        0,
        0.85,
        isDarkMode ? 0.6 : 0.4
      );

      // Generate foreground colors
      const getContrastColor = (bgColor: string) => {
        const backgroundColor = chroma(bgColor);
        const luminance = backgroundColor.luminance();
        return luminance > 0.5
          ? generateColor(baseHue, 0.1, 0.1)
          : generateColor(baseHue, 0.1, 0.9);
      };

      ["primary", "secondary", "accent", "destructive"].forEach((key) => {
        newPalette[`${key}-foreground`] = getContrastColor(newPalette[key]);
      });

      // Generate remaining colors
      newPalette["background"] = generateColor(
        baseHue,
        0.1,
        isDarkMode ? 0.1 : 0.95
      );
      newPalette["foreground"] = generateColor(
        baseHue,
        0.1,
        isDarkMode ? 0.9 : 0.1
      );
      newPalette["card"] = generateColor(
        baseHue,
        0.05,
        isDarkMode ? 0.15 : 0.98
      );
      newPalette["card-foreground"] = newPalette["foreground"];
      newPalette["popover"] = newPalette["background"];
      newPalette["popover-foreground"] = newPalette["foreground"];
      newPalette["muted"] = generateColor(baseHue, 0.2, isDarkMode ? 0.2 : 0.8);
      newPalette["muted-foreground"] = generateColor(
        baseHue,
        0.3,
        isDarkMode ? 0.7 : 0.3
      );
      newPalette["border"] = generateColor(
        baseHue,
        0.15,
        isDarkMode ? 0.3 : 0.7
      );
      newPalette["input"] = newPalette["border"];
      newPalette["ring"] = chroma(newPalette["primary"]).alpha(0.3).css();

      setPalette(newPalette);
      updateURL(newPalette);
    } catch (error) {
      console.error("Error generating palette:", error);
    }
  };

  const updateURL = (newPalette: Record<string, string>) => {
    const encodedPalette = btoa(JSON.stringify(newPalette));
    router.push(`?palette=${encodedPalette}&dark=${isDarkMode}`);
  };

  const generateCssSnippet = () => {
    const snippet = `:root {
${Object.entries(palette)
  .map(([key, value]) => `  --${key}: ${value};`)
  .join("\n")}
  --radius: 0.5rem;
}

.dark {
${Object.entries(palette)
  .map(([key, value]) => `  --${key}: ${value};`)
  .join("\n")}
}`;
    setCssSnippet(snippet);
  };
  const copyToClipboard = () => {
    // const copyShareLink = () => {
    //   const shareLink = window.location.href;
    //   navigator.clipboard.writeText(shareLink);
    //   alert("Share link copied to clipboard!");
    // };
    navigator.clipboard.writeText(cssSnippet);
    alert("CSS variables copied to clipboard!");
  };

  return (
    <>
      <Mockup palette={palette} />

      <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                aria-label="Dark Mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <span>Dark Mode</span>
            </div>{" "}
            <div className="flex items-center space-x-2">
              <Button onClick={generateAccessiblePalette}>
                Generate Palette
              </Button>

              {/* <Button onClick={copyShareLink}>Copy Share Link</Button> */}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={generateCssSnippet}>
                  Export CSS Variables
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    CSS Variables Preview
                    <VisuallyHidden>CSS Variables Preview</VisuallyHidden>
                  </DialogTitle>
                </DialogHeader>
                <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-[400px]">
                  {cssSnippet}
                </pre>
                <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PaletteGenerator;
