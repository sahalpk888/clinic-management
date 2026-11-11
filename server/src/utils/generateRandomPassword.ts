import crypto from "crypto";

export const generatePassword = (): string => {
  return crypto.randomInt(10000, 100000).toString();
};