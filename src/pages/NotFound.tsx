import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might have entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium shadow hover:opacity-90 transition"
              >
                Go to Homepage
              </Link>
              <Link 
                to="/builder" 
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 font-medium hover:bg-muted/60 transition"
              >
                Start Building CV
              </Link>
            </div>
          </div>

          <div className="mt-12 text-left">
            <h3 className="text-xl font-semibold text-foreground mb-4">Popular Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <h4 className="font-medium text-foreground mb-2">CV Builder</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create professional UK-standard CVs with our easy-to-use builder
                </p>
                <Link to="/builder" className="text-primary hover:underline text-sm">
                  Start Building →
                </Link>
              </div>
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <h4 className="font-medium text-foreground mb-2">About Our Service</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn more about our free CV building service and features
                </p>
                <Link to="/" className="text-primary hover:underline text-sm">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please check the URL or try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
