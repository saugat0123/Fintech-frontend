import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../../admin/modal/proposal';

@Component({
  selector: 'app-micro-other-info-and-confirmation',
  templateUrl: './micro-other-info-and-confirmation.component.html',
  styleUrls: ['./micro-other-info-and-confirmation.component.scss']
})
export class MicroOtherInfoAndConfirmationComponent implements OnInit {
 @Input() proposal: Proposal;
 proposalData;
  constructor() { }

  ngOnInit() {
      this.proposalData = JSON.parse(this.proposal.data);
  }

}
