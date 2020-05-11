import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-proposal-summary',
  templateUrl: './proposal-summary.component.html',
  styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent implements OnInit {
  @Input() proposal;

  constructor() { }

  ngOnInit() {
  }

}
