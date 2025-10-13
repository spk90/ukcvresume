import { useEffect } from "react";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  adStyle?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

// AdSense component - only use when you have proper content and AdSense approval
export const AdSense = ({
  adSlot,
  adFormat = "auto",
  adStyle = { display: "block" },
  className = "",
  responsive = true,
}: AdSenseProps) => {
  useEffect(() => {
    // Only load AdSense if it's properly configured
    if (typeof window !== "undefined" && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, []);

  // Don't render ads if AdSense is not properly set up
  if (typeof window === "undefined" || !(window as any).adsbygoogle) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-1446474252906589"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

// Ad placement guidelines component
export const AdPlacementGuidelines = () => {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-semibold text-yellow-800 mb-2">
        AdSense Implementation Guidelines
      </h3>
      <ul className="text-sm text-yellow-700 space-y-1">
        <li>• Only place ads on pages with substantial, original content</li>
        <li>• Ensure ads don't dominate the page (max 3 ads per page)</li>
        <li>• Place ads naturally within content flow</li>
        <li>• Avoid placing ads on navigation, error, or loading pages</li>
        <li>• Ensure mobile responsiveness</li>
        <li>• Test ad placement on different screen sizes</li>
      </ul>
    </div>
  );
};

// Real ad placements for different page types
export const BlogAdPlacement = () => {
  return (
    <div className="my-8">
      <AdSense
        adSlot="1234567890" // Blog content ads
        adFormat="rectangle"
        className="text-center"
        adStyle={{ display: "block", margin: "20px auto", minHeight: "250px" }}
      />
    </div>
  );
};

export const SidebarAdPlacement = () => {
  return (
    <div className="sticky top-24">
      <AdSense
        adSlot="0987654321" // Sidebar ads
        adFormat="vertical"
        className="w-full"
        adStyle={{ display: "block", width: "100%", minHeight: "600px" }}
      />
    </div>
  );
};

export const InlineAdPlacement = () => {
  return (
    <div className="my-6 text-center">
      <AdSense
        adSlot="1122334455" // Inline content ads
        adFormat="horizontal"
        className="w-full"
        adStyle={{ display: "block", width: "100%", minHeight: "90px" }}
      />
    </div>
  );
};

export const HeaderAdPlacement = () => {
  return (
    <div className="mb-6">
      <AdSense
        adSlot="5566778899" // Header banner ads
        adFormat="horizontal"
        className="w-full"
        adStyle={{ display: "block", width: "100%", minHeight: "90px" }}
      />
    </div>
  );
};

export const FooterAdPlacement = () => {
  return (
    <div className="mt-6">
      <AdSense
        adSlot="9988776655" // Footer ads
        adFormat="horizontal"
        className="w-full"
        adStyle={{ display: "block", width: "100%", minHeight: "90px" }}
      />
    </div>
  );
};
