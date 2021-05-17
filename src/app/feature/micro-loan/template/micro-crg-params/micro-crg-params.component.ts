import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MicroCrgParams} from '../../../loan/model/MicroCrgParams';

@Component({
  selector: 'app-micro-crg-params',
  templateUrl: './micro-crg-params.component.html',
  styleUrls: ['./micro-crg-params.component.scss']
})
export class MicroCrgParamsComponent implements OnInit {

  @Input() fromProfile;
  @Input() microCrgParams: MicroCrgParams;
  @Output() dataEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
