// import 'reflect-metadata';
import startOrm from "../../config/initialize-database";
import { MetaData, User } from "../../entities/User";

export default async (req, res) => {
  const orm = await startOrm();
  const result = await orm.em
    .getDriver()
    .nativeInsert<User>("user", { name: "test", email: "my email" });

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ user: result.row }));
};
