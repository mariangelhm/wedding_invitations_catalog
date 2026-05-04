export const getLuminance = (hex = '#000000') => {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(normalized.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getReadableTextColor = (backgroundHex = '#FFFFFF') => (getLuminance(backgroundHex) > 0.5 ? '#2F2E2E' : '#FFFFFF');
