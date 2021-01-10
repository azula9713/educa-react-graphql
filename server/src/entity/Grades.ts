import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity("grades")
export class Grade extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  grade_id: number;

  @Field()
  @Column()
  grade_name: string;

  @Field()
  @Column()
  grade_medium: string;
}
