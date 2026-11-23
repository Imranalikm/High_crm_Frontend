// Host part of a URL for compact display ("http://1.2.3.4:6969/x" → "1.2.3.4:6969")
export const hostOf = (url) => {
  try {
    return new URL(url).host;
  } catch {
    return url || '';
  }
};
