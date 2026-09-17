/** Close dangling markdown tokens so streaming previews do not look broken. */

function oddUnescaped(text: string, token: string): boolean {
  let count = 0;
  let i = 0;
  while (i < text.length) {
    if (text[i] === "\\" && i + 1 < text.length) {
      i += 2;
      continue;
    }
    if (text.startsWith(token, i)) {
      count += 1;
      i += token.length;
      continue;
    }
    i += 1;
  }
  return count % 2 === 1;
}

export function stabilizeStreamingMarkdown(raw: string): string {
  if (!raw) return raw;

  let text = raw.replace(/\r\n/g, "\n");

  let inFence = false;
  for (const line of text.split("\n")) {
    if (/^ {0,3}```/.test(line)) inFence = !inFence;
  }
  if (inFence) {
    text += "\n```";
    return text;
  }

  const lastFence = text.lastIndexOf("```");
  const suffixStart =
    lastFence === -1 ? 0 : text.indexOf("\n", lastFence) + 1 || text.length;
  const prefix = text.slice(0, suffixStart);
  let suffix = text.slice(suffixStart);

  if (oddUnescaped(suffix, "`")) suffix += "`";
  if (oddUnescaped(suffix, "**")) suffix += "**";
  else if (oddUnescaped(suffix, "*")) suffix += "*";
  if (oddUnescaped(suffix, "__")) suffix += "__";
  else if (oddUnescaped(suffix, "_")) suffix += "_";

  return prefix + suffix;
}
