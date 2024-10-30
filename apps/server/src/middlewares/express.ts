import { Handler } from "express";

export const logger: Handler = (req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} => ${req.path}`);
  next();
};
