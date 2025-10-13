import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

interface NewsletterSignupProps {
  className?: string;
  variant?: "default" | "inline" | "sidebar";
}

export const NewsletterSignup = ({
  className = "",
  variant = "default",
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store subscription locally (in a real app, this would be sent to a server)
      const subscriptions = JSON.parse(
        localStorage.getItem("newsletterSubscriptions") || "[]"
      );
      if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem(
          "newsletterSubscriptions",
          JSON.stringify(subscriptions)
        );
      }

      setIsSubscribed(true);
      setEmail("");

      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive our latest CV tips and career advice.",
      });
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (isSubscribed) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Thank You!</h3>
          <p className="text-sm text-muted-foreground">
            You're now subscribed to our newsletter. Check your email for
            confirmation.
          </p>
        </div>
      </Card>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex gap-3 max-w-md mx-auto ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSubmit} disabled={isLoading} className="px-6">
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get the latest CV tips and career advice delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Button
            type="submit"
            size="sm"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="text-center">
        <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">
          Stay Updated with CV Tips
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Get the latest CV writing tips, industry insights, and career advice
          delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">
          No spam, unsubscribe at any time.
        </p>
      </div>
    </Card>
  );
};

