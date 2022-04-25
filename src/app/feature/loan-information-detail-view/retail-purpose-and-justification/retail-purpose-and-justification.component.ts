import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../admin/modal/proposal';

@Component({
  selector: 'app-retail-purpose-and-justification',
  templateUrl: './retail-purpose-and-justification.component.html',
  styleUrls: ['./retail-purpose-and-justification.component.scss']
})
export class RetailPurposeAndJustificationComponent implements OnInit {
  proposalData: Proposal = new Proposal();
  proposalAllData: any;
  constructor() { }

  ngOnInit() {
    this.proposalAllData = JSON.parse(this.proposalData.data);
    console.log('proposalAllData', this.proposalAllData);
  }

}
