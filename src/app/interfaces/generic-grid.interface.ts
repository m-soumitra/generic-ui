export interface GenericSearchGridResponse {
    queryId: string;
    headerColumns: Array<string>;
    childColumns: Array<string>;
    parentRowDataList: ParentRowData[];
}

export interface ParentRowData {
    rowData: Map<string, string>;
    childRowDataList?: Array<Map<string, string>>;
}
