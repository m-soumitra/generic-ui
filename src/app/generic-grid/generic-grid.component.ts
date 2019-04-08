import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { SearchRequest } from '../case-enquiry/case-enquiry.component';

@Component({
    selector: 'app-generic-grid',
    templateUrl: './generic-grid.component.html'
})
export class GenericGridComponent implements OnInit {
    @ViewChild('table') table: any;
    gridData = [{}];
    cols = [];

    constructor(private appService: AppService) { }

    ngOnInit() { }

    public fetchGridDataAndLoad(searchRequest: SearchRequest) {
        this.cols = [];
        this.gridData = [];
        this.appService.fetchGridResponse(searchRequest).subscribe((response: any) => {
            const gridData: GenericSearchGridResponse = response.results;
            gridData.headerColumns.forEach((columnHeader: string, index: number) => {
                this.cols.push({ field: columnHeader, header: columnHeader });
            });
            const rows: Array<ParentRowData> = gridData.parentRowDataList;
            let rowObj = {};
            rows.forEach((row: any) => {
                Object.entries(row.rowData).forEach(
                    ([key, value]) => rowObj[key] = value
                );
                this.gridData.push(JSON.parse(JSON.stringify(rowObj)));
            });
        });
    }
}

export interface GenericSearchGridResponse {
    queryId: string;
    headerColumns: Array<string>;
    parentRowDataList: Array<ParentRowData>;
}

export interface ParentRowData {
    rowData: Map<string, string>;
    childRowDataHeader: Array<string>;
    childRowDataList?: Array<Map<string, string>>;
}
