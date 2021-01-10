import { verify as verifyToken } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { LecContext } from "./LecContext";

export const lecAuth: MiddlewareFn<LecContext> = ({ context }, next) => {
  const lecAuthorization = context.req.headers["authorization"];
  if (!lecAuthorization) {
    throw new Error("Not Logged In");
  }

  try {
    const token = lecAuthorization.split(" ")[1];
    const payload = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    throw new Error(err);
  }
  return next();
};
