export const validateUrl = (input: string): boolean => {
  try {
    if (!input) return false;
    if (!input.startsWith("https://")) return false;
    new URL(input);
    return true;
  } catch (e) {
    return false;
  }
};
