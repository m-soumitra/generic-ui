import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html'
})
export class GenericFormComponent implements OnInit {

  @Input() fields: Array<GenericFormField> = [];
  @Output() formSubmitEvent: EventEmitter<FormGroup> = new EventEmitter();

  myForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({});

    for (let field of this.fields) {
      this.myForm.addControl(
        field.name,
        this.fb.control('', field.validators)
      );
    }
  }

  onSubmit() {
    this.formSubmitEvent.emit(this.myForm);
  }

}

export class GenericFormField {
  title: string;
  name: string;
  type: 'text' | 'number' | 'checkbox' | 'select';
  validators?: Array<ValidatorFn>;
  lookups?: Array<Lookup>;
  default?: string;
}

export class Lookup {
  key: string;
  value: string;
  selected?: boolean;
}
