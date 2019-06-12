import { ValidatorFn } from '@angular/forms';

export interface GenericFormField {
    title: string;
    name?: string;
    type: 'text' | 'number' | 'checkbox' | 'select' | 'radio';
    validators?: Array<ValidatorFn>;
    lookups?: Array<Lookup>;
    default?: string;
    radioButtons?: string[];
    invalid?: boolean;
    errorMessage?: string;
    warn?: boolean;
    warningMessage?: string;
}

export interface Lookup {
    key: string;
    value: string;
    selected?: boolean;
}