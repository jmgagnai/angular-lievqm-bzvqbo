import { marked } from 'marked';

class TextRenderer extends marked.Renderer {
  override heading(text: string, level: number): string {
    if (level === 1) return `${text}\n${'='.repeat(text.length)}\n\n`;
    if (level === 2) return `${text}\n${'-'.repeat(text.length)}\n\n`;
    return `${text}\n\n`;
  }

  override paragraph(text: string): string {
    return `${text}\n\n`;
  }

  override blockquote(quote: string): string {
    return quote
      .split('\n')
      .map(line => (line.trim() ? `> ${line}` : ''))
      .join('\n') + '\n\n';
  }

  override code(code: string, infoString?: string): string {
    const lang = infoString?.trim() || '';
    const prefix = lang ? `[${lang}] ` : '';
    return `${prefix}${code}\n\n`;
  }

  override codespan(code: string): string {
    return code;
  }

  override br(): string {
    return '\n';
  }

  override list(body: string): string {
    return `${body}\n`;
  }

  override listitem(text: string, task: boolean, checked: boolean): string {
    if (task) {
      const mark = checked ? '[x]' : '[ ]';
      return `${mark} ${text}\n`;
    }
    return `- ${text}\n`;
  }

  override table(header: string, body: string): string {
    return `${header}${body}\n`;
  }

  override tablerow(content: string): string {
    return `${content}\n`;
  }

  override tablecell(content: string): string {
    return `${content}\t`;
  }

  override strong(text: string): string { return text; }
  override em(text: string): string { return text; }
  override del(text: string): string { return text; }

  override link(href: string | null, _title: string | null, text: string): string {
    if (href && text !== href) return `${text} (${href})`;
    return text || href || '';
  }

  override image(href: string | null, _title: string | null, text: string): string {
    return text ? `${text}${href ? ` (${href})` : ''}` : (href ?? '');
  }

  override text(text: string): string {
    return text;
  }

  override html(): string {
    return '';
  }
}

// Create isolated instance — no global pollution
const textMarked = new marked.Marked({
  mangle: false,
  headerIds: false,
  renderer: new TextRenderer()
});

export function markdownToText(markdown: string): string {
  const raw = textMarked.parse(markdown) as string;
  return raw.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
