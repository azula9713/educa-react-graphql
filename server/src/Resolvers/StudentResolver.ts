import { Student } from "../entity/Student";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { hash, verify as verifyEncrypt } from "argon2";
import moment from "moment";
import { MyContext } from "../services/StuContext";
import {
  createAccessToken,
  createRefreshToken,
} from "../services/TokenGenerate";
import { stuAuth } from "../services/stuAuth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class StudentResolver {
  @Query(() => String)
  hello() {
    return "Hi!";
  }

  @Query(() => String)
  @UseMiddleware(stuAuth)
  auth(@Ctx() { payload }: MyContext) {
    return `Your student ID is: ${payload?.studentID}`;
  }

  @Query(() => [Student])
  students() {
    return Student.find();
  }

  @Mutation(() => [String])
  async regsiter(
    @Arg("stu_email", () => String) stu_email: string,
    @Arg("stu_password", () => String) stu_password: string,
    @Arg("stu_first_name", () => String) stu_first_name: string,
    @Arg("stu_last_name", () => String) stu_last_name: string,
    @Arg("stu_mobile", () => String) stu_mobile: string,
    @Arg("grade_id", () => Int) grade_id: number,
    @Arg("sub_id", () => Int) sub_id: number,
    @Arg("stu_is_approved", () => Boolean) stu_is_approved: boolean,
    @Arg("stu_is_allowed", () => Boolean) stu_is_allowed: boolean
  ) {
    const hashedPassword = await hash(stu_password);
    try {
      await Student.insert({
        stu_email,
        stu_password: hashedPassword,
        stu_first_name,
        stu_last_name,
        stu_mobile,
        grade_id,
        sub_id,
        stu_is_allowed,
        stu_is_approved,
        stu_reg_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      });
    } catch (err) {
      console.log(err);
    }

    return [
      stu_email,
      stu_first_name,
      stu_last_name,
      stu_mobile,
      grade_id,
      sub_id,
      stu_is_allowed,
      stu_is_approved,
    ];
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("stu_email", () => String) stu_email: string,
    @Arg("stu_password", () => String) stu_password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const student = await Student.findOne({
      where: { stu_email },
    });
    if (student) {
      const valid = await verifyEncrypt(student.stu_password, stu_password);

      if (!valid) {
        throw new Error("Incorrect password!");
      }
      if (!student.stu_is_allowed || !student.stu_is_approved) {
        throw new Error("Student has not paid!");
      }
    } else {
      throw new Error("Student is not in the system!");
    }

    //Success Login

    res.cookie("jid", createRefreshToken(student), {
      httpOnly: true,
    });
    return {
      accessToken: createAccessToken(student),
    };
  }
}
