import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-input-radio-form',
  templateUrl: './input-radio-form.component.html',
  styleUrls: ['./input-radio-form.component.scss']
})
export class InputRadioFormComponent implements OnInit {
  @Input() field: any;
  @Input() dynamicFormGroup: FormGroup;
  @Input() submitted: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  dynamicFormControl(control) {
    return this.dynamicFormGroup.controls[control];
  }


}
