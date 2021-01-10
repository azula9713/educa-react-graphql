import { sign } from "jsonwebtoken";
import { Student } from "src/entity/Student";
import { Teacher } from "src/entity/Teacher";

export const createAccessToken = (student: Student) => {
  return sign({ studentID: student.stu_id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (student: Student) => {
  return sign(
    { studentID: student.stu_id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const createLecAccessToken = (teacher: Teacher) => {
  return sign({ lecID: teacher.lec_id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const createLecRefreshToken = (teacher: Teacher) => {
  return sign({ lecID: teacher.lec_id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
