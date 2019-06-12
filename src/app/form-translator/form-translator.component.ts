import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { GenericGridComponent } from '../generic-grid/generic-grid.component';
import { GenericFormField } from '../interfaces/generic-form.interface';
import * as page from '../interfaces/generic-page.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-form-translator',
    templateUrl: 'form-translator.component.html'
})
export class FormTranslatorComponent implements OnInit {

    @ViewChild('genericGrid') genericGrid: GenericGridComponent;

    sections: Array<page.Section> = [];
    showGrid = false;
    queryId: string;

    constructor(private appService: AppService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.queryId = params.screen;
            this.searchScreenToggle(this.queryId);
        })
    }

    searchScreenToggle(queryId: string) {
        this.sections = [];
        this.showGrid = false;
        this.appService.fetchScreenCreateRespone(queryId).subscribe((res: any) => {
            this.queryId = res.queryId;
            const results = res.results as page.Results;
            results.sections.forEach((section: page.Section) => {
                const sec = {} as page.Section;
                sec.name = section.name;
                const fields: Array<GenericFormField> = [];
                section.fields.forEach(field => {
                    const screenValidator = new ScreenValidatorComponent();
                    const validatorsList: ValidatorFn[] = [];
                    const validationsList = field.validations as page.Validator[];
                    validationsList.forEach(eachValidation => {
                        if (eachValidation.code === 'MANDATORY') {
                            validatorsList.push(Validators.required);
                        }
                        if (eachValidation.code === 'MIN') {
                            validatorsList.push(Validators.minLength(3));
                        }
                        if (eachValidation.code === 'ALPHANUMERIC') {
                            validatorsList.push(screenValidator.regExpValidation(
                                eachValidation.type, eachValidation.code, eachValidation.message));
                        }
                    });
                    if (field.type === 'select') {
                        const rowObj = [{ key: '', value: 'Select' }];
                        Object.entries(field.values).forEach(
                            ([key, value]) => rowObj.push({ key: key, value: value + '' })
                        );
                        const eachField: GenericFormField = {
                            name: field.name,
                            title: field.title,
                            type: field.type,
                            validators: validatorsList,
                            default: field.default,
                            lookups: rowObj,
                        };
                        fields.push(eachField);
                    } else if (field.type === 'radio') {
                        const rowObj = [];
                        Object.entries(field.values).forEach(
                            ([, value]) => rowObj.push(value)
                        );
                        const eachField: GenericFormField = {
                            radioButtons: rowObj,
                            name: field.name,
                            title: field.title,
                            type: field.type,
                            default: field.default,
                            validators: validatorsList
                        };
                        fields.push(eachField);
                    } else {
                        const eachField: GenericFormField = {
                            name: field.name,
                            title: field.title,
                            type: field.type,
                            validators: validatorsList,
                            default: field.default
                        };
                        fields.push(eachField);
                    }
                });
                sec.fields = fields;
                this.sections.push(sec);
            });

        });
    }

    onSubmit(formSubmitted: FormGroup) {
        this.showGrid = true;
        const searchRequest = this.transformForGenericGridRequest(formSubmitted);
        this.genericGrid.fetchGridDataAndLoad(searchRequest);
    }

    transformForGenericGridRequest(formSubmitted: FormGroup): page.SearchRequest {
        const searchRequest = {} as page.SearchRequest;
        searchRequest.queryId = this.queryId;
        // let singleInputFields: Map<string, string> = new Map();
        const singleInputFields: { [name: string]: string } = {};
        Object.keys(formSubmitted.controls).forEach((key: string) => {
            singleInputFields[key] = formSubmitted.get(key).value;
        });
        searchRequest.singleInputFields = singleInputFields;
        return searchRequest;
    }

}

class ScreenValidatorComponent implements OnInit {

    patternMap = new Map<string, RegExp>();

    constructor() {
        this.patternMap.set('ALPHANUMERIC', new RegExp(/^[0-9a-zA-Z]+$/));
    }

    ngOnInit(): void { }

    public regExpValidation(validationType: string, validationCode: string, validationMessage: string) {
        const ALNUM_REGEX = this.patternMap.get(validationCode);
        return (control: AbstractControl): { [key: string]: any } => {
            const input = control.value;
            if (input && !ALNUM_REGEX.test(input)) {
                return { alphanumeric: { pattern: true, type: validationType, message: validationMessage } };
            }
            if (input && !input.id && !ALNUM_REGEX.test(input)) {
                return { alphanumeric: { pattern: true, type: validationType, message: validationMessage } };
            }
            return null;
        }
    }

}
