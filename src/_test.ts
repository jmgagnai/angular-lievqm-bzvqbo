import { Marked, Renderer, Tokens } from "marked";

class TextRenderer extends Renderer {
  override heading(token: Tokens.Heading): string {
    const text = this.parser.parseInline(token.tokens);
    if (token.depth === 1) return `${text}\n${"=".repeat(text.length)}\n\n`;
    if (token.depth === 2) return `${text}\n${"-".repeat(text.length)}\n\n`;
    return `${text}\n\n`;
  }

  override paragraph(token: Tokens.Paragraph): string {
    return `${this.parser.parseInline(token.tokens)}\n\n`;
  }

  override blockquote(token: Tokens.Blockquote): string {
    const body = this.parser.parse(token.tokens);
    return body
      .split("\n")
      .map(line => (line.trim() ? `> ${line}` : ""))
      .join("\n") + "\n\n";
  }

  override code(token: Tokens.Code): string {
    const lang = token.lang ? `[${token.lang}] ` : "";
    return `${lang}${token.text}\n\n`;
  }

  override codespan(token: Tokens.Codespan): string {
    return token.text;
  }

  override br(): string {
    return "\n";
  }

  override list(token: Tokens.List): string {
    return token.items.map(i => this.listitem(i)).join("") + "\n";
  }

  override listitem(token: Tokens.ListItem): string {
    if (token.task) {
      const mark = token.checked ? "[x]" : "[ ]";
      return `${mark} ${this.parser.parseInline(token.tokens)}\n`;
    }
    return `- ${this.parser.parseInline(token.tokens)}\n`;
  }

  override table(token: Tokens.Table): string {
    const header = this.tablerow(token.header);
    const body = token.rows.map(r => this.tablerow(r)).join("");
    return `${header}${body}\n`;
  }

  override tablerow(token: Tokens.TableRow): string {
    return token.cells.map(c => this.tablecell(c)).join("") + "\n";
  }

  override tablecell(token: Tokens.TableCell): string {
    return `${this.parser.parseInline(token.tokens)}\t`;
  }

  override strong(token: Tokens.Strong): string {
    return this.parser.parseInline(token.tokens);
  }

  override em(token: Tokens.Em): string {
    return this.parser.parseInline(token.tokens);
  }

  override del(token: Tokens.Del): string {
    return this.parser.parseInline(token.tokens);
  }

  override link(token: Tokens.Link): string {
    const text = this.parser.parseInline(token.tokens);
    if (token.href && text !== token.href) {
      return `${text} (${token.href})`;
    }
    return text;
  }

  override image(token: Tokens.Image): string {
    return token.text ? `${token.text}${token.href ? ` (${token.href})` : ""}` : token.href;
  }

  override text(token: Tokens.Text): string {
    return token.text;
  }

  override html(): string {
    return "";
  }
}

const mdText = new Marked({
  renderer: new TextRenderer()
});

export function markdownToText(markdown: string): string {
  const raw = mdText.parse(markdown) as string;
  return raw.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
