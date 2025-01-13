import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MockupProps {
  palette: Record<string, string>;
}

const Mockup: React.FC<MockupProps> = ({ palette }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen"
      style={{
        backgroundColor: palette.background,
        color: palette.foreground,
        padding: "20px",
      }}
    >
      <h1 style={{ color: palette.primary }}>Welcome to Our Website</h1>
      <p>This is a mockup of how your theme would look.</p>
      <Button
        style={{
          backgroundColor: palette.primary,
          color: palette["primary-foreground"],
        }}
      >
        Primary Button
      </Button>
      <Button
        style={{
          backgroundColor: palette.secondary,
          color: palette["secondary-foreground"],
        }}
      >
        Secondary Button
      </Button>
      <Card
        style={{
          backgroundColor: palette.card,
          color: palette["card-foreground"],
        }}
      >
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>This is some content inside a card.</CardContent>
      </Card>
    </div>
  );
};

export default Mockup;
