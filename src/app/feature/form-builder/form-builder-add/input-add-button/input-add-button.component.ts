import {Component, Input, OnInit, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';
import {FormType} from '../../constants/formType';

@Component({
  selector: 'app-input-add-button',
  templateUrl: './input-add-button.component.html',
  styleUrls: ['./input-add-button.component.scss']
})
export class InputAddButtonComponent implements OnInit {

  @Input() field: any;
  @Input() selectedField: any;
  @Output() removeField = new EventEmitter();
  INPUT_TYPE = FormType.INPUT_TYPE;
  constructor() { }

  ngOnInit() {
  }

  removeElement() {
    this.removeField.emit(true);
  }
}
