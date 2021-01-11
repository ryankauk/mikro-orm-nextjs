import {
  PrimaryKey,
  Entity,
  Property,
  Unique,
  Embeddable,
  Embedded,
} from "@mikro-orm/core";

@Embeddable()
export class MetaData {
  @Property()
  field!: string;
}

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  @Unique()
  email: string;

  @Property({ nullable: true })
  age?: number;

  @Property({ nullable: true })
  born?: Date;

  @Embedded({ entity: () => MetaData, nullable: true })
  meta?: MetaData = new MetaData();

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
    if (!this.meta) this.meta = new MetaData();
  }
}
