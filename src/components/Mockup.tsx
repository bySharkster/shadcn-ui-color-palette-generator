import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MockupProps {
  palette: Record<string, string>;
}

const Mockup: React.FC<MockupProps> = ({ palette }) => {
  return (
    <div
      className="flex flex-col items-center justify-start w-full min-h-screen p-8"
      style={{
        backgroundColor: palette.background,
        color: palette.foreground,
      }}
    >
      <header className="w-full max-w-4xl mb-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: palette.primary }}>
            Brand Logo
          </h1>
          <div className="space-x-4">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
          </div>
        </nav>
      </header>

      <main className="w-full max-w-4xl">
        <section className="mb-12 text-center">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: palette.primary }}
          >
            Welcome to Our Website
          </h2>
          <p
            className="text-xl mb-6"
            style={{ color: palette["muted-foreground"] }}
          >
            This is a mockup of how your theme would look.
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              style={{
                backgroundColor: palette.primary,
                color: palette["primary-foreground"],
              }}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              style={{
                borderColor: palette.primary,
                color: palette.primary,
              }}
            >
              Learn More
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card
            style={{
              backgroundColor: palette.card,
              color: palette["card-foreground"],
            }}
          >
            <CardHeader>
              <CardTitle>Feature One</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discover the amazing features of our product.</p>
            </CardContent>
          </Card>
          <Card
            style={{
              backgroundColor: palette.card,
              color: palette["card-foreground"],
            }}
          >
            <CardHeader>
              <CardTitle>Feature Two</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Experience the power of innovation.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h3
            className="text-2xl font-bold mb-4"
            style={{ color: palette.secondary }}
          >
            Latest Updates
          </h3>
          <div className="space-y-2">
            <Badge
              style={{
                backgroundColor: palette.accent,
                color: palette["accent-foreground"],
              }}
            >
              New
            </Badge>
            <p>Check out our latest product release!</p>
          </div>
        </section>

        <section>
          <h3
            className="text-2xl font-bold mb-4"
            style={{ color: palette.secondary }}
          >
            Stay Connected
          </h3>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter your email"
              style={{ borderColor: palette.border }}
            />
            <Button
              style={{
                backgroundColor: palette.primary,
                color: palette["primary-foreground"],
              }}
            >
              Subscribe
            </Button>
          </div>
        </section>
      </main>

      <footer
        className="w-full max-w-4xl mt-12 pt-8 border-t"
        style={{ borderColor: palette.border }}
      >
        <p
          className="text-center"
          style={{ color: palette["muted-foreground"] }}
        >
          © 2023 Your Company. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Mockup;
