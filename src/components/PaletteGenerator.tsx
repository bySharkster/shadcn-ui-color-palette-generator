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
import { Card, CardContent } from "./ui/card";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Mockup from "./Mockup";
import { useSearchParams } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "next-themes";

const PaletteGenerator = () => {
  const { theme, systemTheme } = useTheme();
  const [palettes, setPalettes] = useState<{
    light: Record<string, string>;
    dark: Record<string, string>;
  }>({ light: {}, dark: {} });
  const [cssSnippet, setCssSnippet] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadPaletteFromURL = () => {
      const urlPalette = searchParams.get("palette");
      const dark = searchParams.get("dark");
      if (urlPalette) {
        try {
          const decodedPalettes = JSON.parse(atob(urlPalette as string));
          setPalettes(decodedPalettes);
          const isDark = dark === "true";
          setIsDarkMode(isDark);
        } catch (error) {
          console.error("Error parsing palette from URL:", error);
        }
      } else {
        // Set initial dark mode based on theme
        const effectiveTheme = theme === "system" ? systemTheme : theme;
        setIsDarkMode(effectiveTheme === "dark");
      }
    };

    loadPaletteFromURL();
  }, [searchParams, theme, systemTheme]);

  const generateAccessiblePalette = () => {
    try {
      const baseHue = Math.random() * 360;
      const generatePaletteForMode = (isDark: boolean) => {
        const newPalette: Record<string, string> = {};

        const generateColor = (
          hue: number,
          saturation: number,
          lightness: number
        ): string => {
          const h = Math.round(hue % 360);
          const s = Math.round(saturation * 100);
          const l = Math.round(lightness * 100);
          const adjustedL = isDark
            ? Math.max(5, Math.min(l, 95))
            : Math.max(5, Math.min(l, 95));
          return `hsl(${h}, ${s}%, ${adjustedL}%)`;
        };

        newPalette["primary"] = generateColor(baseHue, 0.6, isDark ? 0.6 : 0.4);
        newPalette["secondary"] = generateColor(
          (baseHue + 30) % 360,
          0.5,
          isDark ? 0.7 : 0.3
        );
        newPalette["accent"] = generateColor((baseHue + 60) % 360, 0.7, 0.5);
        newPalette["destructive"] = generateColor(0, 0.85, isDark ? 0.6 : 0.4);

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

        newPalette["background"] = generateColor(
          baseHue,
          0.1,
          isDark ? 0.1 : 0.95
        );
        newPalette["foreground"] = generateColor(
          baseHue,
          0.1,
          isDark ? 0.9 : 0.1
        );
        newPalette["card"] = generateColor(baseHue, 0.05, isDark ? 0.15 : 0.98);
        newPalette["card-foreground"] = newPalette["foreground"];
        newPalette["popover"] = newPalette["background"];
        newPalette["popover-foreground"] = newPalette["foreground"];
        newPalette["muted"] = generateColor(baseHue, 0.2, isDark ? 0.2 : 0.8);
        newPalette["muted-foreground"] = generateColor(
          baseHue,
          0.3,
          isDark ? 0.7 : 0.3
        );
        newPalette["border"] = generateColor(baseHue, 0.15, isDark ? 0.3 : 0.7);
        newPalette["input"] = newPalette["border"];
        newPalette["ring"] = chroma(newPalette["primary"]).alpha(0.3).css();

        return newPalette;
      };

      const newPalettes = {
        light: generatePaletteForMode(false),
        dark: generatePaletteForMode(true),
      };

      setPalettes(newPalettes);
      updateURL(newPalettes);
    } catch (error) {
      console.error("Error generating palette:", error);
    }
  };

  const updateURL = (newPalettes: typeof palettes) => {
    const encodedPalette = btoa(JSON.stringify(newPalettes));
    const newURL = `?palette=${encodedPalette}&dark=${isDarkMode}`;
    window.history.pushState({}, "", newURL);
  };

  const formatColorValue = (color: string) => {
    if (color.startsWith("hsl")) {
      return color.replace("hsl(", "").replace(")", "").replace(/,/g, "");
    }
    return color.replace(/,/g, "");
  };

  const generateCssSnippet = () => {
    const snippet = `:root {
${Object.entries(palettes.light)
  .map(([key, value]) => `  --${key}: ${formatColorValue(value)};`)
  .join("\n")}
  --radius: 0.5rem;
}

.dark {
${Object.entries(palettes.dark)
  .map(([key, value]) => `  --${key}: ${formatColorValue(value)};`)
  .join("\n")}
}`;
    setCssSnippet(snippet);
  };

  const copyShareLink = () => {
    const shareLink = window.location.href;
    navigator.clipboard.writeText(shareLink);
    alert("Share link copied to clipboard!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssSnippet);
    alert("CSS variables copied to clipboard!");
  };

  return (
    <>
      <Mockup palette={isDarkMode ? palettes.dark : palettes.light} />

      <Card
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg shadow-lg"
        style={{
          backgroundColor: isDarkMode
            ? palettes.dark.card
            : palettes.light.card,
          color: isDarkMode
            ? palettes.dark["card-foreground"]
            : palettes.light["card-foreground"],
          borderColor: isDarkMode
            ? palettes.dark.border
            : palettes.light.border,
          borderTopWidth: "1px",
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
            <ModeToggle
              onModeChange={(checked) => {
                setIsDarkMode(checked);
                if (Object.keys(palettes.light).length > 0) {
                  updateURL(palettes);
                } else {
                  generateAccessiblePalette();
                }
              }}
            />
            <Button onClick={generateAccessiblePalette} variant="default">
              Generate Palette
            </Button>
            <Button onClick={copyShareLink} variant={"secondary"}>
              Copy Share Link
            </Button>
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
                <pre className="p-4 bg-background rounded overflow-auto max-h-[400px]">
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
