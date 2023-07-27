import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

import moment from "moment";

@Entity()
export class Note {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  title!: string;

  @Column("varchar")
  content!: string;

  @CreateDateColumn({
    transformer: {
      from: (date: Date) => moment(date).valueOf(),
      to: () => new Date(),
    },
    type: "datetime",
  })
  createdAt!: number;

  @UpdateDateColumn({
    transformer: {
      from: (date: Date) => moment(date).valueOf(),
      to: () => new Date(),
    },
    type: "datetime",
  })
  updatedAt!: number;

  @DeleteDateColumn({
    transformer: {
      from: (date: Date | null) =>
        date ? moment(date).valueOf() : null,
      to: (millis: number | null) =>
        millis ? moment(millis).toDate() : null,
    },
    type: "datetime",
  })
  deletedAt!: number | null;
}
