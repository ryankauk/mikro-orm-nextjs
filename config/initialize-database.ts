import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import config from "./mikro-orm";

const startOrm = async () => MikroORM.init<MongoDriver>(config);

export default startOrm;
