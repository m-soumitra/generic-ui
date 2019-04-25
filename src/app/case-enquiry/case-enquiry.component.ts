import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { GenericFormField } from '../generic-form/generic-form.component';
import { Validators, FormGroup } from '@angular/forms';
import { GenericGridComponent } from '../generic-grid/generic-grid.component';
import { single } from 'rxjs/operators';
import { stringify } from '@angular/core/src/render3/util';


@Component({
    selector: 'app-case-enquiry',
    templateUrl: 'case-enquiry.component.html'
})
export class CaseEnquiryComponent implements OnInit {

    @ViewChild('genericGrid') genericGrid: GenericGridComponent;

    sections: Array<Section> = [];
    showGrid = false;
    queryId: string;

    constructor(private appService: AppService) {

    }

    ngOnInit() {

    }

    searchScreenToggle(queryId: string) {
        this.sections = [];
        this.showGrid = false;
        if (queryId !== 'Select') {
            this.appService.fetchScreenCreateRespone(queryId).subscribe((res: any) => {
                this.queryId = res.queryId;
                const results = res.results as Results;

                results.sections.forEach((section: Section) => {
                    let sec: Section = new Section(section.name);
                    let fields: Array<GenericFormField> = [];
                    section.fields.forEach(field => {
                        if (field.type === 'select') {
                            const eachField: GenericFormField = {
                                name: field.name,
                                title: field.title,
                                type: field.type,
                                validators: [Validators.required],
                                default: field.default,
                                lookups: [{ key: '', value: 'Select', selected: true },
                                { key: '1', value: 'Mr' }, { key: '2', value: 'Mrs' },
                                { key: '3', value: 'Miss' }]
                            };
                            fields.push(eachField);
                        } else {
                            const eachField: GenericFormField = {
                                name: field.name,
                                title: field.title,
                                type: field.type,
                                validators: [Validators.required],
                                default: field.default
                            };
                            fields.push(eachField);
                        }
                    });
                    sec.fields = fields;
                    this.sections.push(sec);
                });

                const formGroups = [
                    { name: 'first-group' }
                ];
            });
        }
    }

    onSubmit(formSubmitted: FormGroup) {
        this.showGrid = true;
        const searchRequest = this.transformForGenericGridRequest(formSubmitted);
        this.genericGrid.fetchGridDataAndLoad(searchRequest);
    }

    transformForGenericGridRequest(formSubmitted: FormGroup): SearchRequest {
        let searchRequest = {} as SearchRequest;
        searchRequest.queryId = this.queryId;
        // let singleInputFields: Map<string, string> = new Map();
        let singleInputFields: { [name: string]: string } = {};
        Object.keys(formSubmitted.controls).forEach((key: string) => {
            console.log(key, ' ', formSubmitted.get(key).value);
            // singleInputFields.set(key, formSubmitted.get(key).value);
            singleInputFields[key] = formSubmitted.get(key).value;
        });
        searchRequest.singleInputFields = singleInputFields;
        return searchRequest;
    }
}

export interface Results {
    queryId: string;
    sections: Section[];
}

export class Section {
    name: string;
    fields: any[];
    constructor(name: string) {
        this.name = name;
    }
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
