import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity("subjects")
export class Subject extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  sub_id: number;

  @Field()
  @Column()
  sub_name: string;

  @Field()
  @Column()
  sub_medium: string;
}
