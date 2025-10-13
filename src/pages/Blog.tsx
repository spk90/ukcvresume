import { CVProvider } from "@/contexts/CVContext";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { InlineAdPlacement } from "@/components/AdSense";

const blogPosts = [
  {
    id: 1,
    title: "How to Write a Professional CV That Gets You Hired",
    excerpt:
      "Learn the essential elements of a winning CV that passes ATS systems and impresses hiring managers.",
    content:
      "Writing a professional CV is crucial for landing your dream job. In today's competitive job market, your CV is often the first impression you make on potential employers. This comprehensive guide will walk you through creating a CV that stands out from the crowd...",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "CV Writing",
    tags: ["CV Tips", "Job Search", "Career Advice"],
  },
  {
    id: 2,
    title: "ATS-Friendly CV Formatting: What You Need to Know",
    excerpt:
      "Discover how to format your CV to pass Applicant Tracking Systems and reach human recruiters.",
    content:
      "Applicant Tracking Systems (ATS) are used by over 75% of companies to screen CVs before they reach human eyes. Understanding how to format your CV for ATS compatibility is essential for modern job seekers...",
    author: "Michael Chen",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "ATS Optimization",
    tags: ["ATS", "Formatting", "Technology"],
  },
  {
    id: 3,
    title: "Top 10 CV Mistakes That Cost You Interviews",
    excerpt:
      "Avoid these common CV mistakes that could be preventing you from getting called for interviews.",
    content:
      "Even experienced professionals make CV mistakes that can cost them opportunities. Here are the most common errors we see and how to fix them...",
    author: "Emma Williams",
    date: "2024-01-10",
    readTime: "5 min read",
    category: "Common Mistakes",
    tags: ["Mistakes", "Interview", "Tips"],
  },
  {
    id: 4,
    title: "CV Templates for Different Industries: A Complete Guide",
    excerpt:
      "Choose the right CV template for your industry to maximize your chances of success.",
    content:
      "Different industries have different expectations when it comes to CV formatting and content. Learn which template works best for your field...",
    author: "David Thompson",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Templates",
    tags: ["Templates", "Industries", "Design"],
  },
  {
    id: 5,
    title: "How to Quantify Your Achievements on Your CV",
    excerpt:
      "Learn to use numbers and metrics to make your CV more compelling and credible.",
    content:
      "Quantifying your achievements is one of the most effective ways to make your CV stand out. Here's how to add meaningful numbers to your experience...",
    author: "Lisa Rodriguez",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Achievements",
    tags: ["Metrics", "Achievements", "Numbers"],
  },
  {
    id: 6,
    title: "The Ultimate Guide to CV Keywords for 2024",
    excerpt:
      "Discover the most important keywords to include in your CV for different industries and roles.",
    content:
      "Keywords are crucial for both ATS systems and human recruiters. This guide covers the most important keywords for various industries...",
    author: "James Wilson",
    date: "2024-01-03",
    readTime: "9 min read",
    category: "Keywords",
    tags: ["Keywords", "SEO", "Optimization"],
  },
];

const categories = [
  "All",
  "CV Writing",
  "ATS Optimization",
  "Common Mistakes",
  "Templates",
  "Achievements",
  "Keywords",
];

const Blog = () => {
  return (
    <CVProvider>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="w-full">
          {/* Hero Section */}
          <section className="border-b border-border/40 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4 lg:px-8 py-12">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                  CV Writing Blog
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Expert advice, tips, and insights to help you create the
                  perfect CV and advance your career.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Blog Posts */}
          <section className="py-12">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-8">
                  {blogPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">{post.category}</Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h2>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {post.author}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
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

export default Blog;
