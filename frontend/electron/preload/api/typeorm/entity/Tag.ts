import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  Unique,
} from "typeorm";

import moment from "moment";
import { Note } from "./Note";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  @Unique("tag_name_unique", ["name"])
  name!: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes!: Note[];

  @CreateDateColumn({
    transformer: {
      from: (date: Date) => moment(date).valueOf(),
      to: () => new Date(),
    },
    type: "datetime",
  })
  createdAt!: number;
}
