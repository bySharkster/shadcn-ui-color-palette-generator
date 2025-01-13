"use client";

import { useState } from "react";
import chroma from "chroma-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "./ui/card";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Mockup from "./Mockup";

const emotions = [
  { name: "Trust and Stability", color: "#0000FF" },
  { name: "Energy and Excitement", color: "#FF0000" },
  { name: "Optimism and Cheerfulness", color: "#FFFF00" },
  { name: "Growth and Harmony", color: "#00FF00" },
  { name: "Luxury and Creativity", color: "#800080" },
  { name: "Friendliness and Confidence", color: "#FFA500" },
  { name: "Sophistication and Elegance", color: "#000000" },
  { name: "Purity and Simplicity", color: "#FFFFFF" },
];

const colorKeys = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
];

const PaletteGenerator = () => {
  const [baseEmotion, setBaseEmotion] = useState("");
  const [palette, setPalette] = useState<Record<string, string>>({});
  const [cssSnippet, setCssSnippet] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const generateAccessiblePalette = () => {
    try {
      const baseColor =
        emotions.find((e) => e.name === baseEmotion)?.color || "#000000";
      const newPalette: Record<string, string> = {};

      // Convert to HSL and handle achromatic colors
      const chromaColor = chroma(baseColor);
      const baseHue = chromaColor.get("hsl.h") || 0; // Default to 0 if undefined
      const baseSaturation = chromaColor.get("hsl.s") || 0;

      const generateColor = (
        hue: number,
        saturation: number,
        lightness: number
      ): string => {
        const h = Math.round(hue % 360);
        const s = Math.round(Math.max(0, Math.min(1, saturation)) * 100);
        const l = Math.round(
          Math.max(0, Math.min(1, isDarkMode ? 1 - lightness : lightness)) * 100
        );
        return `hsl(${h}, ${s}%, ${l}%)`;
      };

      // Generate base colors first
      newPalette["primary"] = generateColor(baseHue, baseSaturation, 0.5);
      newPalette["secondary"] = generateColor(
        (baseHue + 30) % 360,
        baseSaturation * 0.5,
        0.8
      );
      newPalette["accent"] = generateColor(
        (baseHue + 60) % 360,
        baseSaturation * 0.7,
        0.7
      );
      newPalette["destructive"] = generateColor(0, 0.85, 0.5);

      // Simplified contrast color generation
      const getContrastColor = (bgColor: string) => {
        const backgroundColor = chroma(bgColor);
        const luminance = backgroundColor.luminance();
        return luminance > 0.5 ? "hsl(0, 0%, 0%)" : "hsl(0, 0%, 100%)";
      };

      // Generate foregrounds
      Object.keys(newPalette).forEach((key) => {
        if (["primary", "secondary", "accent", "destructive"].includes(key)) {
          newPalette[`${key}-foreground`] = getContrastColor(newPalette[key]);
        }
      });

      // Generate remaining colors
      const remainingColors = {
        background: [baseHue, baseSaturation * 0.1, isDarkMode ? 0.1 : 0.98],
        foreground: [baseHue, baseSaturation * 0.2, isDarkMode ? 0.9 : 0.2],
        card: [baseHue, baseSaturation * 0.05, isDarkMode ? 0.15 : 0.99],
        "card-foreground": [
          baseHue,
          baseSaturation * 0.2,
          isDarkMode ? 0.9 : 0.2,
        ],
        popover: [baseHue, baseSaturation * 0.1, isDarkMode ? 0.1 : 0.98],
        "popover-foreground": [
          baseHue,
          baseSaturation * 0.2,
          isDarkMode ? 0.9 : 0.2,
        ],
        muted: [baseHue, baseSaturation * 0.2, isDarkMode ? 0.2 : 0.96],
        "muted-foreground": [
          baseHue,
          baseSaturation * 0.3,
          isDarkMode ? 0.8 : 0.4,
        ],
        border: [baseHue, baseSaturation * 0.15, isDarkMode ? 0.3 : 0.85],
        input: [baseHue, baseSaturation * 0.15, isDarkMode ? 0.3 : 0.85],
      };

      Object.entries(remainingColors).forEach(([key, [h, s, l]]) => {
        newPalette[key] = generateColor(h, s, l);
      });

      // Handle ring color separately
      newPalette["ring"] = chroma(newPalette["primary"]).alpha(0.3).css();

      setPalette(newPalette);
    } catch (error) {
      console.error("Error generating palette:", error);
      // You might want to show an error toast here
    }
  };

  const generateCssSnippet = () => {
    const lightSnippet = `:root {
${Object.entries(palette)
  .map(([key, value]) => `  --${key}: ${value};`)
  .join("\n")}
  --radius: 0.5rem;
}`;

    const darkSnippet = `.dark {
${Object.entries(palette)
  .map(([key, value]) => `  --${key}: ${value};`)
  .join("\n")}
}`;

    setCssSnippet(`${lightSnippet}\n\n${darkSnippet}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssSnippet);
    alert("CSS variables copied to clipboard!");
  };

  return (
    <>
      <Mockup palette={palette} />

      <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Select onValueChange={setBaseEmotion}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select desired emotion" />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((emotion) => (
                  <SelectItem key={emotion.name} value={emotion.name}>
                    {emotion.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                aria-label="Dark Mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
            <Button onClick={generateAccessiblePalette} disabled={!baseEmotion}>
              Generate Palette
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
