import { searching } from "../../../shared/searching";
import { filtering } from "../../../shared/filtering";
import { pagination } from "../../../shared/pagination";
import { Prisma, UserStatus } from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

const getAllAdminFromDB = async (query: any) => {
    const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;

    const searchFields = ['name', 'email'];
    let inputFilter: Prisma.AdminWhereInput[] = []

    if (searchTerm) {  
        searching(inputFilter, searchFields, searchTerm);
    }

    if (Object.keys(filterData).length > 0) {
        filtering(inputFilter, filterData);
    }

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), sortBy, sortOrder);

    const whereCondition: Prisma.AdminWhereInput = { AND: inputFilter }

    const admins = await prisma.admin.findMany({ where: whereCondition, skip: skipValue, take: takeValue, orderBy: { [sortByField]: sortOrderValue } });

    const total = await prisma.admin.count({ where: whereCondition });
    const totalPages = Math.ceil(total / takeValue);
    return {
        meta: {
            currentPage,
            limit: takeValue,
            total,
            totalPages,
        },
        data: admins
    };
}

const getSingleAdminFromDB = async (id: string) => {
    const admin = await prisma.admin.findUniqueOrThrow({
        where: { id }
    })
    return admin;
}

const updateAdminIntoDB = async (id: string, updateData: any) => {
    const isAdminExist = await prisma.admin.findUniqueOrThrow({
        where: { id }
    })

    if (isAdminExist) {
        const updateAdmin = await prisma.admin.update({
            where: { id: isAdminExist.id },
            data: updateData
        })
        return updateAdmin;
    }

}

const deleteAdminFromDB = async (id: string) => {
    const isAdminExist = await prisma.admin.findUniqueOrThrow({
        where: { id }
    })

    if(isAdminExist.isDeleted){
        throw new Error('Admin already deleted');
    }

    const isUserExist = await prisma.user.findUniqueOrThrow({
        where: { email: isAdminExist.email }
    })

    if(isUserExist.userStatus === UserStatus.DELETED){
        throw new Error('User already deleted');
    }

    if (isAdminExist) {
       await prisma.$transaction(async (transactionClient) => {
            await transactionClient.admin.update({
                where: { id: isAdminExist.id },
                data: { isDeleted: true }
            })
            await transactionClient.user.updateMany({
                where: { email: isAdminExist.email },
                data: { userStatus: UserStatus.DELETED }
            })
        })
    } return null;

}
export const AdminService = {
    getAllAdminFromDB,
    updateAdminIntoDB,
    getSingleAdminFromDB,
    deleteAdminFromDB
}