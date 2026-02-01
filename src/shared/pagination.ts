export const pagination = (skip: number = 0, take?: number, sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    const currentPage = Number(skip) ? Number(skip) + 1 : 1;
    const takeValue = Number(take) || 10;
    const skipValue = Number(skip) * takeValue || 0;
    const sortByField = sortBy || 'createdAt';
    const sortOrderValue = sortOrder || 'desc'

    return {
        currentPage,
        skipValue,
        takeValue,
        sortByField,
        sortOrderValue
    }
}