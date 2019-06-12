
export interface Results {
    queryId: string;
    sections: Section[];
}

export class Section {
    name: string;
    fields: any[];
}

export interface SearchRequest {
    token: string;
    queryId: string;
    singleInputFields: { [name: string]: string };
    multiInputFields: Map<string, Array<string>>;
    gridMetadata?: SearchGridMetaData;
}

export interface SearchGridMetaData {
    pageSize: number;
    pageNumber: number;
    totalPages: number;
}

export interface Validator {
    code: string;
    message: string;
    type: string;
    actionMod: string;
}
