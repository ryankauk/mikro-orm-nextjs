import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";

import {
  HasEmbeddedObjectFalse,
  HasEmbeddedObjectTrue,
  start,
  expectations,
  boot,
} from "./expectations";

let orm: MikroORM<MongoDriver>;
type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;
let runner: UnwrapPromise<ReturnType<typeof boot>>;

describe("mikro entity with null embeddable prop input for orm.em.create where model has prop", () => {
  beforeAll(async () => {
    orm = await start();
    const _objectTrue = orm.em.create(HasEmbeddedObjectTrue, {});
    const _objectFalse = orm.em.create(HasEmbeddedObjectFalse, {});
    await orm.em.persistAndFlush([_objectTrue, _objectFalse]);

    runner = await boot(orm, {
      objectFalseId: _objectFalse._id,
      objectTrueId: _objectTrue._id,
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
