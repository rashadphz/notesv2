import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";

import moment from "moment";
import { Tag } from "./Tag";

@Entity()
export class Note {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  title!: string;

  @Column("varchar")
  content!: string;

  @Column({
    transformer: {
      from: (date: Date) => moment(date).valueOf(),
      to: () => new Date(),
    },
    type: "datetime",
    nullable: true,
  })
  lastIndexedAt!: number;

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

  @ManyToMany(() => Tag, (tag) => tag.notes, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: "note_tag",
    joinColumn: {
      name: "noteId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tagId",
      referencedColumnName: "id",
    },
  })
  tags!: Tag[];
}
