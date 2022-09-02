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

