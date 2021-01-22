import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";

import { start, expectations, boot } from "./expectations";

let orm: MikroORM<MongoDriver>;
type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;
let runner: UnwrapPromise<ReturnType<typeof boot>>;

describe("mikro entity with null embeddable prop where data was created from external source", () => {
  beforeAll(async () => {
    orm = await start();
    // we'll mock an external source update using internal driver to bypass mikro orm
    const _objectTrue = await orm.em
      .getDriver()
      .nativeInsert("HasEmbeddedObjectTrue", {});
    const _objectFalse = await orm.em
      .getDriver()
      .nativeInsert("HasEmbeddedObjectFalse", {});

    runner = await boot(orm, {
      objectFalseId: _objectFalse.row._id,
      objectTrueId: _objectTrue.row._id,
    });
  });
  test("@Embedded({...inputs, object: false}) field to be initialized after being fetched", async () => {
    expectations(runner.objectFalse);
  });

  test("@Embedded({...inputs, object: true}) field to be initialized after being fetched", async () => {
    expectations(runner.objectTrue);
  });

  afterAll(() => runner.cleanup());
});
