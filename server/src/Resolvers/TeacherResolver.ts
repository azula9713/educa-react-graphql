import { Teacher } from "../entity/Teacher";
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
import { LecContext } from "../services/LecContext";
import {
  createLecAccessToken,
  createLecRefreshToken,
} from "../services/TokenGenerate";
import { lecAuth } from "../services/lecAuth";

@ObjectType()
class LecLoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class TeacherResolver {
  @Query(() => String)
  @UseMiddleware(lecAuth)
  auth(@Ctx() { payload }: LecContext) {
    return `Your lecturer ID is: ${payload?.lecID}`;
  }

  @Query(() => [Teacher])
  students() {
    return Teacher.find();
  }

  @Mutation(() => [String])
  async lecregsiter(
    @Arg("lec_email", () => String) lec_email: string,
    @Arg("lec_password", () => String) lec_password: string,
    @Arg("lec_first_name", () => String) lec_first_name: string,
    @Arg("lec_last_name", () => String) lec_last_name: string,
    @Arg("lec_mobile", () => String) lec_mobile: string,
    @Arg("sub_id", () => Int) sub_id: number
  ) {
    const hashedPassword = await hash(lec_password);
    try {
      await Teacher.insert({
        lec_email,
        lec_password: hashedPassword,
        lec_first_name,
        lec_last_name,
        lec_mobile,
        sub_id,
        lec_reg_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      });
    } catch (err) {
      console.log(err);
    }

    return [lec_email, lec_first_name, lec_last_name, lec_mobile, sub_id];
  }

  @Mutation(() => LecLoginResponse)
  async leclogin(
    @Arg("lec_email", () => String) lec_email: string,
    @Arg("lec_password", () => String) lec_password: string,
    @Ctx() { res }: LecContext
  ): Promise<LecLoginResponse> {
    const teacher = await Teacher.findOne({
      where: { lec_email },
    });
    if (teacher) {
      const valid = await verifyEncrypt(teacher.lec_password, lec_password);

      if (!valid) {
        throw new Error("Incorrect password!");
      }
    } else {
      throw new Error("Lecturer is not in the system!");
    }

    //Success Login

    res.cookie("jit", createLecRefreshToken(teacher), {
      httpOnly: true,
    });
    return {
      accessToken: createLecAccessToken(teacher),
    };
  }
}
