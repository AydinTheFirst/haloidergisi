import { Response, Request } from "express";

export const APIError = (res: Response, message: string) => {
  return res.status(400).send({ message });
};

export const ZodError = (res: Response, error: any) => {
  return res
    .status(400)
    .send({ message: "Invalid Payload", errors: error.issues });
};
