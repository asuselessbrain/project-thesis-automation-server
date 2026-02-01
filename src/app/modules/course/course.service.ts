import { CourseStatus, Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import { filtering } from "../../../shared/filtering";
import { pagination } from "../../../shared/pagination";
import { searching } from "../../../shared/searching";
import AppError from "../../errors/appErrors";

const createCourseIntoDB = async (data: Prisma.CoursesCreateInput) => {
  const result = await prisma.courses.create({
    data,
  });
  return result;
};

const getAllCoursesFromDB = async (query: any) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;

  let filterInput: Prisma.CoursesWhereInput[] = [];

  if (searchTerm) {
    searching(filterInput, ["courseCode", "courseName"], searchTerm);
  }

  if (Object.keys(filterData).length) {
    filtering(filterInput, filterData);
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
    pagination(skip, take, sortBy, sortOrder);

  const whereCondition: Prisma.CoursesWhereInput = { AND: filterInput };

  const result = await prisma.courses.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
  });

  const total = await prisma.courses.count({ where: whereCondition });

  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages,
    },
    data: result,
  };
};

const updateCoursesIntoDB = async (
  id: string,
  data: Partial<Prisma.CoursesUpdateInput>,
) => {
  const isCourseExist = await prisma.courses.findUnique({ where: { id } });

  if (!isCourseExist) {
    throw new Error("Course not found");
  }

  const result = await prisma.courses.update({
    where: { id },
    data,
  });
  return result;
};

const courseSetInTrashInDB = async (id: string) => {
  const isCourseExist = await prisma.courses.findUnique({ where: { id } });

  if (!isCourseExist) {
    throw new Error("Course not found");
  }

  const result = await prisma.courses.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
  return result;
};

const reActivateCourseInDB = async (id: string) => {
  const isCourseExist = await prisma.courses.findUnique({ where: { id } });
  if (!isCourseExist) {
    throw new Error("Course not found");
  }

  const result = await prisma.courses.update({
    where: { id },
    data: { status: "ACTIVE" },
  });
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await prisma.courses.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const getAllCourseForProjectThesis = async () => {
  const result = await prisma.courses.findMany({
    where: {
      status: CourseStatus.ACTIVE,
    },
  });
  return result;
};

const getMyAssignedCourses = async (email: string, query: any) => {
  const teacher = await prisma.teacher.findUnique({
    where: { email },
  });

  if (!teacher) {
    throw new AppError(404, "Teacher not found");
  }

  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;

  let filterDateInput: Prisma.CoursesWhereInput[] = [];

  if (searchTerm) {
    searching(filterDateInput, ["courseCode", "courseName"], searchTerm);
  }

  if (Object.keys(filterData).length) {
    filtering(filterDateInput, filterData);
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
    pagination(skip, take, sortBy, sortOrder);

  const whereCondition: Prisma.CoursesWhereInput = {
    AND: filterDateInput,
    courseTeachers: { some: { teacherId: teacher.id } },
  };

  const result = await prisma.courses.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
  });

  const total = await prisma.courses.count({ where: whereCondition });

  const totalPages = Math.ceil(total / takeValue);

  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages,
    },
    data: result,
  };
};

export const CourseService = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  updateCoursesIntoDB,
  courseSetInTrashInDB,
  reActivateCourseInDB,
  getSingleCourseFromDB,
  getAllCourseForProjectThesis,
  getMyAssignedCourses,
};
