import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SearchRequest } from '../interfaces/generic-page.interface';

@Component({
    selector: 'app-generic-grid',
    templateUrl: './generic-grid.component.html',
    styleUrls: ['./generic-grid.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [MessageService]
})
export class GenericGridComponent implements OnInit {
    @ViewChild('table') table: any;
    gridData: ParentRowData[] = [];
    cols = [];
    childCols = [];
    row = [];
    public rowsPerPageOptions = [10, 25, 50, 100, 200];
    private isFiltered = false;
    public rowsShown: string;
    public totalRecords = 0;
    public expandedRows: {} = {};
    public dataKey: string;

    constructor(private appService: AppService, private messageService: MessageService) { }

    ngOnInit() { }

    public fetchGridDataAndLoad(searchRequest: SearchRequest) {
        this.cols = [];
        this.childCols = []
        this.appService.fetchGridResponse(searchRequest).subscribe((response: any) => {
            console.log(response)
            if (response.statusCd === 200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
                this.dataKey = response.results.dataKeyColumn;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
            (response.results as GenericSearchGridResponse).headerColumns.forEach((columnHeader: string, index: number) => {
                this.cols.push({ field: columnHeader, header: columnHeader });
            });
            (response.results as GenericSearchGridResponse).childColumns.forEach((columnHeader: string, index: number) => {
                this.childCols.push({ field: columnHeader, header: columnHeader });
            });
 
            this.gridData = response.results.parentRowDataList;
            console.log('888 ', this.gridData);
        });
    }
}

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
