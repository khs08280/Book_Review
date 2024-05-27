export const maskUsername = (username: string) => {
  if (!username) return "";
  const visiblePart = username.substring(0, 3);
  const maskedPart = "*".repeat(username.length - 3);
  return visiblePart + maskedPart;
};
