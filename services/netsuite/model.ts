export type NetsuiteVendor = {
    id: string;
    name: string;
    address?: string;
}
export function createNetsuiteVendor(
    id: string,
    name: string,
    address?: string
): NetsuiteVendor {
    return {id, name, address};
}

export type NetsuiteAccount = {

}
export function createNetsuiteAccount(): NetsuiteAccount {
    return {}
}

export type SearchResponse<T> = {
    searchResult: {
        status: {
            attributes: {
                "isSuccess": "true" | "false";
            };
            statusDetail: [{}];
        };
        totalRecords: number;
        pageSize: number;
        totalPages: number;
        pageIndex: number;
        searchId: string;
        recordList: {
            record: T[];
        }
    }
}

