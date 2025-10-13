import { CVProvider } from "@/contexts/CVContext";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  FileText,
  Download,
  Settings,
  Users,
  MessageCircle,
} from "lucide-react";

const faqCategories = [
  {
    title: "Getting Started",
    icon: <FileText className="h-5 w-5" />,
    questions: [
      {
        question: "How do I create my first CV?",
        answer:
          "To create your first CV, click the 'Build Resume' button on our homepage. You'll be taken to our CV builder where you can fill in your personal details, work experience, education, and skills. The preview updates in real-time as you type.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "No account required! Our CV builder works entirely in your browser. Your data is saved locally and automatically, so you can return anytime to continue editing.",
      },
      {
        question: "What information do I need to include?",
        answer:
          "Essential information includes: your full name, contact details, professional summary, work experience, education, and relevant skills. Optional fields include LinkedIn profile, website, and additional certifications.",
      },
      {
        question: "How long should my CV be?",
        answer:
          "For most professionals, a 1-2 page CV is ideal. Recent graduates can use 1 page, while experienced professionals may need 2 pages. Focus on quality over quantity - every word should add value.",
      },
    ],
  },
  {
    title: "Templates & Design",
    icon: <Settings className="h-5 w-5" />,
    questions: [
      {
        question: "Which template should I choose?",
        answer:
          "Choose based on your industry: Modern template works for most roles, Classic template is better for traditional industries like finance or law, and Creative template suits design and marketing roles.",
      },
      {
        question: "Can I customize the template colors?",
        answer:
          "Yes! You can change the primary color, accent colors, and text colors in the template settings. This helps match your personal brand or industry preferences.",
      },
      {
        question: "Are the templates ATS-friendly?",
        answer:
          "All our templates are designed to be ATS-compatible with clean formatting, standard fonts, and proper structure. Avoid adding images or complex layouts that might confuse ATS systems.",
      },
      {
        question: "Can I switch templates after creating my CV?",
        answer:
          "Absolutely! You can switch between templates at any time. Your content will automatically adapt to the new template while preserving all your information.",
      },
    ],
  },
  {
    title: "Export & Download",
    icon: <Download className="h-5 w-5" />,
    questions: [
      {
        question: "What file formats can I download?",
        answer:
          "You can download your CV as a high-quality PDF, Word document, or JSON data file. PDF is recommended for most job applications as it maintains formatting across devices.",
      },
      {
        question: "How do I print my CV?",
        answer:
          "Use the 'Print CV' option in the export section, or download as PDF and print from your computer. We recommend using A4 paper for best results.",
      },
      {
        question: "Can I share my CV with others?",
        answer:
          "Yes! You can generate a shareable link or export your CV data to share with mentors, career counselors, or colleagues for feedback.",
      },
      {
        question: "What's the best resolution for my CV?",
        answer:
          "Our PDF export uses high resolution (300 DPI) which is perfect for both digital viewing and printing. The file size is optimized for email attachments and online applications.",
      },
    ],
  },
  {
    title: "Features & Tools",
    icon: <Users className="h-5 w-5" />,
    questions: [
      {
        question: "What is the Analytics feature?",
        answer:
          "Analytics provides insights into your CV's completeness, ATS compatibility, and optimization suggestions. It helps identify areas for improvement and tracks your progress.",
      },
      {
        question: "How does version management work?",
        answer:
          "Version management lets you save multiple versions of your CV with custom labels. This is perfect for creating different CVs for different job types or tracking your CV's evolution.",
      },
      {
        question: "What are Text Lints?",
        answer:
          "Text Lints analyze your CV content for common issues like passive voice, first-person pronouns, vague phrases, and formatting problems. They provide suggestions to improve your writing.",
      },
      {
        question: "Can I use AI to improve my CV?",
        answer:
          "Yes! Our AI features can suggest professional summaries, optimize bullet points, and provide content recommendations. Enable AI features in settings to access these tools.",
      },
    ],
  },
  {
    title: "Troubleshooting",
    icon: <HelpCircle className="h-5 w-5" />,
    questions: [
      {
        question: "My CV isn't saving properly",
        answer:
          "Check that you have JavaScript enabled and sufficient browser storage. Try refreshing the page or clearing your browser cache. Your data should auto-save every few seconds.",
      },
      {
        question: "The preview looks different from the download",
        answer:
          "This can happen due to browser differences. The downloaded PDF will match the preview exactly. If issues persist, try using a different browser or clearing your cache.",
      },
      {
        question: "I can't access my saved CV",
        answer:
          "CVs are saved locally in your browser. If you've cleared browser data or are using a different device, you'll need to recreate your CV. Consider using the export feature to backup your data.",
      },
      {
        question: "The website is loading slowly",
        answer:
          "Try refreshing the page or clearing your browser cache. Ensure you have a stable internet connection. If problems persist, try using a different browser.",
      },
    ],
  },
];

const Help = () => {
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
                  Help & Support
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Find answers to common questions and learn how to make the
                  most of our CV builder.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    FAQ
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Support
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <FileText className="h-4 w-4 mr-1" />
                    Guides
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Start Guide */}
          <section className="py-12">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Quick Start Guide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      1. Fill Your Details
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Start with personal information, then add your work
                      experience and education.
                    </p>
                  </Card>
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      2. Choose Template
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Select from our professional templates and customize
                      colors to match your style.
                    </p>
                  </Card>
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      3. Download & Apply
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Export as PDF and start applying to jobs with your
                      professional CV.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Frequently Asked Questions
                </h2>

                {faqCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      {category.icon}
                      <h3 className="text-xl font-semibold text-foreground">
                        {category.title}
                      </h3>
                    </div>

                    <Accordion type="single" collapsible className="space-y-2">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`${categoryIndex}-${faqIndex}`}
                          className="border border-border/40 rounded-lg px-4"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-medium">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="py-12">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Still Need Help?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? We're here to help you
                  create the perfect CV.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
                    Contact Support
                  </button>
                  <button className="px-6 py-3 border border-border rounded-lg hover:bg-muted/60 transition">
                    View Documentation
                  </button>
                </div>
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

export default Help;

