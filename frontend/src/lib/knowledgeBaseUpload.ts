export const KNOWLEDGE_BASE_ACCEPT =
  '.csv,.txt,.pdf,.json,.md,.markdown,.docx,.xlsx,.xls,text/csv,text/plain,application/pdf,application/json';

export const KNOWLEDGE_BASE_MAX_MB = 15;

export function isKnowledgeBaseFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    /\.(csv|txt|pdf|json|md|markdown|docx|xlsx|xls)$/i.test(name) ||
    file.type.startsWith('text/') ||
    file.type === 'application/pdf' ||
    file.type === 'application/json' ||
    file.type.includes('spreadsheet') ||
    file.type.includes('wordprocessing')
  );
}

export function knowledgeBaseLabelFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    const segment = path.split('/').filter(Boolean).pop() || 'Knowledge file';
    return decodeURIComponent(segment);
  } catch {
    return 'Knowledge file';
  }
}
