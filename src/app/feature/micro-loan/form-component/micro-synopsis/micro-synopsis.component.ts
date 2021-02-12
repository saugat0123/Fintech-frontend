import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';

@Component({
  selector: 'app-micro-synopsis',
  templateUrl: './micro-synopsis.component.html',
  styleUrls: ['./micro-synopsis.component.scss']
})
export class MicroSynopsisComponent implements OnInit {
  @Input() public customerInfo: CustomerInfoData;
  constructor() { }

  ngOnInit() {
  }

}
