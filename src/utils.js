export function validE164(num) {
  // checks the validity of a phone number
  return /^\+?[1-9]\d{1,14}$/.test(num);
}
