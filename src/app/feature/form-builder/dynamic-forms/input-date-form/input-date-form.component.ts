import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-input-date-form',
  templateUrl: './input-date-form.component.html',
  styleUrls: ['./input-date-form.component.scss']
})
export class InputDateFormComponent implements OnInit {
  @Input() field: any;
  @Input() dynamicFormGroup: FormGroup;
  @Input() submitted: boolean;
  @Input() calendarType: any;

  constructor() {
  }

  ngOnInit() {
  }

  dynamicFormControl(control) {
    return this.dynamicFormGroup.controls[control];
  }
}
