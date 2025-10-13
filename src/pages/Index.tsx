import { CVProvider } from "@/contexts/CVContext";
// Editor and preview moved to Builder page
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { InlineAdPlacement } from "@/components/AdSense";

const Index = () => {
  return (
    <CVProvider>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="w-full">
          {/* Hero */}
          <section className="border-b border-border/40 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4 lg:px-8 py-12">
              <div className="max-w-3xl text-center mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Build your resume in minutes
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Create a professional UK-standard CV with live preview, modern
                  templates, and one-click export. No sign-up required.
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

            {/* Blog Preview */}
            <section className="py-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Latest CV Tips & Advice
                </h2>
                <p className="text-muted-foreground">
                  Expert insights to help you create the perfect CV
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    How to Write a Professional CV
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn the essential elements of a winning CV that passes ATS
                    systems and impresses hiring managers.
                  </p>
                  <Link
                    to="/blog"
                    className="text-primary hover:underline text-sm"
                  >
                    Read More →
                  </Link>
                </div>
                <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    ATS-Friendly CV Formatting
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover how to format your CV to pass Applicant Tracking
                    Systems and reach human recruiters.
                  </p>
                  <Link
                    to="/blog"
                    className="text-primary hover:underline text-sm"
                  >
                    Read More →
                  </Link>
                </div>
                <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    Top 10 CV Mistakes to Avoid
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Avoid these common CV mistakes that could be preventing you
                    from getting called for interviews.
                  </p>
                  <Link
                    to="/blog"
                    className="text-primary hover:underline text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center rounded-lg border border-border px-4 py-2 font-medium hover:bg-muted/60 transition"
                >
                  View All Articles
                </Link>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Trusted by Job Seekers
                </h2>
                <p className="text-muted-foreground">
                  See what our users say about their experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "This CV builder saved me so much time! The templates are
                    professional and the preview is instant."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        SM
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah M.</p>
                      <p className="text-xs text-muted-foreground">
                        Marketing Manager
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "The analytics feature helped me identify what was missing
                    from my CV. Got 3 interviews in a week!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        JD
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">James D.</p>
                      <p className="text-xs text-muted-foreground">
                        Software Developer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-border/40 bg-card/50">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Love the version management! I can try different approaches
                    and keep track of what works best."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        AL
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Anna L.</p>
                      <p className="text-xs text-muted-foreground">
                        Project Manager
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Ad Placement */}
            <InlineAdPlacement />

            {/* Newsletter Signup */}
            <section className="py-12 bg-muted/30">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-2xl mx-auto">
                  <NewsletterSignup />
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
    </CVProvider>
  );
};

export default Index;
