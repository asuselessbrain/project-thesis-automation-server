import { Prisma } from "../../generated/prisma/client";

export const filtering = (
  inputFilter:
    | Prisma.StudentWhereInput[]
    | Prisma.AdminWhereInput[]
    | Prisma.TeacherWhereInput[]
    | Prisma.CoursesWhereInput[]
    | Prisma.TaskWhereInput[],
  filterData: Record<string, any>,
) => {
  const filterConditions = Object.keys(filterData).map((key) => {
    const value = filterData[key];
    if (key.includes(".")) {
      const parts = key.split(".");
      let nestedFilter: any = { equals: value };
      for (let i = parts.length - 1; i >= 0; i--) {
        const partKey = parts[i] as string;
        nestedFilter = { [partKey]: nestedFilter };
      }
      return nestedFilter;
    }
    return { [key]: { equals: value } };
  });

  if (filterConditions.length > 0) {
    return inputFilter.push({ AND: filterConditions });
  }
};
