import { searching } from "../../../shared/searching";
import { filtering } from "../../../shared/filtering";
import { pagination } from "../../../shared/pagination";
import {
  Prisma,
  StudentStatus,
  UserStatus,
} from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appErrors";

const getAllStudentFromDB = async (query: any) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;

  const searchFields = [
    "name",
    "email",
    "address",
    "studentId",
    "registrationNumber",
  ];
  let inputFilter: Prisma.StudentWhereInput[] = [];

  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }

  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
    pagination(Number(skip), Number(take), sortBy, sortOrder);

  const whereCondition: Prisma.StudentWhereInput = { AND: inputFilter };

  const students = await prisma.student.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
  });

  const total = await prisma.student.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages,
    },
    data: students,
  };
};

const getSingleStudentFromDB = async (id: string) => {
  const student = await prisma.student.findUniqueOrThrow({
    where: { id },
  });
  return student;
};

const updateStudentIntoDB = async (id: string, updateData: any) => {
  const isStudentExist = await prisma.student.findUniqueOrThrow({
    where: { id },
  });

  if (isStudentExist) {
    const updateStudent = await prisma.student.update({
      where: { id: isStudentExist.id },
      data: updateData,
    });
    return updateStudent;
  }
};

const deleteStudentFromDB = async (id: string) => {
  const isStudentExist = await prisma.student.findUniqueOrThrow({
    where: { id },
  });

  if (isStudentExist.isDeleted) {
    throw new Error("Student already deleted");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: isStudentExist.email },
  });

  if (isUserExist.userStatus === UserStatus.DELETED) {
    throw new Error("User already deleted");
  }

  if (isStudentExist) {
    await prisma.$transaction(async (transactionClient) => {
      await transactionClient.student.update({
        where: { id: isStudentExist.id },
        data: { isDeleted: true },
      });
      await transactionClient.user.updateMany({
        where: { email: isStudentExist.email },
        data: { userStatus: UserStatus.DELETED },
      });
    });
  }
  return null;
};

const approveStudentInDB = async (id: string) => {
  const isStudentExist = await prisma.student.findUnique({
    where: { id },
  });

  if (!isStudentExist) {
    throw new AppError(404, "Student not found");
  }

  if (isStudentExist.isApproved) {
    throw new AppError(400, "Student already approved");
  }

  if (isStudentExist.isDeleted) {
    throw new AppError(400, "Deleted student cannot be approved");
  }

  const approvedStudent = await prisma.student.update({
    where: { id: isStudentExist.id },
    data: { isApproved: true },
  });

  return approvedStudent;
};

const reActivateStudentInDB = async (id: string) => {
  const isStudentExist = await prisma.student.findUnique({
    where: { id },
  });

  if (!isStudentExist) {
    throw new AppError(404, "Student not found");
  }

  if (!isStudentExist.isDeleted) {
    throw new AppError(400, "Account is already active");
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email: isStudentExist.email },
  });

  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }

  if (isUserExist.userStatus !== UserStatus.DELETED) {
    throw new AppError(400, "User account is already active");
  }

  const reActivatedStudent = await prisma.$transaction(
    async (transactionClient) => {
      const student = await transactionClient.student.update({
        where: { id: isStudentExist.id },
        data: { isDeleted: false },
      });

      const user = await transactionClient.user.updateMany({
        where: { email: isStudentExist.email },
        data: { userStatus: UserStatus.ACTIVE },
      });

      return { student, user };
    },
  );

  return reActivatedStudent;
};

export const StudentService = {
  getAllStudentFromDB,
  updateStudentIntoDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  approveStudentInDB,
  reActivateStudentInDB,
};
