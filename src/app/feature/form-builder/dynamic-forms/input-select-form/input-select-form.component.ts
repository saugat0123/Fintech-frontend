import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-input-select-form',
  templateUrl: './input-select-form.component.html',
  styleUrls: ['./input-select-form.component.scss']
})
export class InputSelectFormComponent implements OnInit {
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
