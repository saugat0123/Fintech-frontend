import {Component, Input, OnInit} from '@angular/core';
import {MGroup} from '../../../../customer/model/mGroup';

@Component({
  selector: 'app-m-group-summary',
  templateUrl: './m-group-summary.component.html',
  styleUrls: ['./m-group-summary.component.scss']
})
export class MGroupSummaryComponent implements OnInit {

  @Input() mGroup: MGroup;
  constructor() { }

  ngOnInit() {
  }

}
