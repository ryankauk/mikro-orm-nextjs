import "reflect-metadata";

function MetaProperty<DBDefault>({
  onDatabaseNull,
}: { onDatabaseNull?: () => DBDefault } = {}) {
  return <T extends Record<K, DBDefault>, K extends keyof T>(
    target: T,
    key: K
  ) => {
    const propertyName = `__${String(key)}`;
    const descriptor = {
      get(this: any) {
        if (!this[propertyName] && onDatabaseNull) {
          this[propertyName] = onDatabaseNull();
        }

        return this[propertyName];
      },
      set(value: any) {
        this[propertyName] = value;
      },
      enumerable: true,
      configurable: true,
    };

    Object.defineProperty(target, key, descriptor);
  };
}

import { MikroORM } from "@mikro-orm/core";
import { MongoDriver, ObjectId } from "@mikro-orm/mongodb";
import {
  PrimaryKey,
  Entity,
  Property,
  Embeddable,
  Embedded,
} from "@mikro-orm/core";

@Embeddable()
export class MetaData {
  @Property()
  field!: string;
}

@Entity()
export class HasEmbeddedObjectTrue {
  @PrimaryKey()
  _id!: ObjectId;

  @Embedded({ entity: () => MetaData, nullable: true, object: true })
  meta?: MetaData = new MetaData();

  @MetaProperty({ onDatabaseNull: () => new MetaData() })
  test: MetaData = new MetaData();

  @Property({ default: "test" })
  tester: string = "test";

  constructor() {}
}

@Entity()
export class HasEmbeddedObjectFalse {
  @PrimaryKey()
  _id!: ObjectId;

  @Embedded({ entity: () => MetaData, nullable: true, object: false })
  meta?: MetaData = new MetaData();

  @MetaProperty({ onDatabaseNull: () => new MetaData() })
  test: MetaData = new MetaData();

  @Property({})
  tester: string = "test";

  constructor() {}
}

export const start = async () => {
  const orm = await MikroORM.init<MongoDriver>({
    dbName: "async-up",
    type: "mongo",
    entities: [HasEmbeddedObjectTrue, HasEmbeddedObjectFalse, MetaData],
    debug: process.env.NODE_ENV === "development",
  });
  // await orm.em.nativeDelete(HasEmbeddedObjectTrue, {});
  // await orm.em.nativeDelete(HasEmbeddedObjectFalse, {});

  return orm;
};
export const expectations = (
  model: HasEmbeddedObjectFalse | HasEmbeddedObjectTrue
) => {
  expect(model.meta).toBeTruthy();
  expect(model.meta instanceof MetaData).toBeTruthy();
};

export const boot = async (
  orm: MikroORM<MongoDriver>,
  {
    objectTrueId,
    objectFalseId,
  }: { objectTrueId: ObjectId; objectFalseId: ObjectId }
) => {
  orm.em.clear();
  const [objectTrue, objectFalse] = await Promise.all([
    orm.em.findOne(HasEmbeddedObjectTrue, {
      _id: objectTrueId,
    }),
    orm.em.findOne(HasEmbeddedObjectFalse, {
      _id: objectFalseId,
    }),
  ]);

  return {
    objectTrue,
    objectFalse,
    async cleanup() {
      await Promise.all([
        orm.em.nativeDelete(HasEmbeddedObjectFalse, objectFalseId),
        orm.em.nativeDelete(HasEmbeddedObjectTrue, objectTrueId),
      ]);
      await orm.close();
    },
  };
};
