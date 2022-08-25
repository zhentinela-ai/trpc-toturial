import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

const app = express();

let products = [
  {
    id: 1,
    name: "product 1",
    description: "description 1",
  },
  {
    id: 2,
    name: "product 2",
    description: "description 2",
  },
];

const appRouter = trpc
  .router()
  .query("hello", {
    resolve() {
      return "Hello World 2";
    },
  })
  .query("getProducts", {
    resolve() {
      // database query
      // extern url

      return products;
    },
  })
  .mutation("createProduct", {
    input: z.string(),
    resolve({ input }) {
      products.push({
        id: products.length + 1,
        name: input,
        description: "",
      });
      return "product create";
    },
  });

export type AppRouter = typeof appRouter;

app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);

app.listen(4000);
console.log("Server listing on port", 4000);
