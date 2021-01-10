import { verify as verifyToken } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./StuContext";

export const stuAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("Not Logged In");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    throw new Error(err);
  }
  return next();
};
