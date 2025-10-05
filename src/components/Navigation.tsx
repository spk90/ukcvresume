import { FileText, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export const Navigation = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">ukcvresume</h1>
            <p className="text-xs text-muted-foreground">ukcvresume.co.uk</p>
          </div>
        </a>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a
            href="/#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="/builder#templates"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Templates
          </a>
          <a
            href="/builder"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Editor
          </a>
          <a
            href="/builder#export"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Export
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="secondary"
            className="hidden sm:inline-flex rounded-lg"
          >
            <a href="/#features">Explore</a>
          </Button>
          <Button asChild className="rounded-lg">
            <a href="/builder">Build Resume</a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
