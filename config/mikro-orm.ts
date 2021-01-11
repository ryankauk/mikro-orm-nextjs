import { User, MetaData } from "../entities/User";
import { Options } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
const config: Options<MongoDriver> = {
  dbName: "async-up",
  type: "mongo",
  // host: process.env.MYSQL_HOST,
  // port: Number(process.env.MYSQL_PORT),
  // user: process.env.MYSQL_USERNAME,
  // password: process.env.MYSQL_PASSWORD,
  entities: [User, MetaData],
  debug: process.env.NODE_ENV === "development",
};

export default config;
