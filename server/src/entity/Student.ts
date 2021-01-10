import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Timestamp,
} from "typeorm";

@ObjectType()
@Entity("students")
export class Student extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  stu_id: number;

  @Field()
  @Column()
  stu_first_name: string;

  @Field()
  @Column()
  stu_last_name: string;

  @Field()
  @Column()
  stu_email: string;

  @Column()
  stu_password: string;

  @Field()
  @Column()
  stu_mobile: string;

  @Field(() => Int)
  @Column()
  grade_id: number;

  @Field(() => Int)
  @Column()
  sub_id: number;

  @Field()
  @Column()
  stu_is_approved: boolean;

  @Field()
  @Column()
  stu_is_allowed: boolean;

  @Field(() => Date)
  @Column({ type: "timestamp" })
  stu_reg_date: Timestamp;
}
