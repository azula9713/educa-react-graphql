import { Grade } from "../entity/Grades";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class GradeResolver {
  @Mutation(() => [String])
  async createGrade(
    @Arg("grade_name") grade_name: string,
    @Arg("grade_medium") grade_medium: string
  ) {
    const subject = await Grade.findOne({
      where: { grade_name, grade_medium },
    });

    if (!subject) {
      try {
        await Grade.insert({
          grade_name,
          grade_medium,
        });
      } catch (err) {
        console.log(err);
      }

      return [grade_name, grade_medium];
    } else {
      return [
        grade_name,
        "The grade you entered is already in the system. Please use the existing one!",
      ];
    }
  }

  @Query(() => [Grade])
  grades() {
    return Grade.find();
  }
}
