import { CourseStatus, Department, Prisma, TeacherDesignation, TeacherStatus } from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import { pagination } from "../../../shared/pagination";

const createCourseTeacherIntoDB = async (data: Prisma.CourseTeacherCreateInput) => {
    const result = await prisma.courseTeacher.create({
        data
    });
    return result;
}

const getAllCourseTeachersFromDB = async (query: any) => {
    const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
    let courseTeacherInputFields: Prisma.CourseTeacherWhereInput[] = [];

    if (searchTerm) {
        courseTeacherInputFields.push({
            OR: [
                { course: { courseName: { contains: String(searchTerm), mode: 'insensitive' } } },
                { course: { courseCode: { contains: String(searchTerm), mode: 'insensitive' } } },
                { teacher: { name: { contains: String(searchTerm), mode: 'insensitive' } } }
            ]
        })
    }

    if (Object.keys(filterData).length) {
        Object.entries(filterData).forEach(([field, value]) => {
            if (field === 'courseStatus') {
                courseTeacherInputFields.push({ course: { status: { equals: value as CourseStatus } } })
            }
            if (field === 'teacherStatus') {
                courseTeacherInputFields.push({ teacher: { status: { equals: value as TeacherStatus } } })
            }
            if (field === 'department') {
                courseTeacherInputFields.push({ teacher: { department: { equals: value as Department } } })
            }
            if (field === 'designation') {
                courseTeacherInputFields.push({ teacher: { designation: { equals: value as TeacherDesignation } } })
            }
        })
    }

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);

    const whereCondition: Prisma.CourseTeacherWhereInput = { AND: courseTeacherInputFields };


    const result = await prisma.courseTeacher.findMany({ where: whereCondition, include: { course: true, teacher: true }, skip: skipValue, take: takeValue, orderBy: { [sortByField]: sortOrderValue } });

    const total = await prisma.courseTeacher.count({ where: whereCondition });
    return {
        meta: {
            currentPage,
            take: takeValue,
            total
        },
        data: result
    };
}

const updateCourseTeacherIntoDB = async (id: string, data: Partial<Prisma.CourseTeacherUpdateInput>) => {
    const isCourseTeacherExist = await prisma.courseTeacher.findUnique({ where: { id } });
    if (!isCourseTeacherExist) {
        throw new Error("Course Teacher not found");
    }
    const result = await prisma.courseTeacher.update({
        where: { id },
        data
    });
    return result;
}

const getSpecificCourseTeacher = async (courseId: string) => {
    const courses = await prisma.courseTeacher.findMany({
        where: {
            courseId
        },
        include: { teacher: true }
    })
    return courses
}

export const CourseTeacherService = {
    createCourseTeacherIntoDB,
    getAllCourseTeachersFromDB,
    updateCourseTeacherIntoDB,
    getSpecificCourseTeacher
}