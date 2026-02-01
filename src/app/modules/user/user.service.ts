import { Secret } from "jsonwebtoken";
import { config } from "../../../config";
import { jwtGenerator, jwtVerifier } from "../../../shared/jwtGenerator";
import bcrypt from "bcrypt";
import sendEmail from "../../../shared/mailSender";
import { verifyEmailTemplate } from "../../../utils/emailTemplates/verifyEmailTemplate";
import { UserRole } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { StringValue } from "ms";

const verifyEmail = async (info: { email: string; role: UserRole }) => {
  const generateEmailVerificationToken = jwtGenerator({
    userInfo: { email: info.email, role: info.role },
    createSecretKey: config.jwt.email_verification_token as Secret,
    expiresIn: config.jwt.email_verification_token_expires_in as StringValue,
  });

  const verifyUrl = `http://localhost:3000/verify-email?token=${generateEmailVerificationToken}&email=${info.email}`;

  await sendEmail({
    to: info.email,
    subject: "Email Verification",
    html: verifyEmailTemplate(verifyUrl),
  });
};

const createStudentIntoDB = async (studentInfo: any) => {
  const hashedPassword = await bcrypt.hash(
    studentInfo.password,
    Number(config.salt_rounds),
  );

  const userData = {
    email: studentInfo.email,
    password: hashedPassword,
    role: UserRole.STUDENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({ data: userData });
    const student = await transactionClient.student.create({
      data: studentInfo.student,
    });

    return student;
  });

  const info = {
    email: studentInfo.email,
    role: UserRole.STUDENT,
  };

  await verifyEmail(info);

  return result;
};

const createAdminIntoDB = async (adminInfo: any) => {
  const hashedPassword = await bcrypt.hash(
    adminInfo.password,
    Number(config.salt_rounds),
  );
  const userData = {
    email: adminInfo.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createAdmin = await transactionClient.admin.create({
      data: adminInfo.admin,
    });
    return createAdmin;
  });

  const info = {
    email: adminInfo.email,
    role: UserRole.ADMIN,
  };

  await verifyEmail(info);

  return result;
};

const createTeacherIntoDB = async (teacherInfo: any) => {
  const hashedPassword = await bcrypt.hash(
    teacherInfo.password,
    Number(config.salt_rounds),
  );
  const userData = {
    email: teacherInfo.email,
    password: hashedPassword,
    role: UserRole.TEACHER,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createTeacher = await transactionClient.teacher.create({
      data: teacherInfo.teacher,
    });
    return createTeacher;
  });

  const info = {
    email: teacherInfo.email,
    role: UserRole.TEACHER,
  };

  await verifyEmail(info);
  return result;
};

const verifyEmailInDB = async (token: string, email: string) => {
  if (!token) {
    throw new Error("Token is required");
  }

  const decoded = jwtVerifier({
    token,
    secretKey: config.jwt.email_verification_token as Secret,
  });

  if (decoded.email !== email) {
    throw new Error("Invalid token");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const result = await prisma.user.update({
    where: { email },
    data: { isEmailVerified: true },
  });

  return result;
};

export const UserService = {
  createStudentIntoDB,
  createAdminIntoDB,
  createTeacherIntoDB,
  verifyEmailInDB,
};
