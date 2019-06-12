import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { GenericFormField } from '../interfaces/generic-form.interface';

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html'
})
export class GenericFormComponent implements OnInit {

  @Input() fields: Array<GenericFormField> = [];
  @Output() formSubmitEvent: EventEmitter<FormGroup> = new EventEmitter();

  myForm: FormGroup;
  errors: string[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({});

    for (const field of this.fields) {
      this.myForm.addControl(
        field.name,
        this.fb.control('', field.validators)
      );
    }

    this.resetErrorMessages();
    this.generateErrorMessages(this.myForm);
    this.myForm.statusChanges.subscribe(status => {
      this.resetErrorMessages();
      this.generateErrorMessages(this.myForm);
    });
  }

  private generateErrorMessages(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      const errors = control.errors;
      let errorMessage = '';
      let warningMessage = '';
      if (errors === null || errors.count === 0) {
        this.fields.forEach(f => {
          if (f.name === controlName) {
            f.invalid = false;
            f.errorMessage = '';
            f.warn = false;
            f.warningMessage = '';
          }
        });
        return;
      }
      // Handle the 'required' case
      if (errors.required) {
        this.errors.push(` ${controlName} is required`);
        errorMessage += ` ${controlName} is required`;
      }
      // Handle 'minlength' case
      if (errors.minlength) {
        this.errors.push(` ${controlName} minimum length is '\n ${errors.minlength.requiredLength}.`);
        errorMessage += ` ${controlName} minimum length is ${errors.minlength.requiredLength}.`;
      }
      if (errors.alphanumeric && errors.alphanumeric.pattern) {
        if (errors.alphanumeric.type === 'ERROR') {
          this.errors.push(` ${controlName}` + errors.alphanumeric.message);
          errorMessage += ` ${controlName}` + errors.alphanumeric.message;
        }
        if (errors.alphanumeric.type === 'WARN') {
          warningMessage = ` ${controlName}` + errors.alphanumeric.message;
          if (errors.length === 1) {
            formGroup.controls[controlName].setErrors(null);
          }
        }
      }
      this.fields.forEach(f => {
        if (f.name === controlName) {
          f.invalid = true;
          f.errorMessage = errorMessage;
          if (warningMessage.length > 0) {
            f.warn = true;
            f.warningMessage = warningMessage;
          }
        }
      });
    });
  }

  resetErrorMessages() {
    this.errors.length = 0;
  }

  onSubmit() {
    this.formSubmitEvent.emit(this.myForm);
  }

}
