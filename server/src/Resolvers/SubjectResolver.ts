import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Subject } from "../entity/Subjects";

@Resolver()
export class SubjectResolver {
  @Mutation(() => [String])
  async createSubject(
    @Arg("sub_name") sub_name: string,
    @Arg("sub_medium") sub_medium: string
  ) {
    const subject = await Subject.findOne({
      where: { sub_name, sub_medium },
    });

    if (!subject) {
      try {
        await Subject.insert({
          sub_name,
          sub_medium,
        });
      } catch (err) {
        console.log(err);
      }

      return [sub_name, sub_medium];
    } else {
      return [
        sub_name,
        "The subject you entered is already in the system. Please use the existing one!",
      ];
    }
  }

  @Query(() => [Subject])
  subjects() {
    return Subject.find();
  }
}
