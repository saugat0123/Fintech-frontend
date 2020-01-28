import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../../../admin/modal/proposal';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss']
})
export class ProposalDetailsComponent implements OnInit {
  @Input() proposalData: Proposal;

  constructor() { }

  ngOnInit() {
  }

}
