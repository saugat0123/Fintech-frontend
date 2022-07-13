import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-line-break-add',
  templateUrl: './line-break-add.component.html',
  styleUrls: ['./line-break-add.component.scss']
})
export class LineBreakAddComponent implements OnInit {

  @Input() field: any;
  @Input() selectedField: any;
  @Output() removeField = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  removeElement() {
    this.removeField.emit(true);
  }

}
