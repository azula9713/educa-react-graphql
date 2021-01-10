import { Request, Response } from "express";

export interface LecContext {
  req: Request;
  res: Response;
  payload?: { lecID: string };
}
