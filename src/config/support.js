export function formatText(text) {
    return text
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }