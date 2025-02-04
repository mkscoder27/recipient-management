// Extract domain from email
export const getDomain = (email: string): string => {
  return email.split('@')[1]
}

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}