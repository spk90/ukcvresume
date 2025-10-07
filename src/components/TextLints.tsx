import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { lintText, TextLintIssue } from "@/lib/textlint";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TextLintsProps {
  text: string;
  onApplyFix?: (updated: string) => void;
}

export const TextLints = ({ text, onApplyFix }: TextLintsProps) => {
  const issues: TextLintIssue[] = lintText(text);

  if (issues.length === 0) {
    return (
      <div className="text-xs text-muted-foreground">No issues found.</div>
    );
  }

  const severityToVariant: Record<string, string> = {
    info: "secondary",
    warning: "outline",
    error: "destructive",
  };

  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <Alert key={issue.id} className="py-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge
                className={`mr-2`}
                variant={severityToVariant[issue.severity] as any}
              >
                {issue.severity}
              </Badge>
              <AlertDescription className="inline">
                {issue.message}
              </AlertDescription>
            </div>
            {issue.fix && onApplyFix && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onApplyFix(issue.fix!.apply(text))}
              >
                {issue.fix.label}
              </Button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  );
};



