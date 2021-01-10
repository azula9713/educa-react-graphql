import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { StudentResolver } from "./Resolvers/StudentResolver";
import { createConnection } from "typeorm";
import { TeacherResolver } from "./Resolvers/TeacherResolver";
import { SubjectResolver } from "./Resolvers/SubjectResolver";
import { GradeResolver } from "./Resolvers/GradeResolver";

(async () => {
  const app = express();
  app.get("/", (_req, res) =>
    res.send("Educa Learning Management System Server")
  );

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        StudentResolver,
        TeacherResolver,
        SubjectResolver,
        GradeResolver,
      ],
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app });
  app.listen(process.env.PORT, () => {
    console.log("Express Server Started ⚡");
  });
})();
