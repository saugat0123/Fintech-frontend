import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../admin/modal/proposal';

@Component({
  selector: 'app-newt-worth',
  templateUrl: './newt-worth.component.html',
  styleUrls: ['./newt-worth.component.scss']
})
export class NewtWorthComponent implements OnInit {

  constructor() { }
  @Input() proposal: Proposal;
  individualJsonData;
  mergedChecked;
  ngOnInit() {
    this.individualJsonData = JSON.parse(this.proposal.data);
    this.mergedChecked = JSON.parse(this.proposal.checkedData);
  }

}
