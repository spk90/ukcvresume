import { CVProvider } from "@/contexts/CVContext";
// Editor and preview moved to Builder page
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/Sidebar";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <CVProvider>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="flex w-full">
          <Sidebar />

          <main className="flex-1 w-full">
            {/* Hero */}
            <section className="border-b border-border/40 bg-gradient-to-b from-background to-muted/30">
              <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="max-w-3xl text-center mx-auto">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    Build your resume in minutes
                  </h1>
                  <p className="mt-3 text-muted-foreground">
                    Create a professional UK-standard CV with live preview,
                    modern templates, and one-click export. No sign-up required.
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <Link to="/builder" className="inline-flex">
                      <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium shadow hover:opacity-90 transition">
                        Build Resume
                      </span>
                    </Link>
                    <a href="#features" className="inline-flex">
                      <span className="inline-flex items-center rounded-lg border border-border px-4 py-2 font-medium hover:bg-muted/60 transition">
                        See features
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 py-8">
              {/* Features */}
              <section id="features" className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-border/40 p-5 bg-card/50">
                    <h3 className="font-semibold text-foreground">
                      Live Preview
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      See changes instantly alongside your editor.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/40 p-5 bg-card/50">
                    <h3 className="font-semibold text-foreground">
                      ATS-Friendly
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Clean structure that parses well with ATS.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/40 p-5 bg-card/50">
                    <h3 className="font-semibold text-foreground">
                      Modern Templates
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Switch between classic and modern designs.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/40 p-5 bg-card/50">
                    <h3 className="font-semibold text-foreground">
                      One-click Export
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Download as high-quality PDF anytime.
                    </p>
                  </div>
                </div>
              </section>

              {/* Editor moved to /builder */}
            </div>

            {/* Footer */}
            <footer className="border-t border-border/40 mt-16 py-8">
              <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Your data is saved locally in your browser. No information is
                  sent to any server.
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2">@sujal</p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </CVProvider>
  );
};

export default Index;
