import { Prisma } from "../../generated/prisma/client";

export const searching = (
  inputFilter:
    | Prisma.StudentWhereInput[]
    | Prisma.AdminWhereInput[]
    | Prisma.TeacherWhereInput[]
    | Prisma.CoursesWhereInput[]
    | Prisma.TaskWhereInput[],
  searchFields: string[],
  searchTerm: string,
) => {
  const orConditions = searchFields.map((field) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      let currentStructure: any = {
        contains: String(searchTerm),
        mode: "insensitive",
      };

      for (let i = parts.length - 1; i >= 0; i--) {
        const key = parts[i] as string;
        currentStructure = { [key]: currentStructure };
      }
      return currentStructure;
    }

    return { [field]: { contains: String(searchTerm), mode: "insensitive" } };
  });

  return inputFilter.push({ OR: orConditions });
};
