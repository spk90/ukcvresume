export type LintSeverity = 'info' | 'warning' | 'error';

export interface TextLintIssue {
  id: string;
  message: string;
  severity: LintSeverity;
  start: number;
  end: number;
  fix?: {
    label: string;
    apply: (text: string) => string;
  };
}

const passiveRegex = /\b(is|was|were|be|been|being|are|am)\s+\w+ed\b/gi;
const firstPersonRegex = /\b(I|my|me|we|our)\b/gi;
const vagueWords = /(responsible for|worked on|helped with|involved in)/gi;
const longSentence = /.{180,}/g;
const repeatedSpaces = /\s{2,}/g;

export function lintText(input: string): TextLintIssue[] {
  const issues: TextLintIssue[] = [];
  if (!input) return issues;

  // Passive voice
  let match: RegExpExecArray | null;
  while ((match = passiveRegex.exec(input))) {
    issues.push({
      id: `passive-${match.index}`,
      message: 'Avoid passive voice; use strong action verbs.',
      severity: 'warning',
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  // First person in bullets/summary
  while ((match = firstPersonRegex.exec(input))) {
    issues.push({
      id: `firstperson-${match.index}`,
      message: 'Avoid first-person pronouns in resumes.',
      severity: 'info',
      start: match.index,
      end: match.index + match[0].length,
      fix: {
        label: 'Remove pronoun',
        apply: (text) => text.slice(0, match!.index) + text.slice(match!.index + match![0].length),
      },
    });
  }

  // Vague phrases
  while ((match = vagueWords.exec(input))) {
    issues.push({
      id: `vague-${match.index}`,
      message: 'Replace vague phrase with specific impact and metrics.',
      severity: 'warning',
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  // Long sentence
  while ((match = longSentence.exec(input))) {
    issues.push({
      id: `length-${match.index}`,
      message: 'Sentence is long; consider splitting.',
      severity: 'info',
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  // Repeated spaces
  while ((match = repeatedSpaces.exec(input))) {
    issues.push({
      id: `spaces-${match.index}`,
      message: 'Normalize repeated spaces.',
      severity: 'info',
      start: match.index,
      end: match.index + match[0].length,
      fix: {
        label: 'Fix spacing',
        apply: (text) => text.replace(repeatedSpaces, ' '),
      },
    });
  }

  return issues.sort((a, b) => a.start - b.start);
}







