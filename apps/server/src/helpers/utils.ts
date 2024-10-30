import crypto from "node:crypto";

export const formatTime = (timeInMilliseconds: number) => {
  const seconds = Math.floor(timeInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minutes ${seconds % 60} seconds`;
};

export const generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const uuid = () => {
  return crypto.randomUUID();
};
