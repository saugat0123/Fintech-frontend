import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-remit-loan-view',
  templateUrl: './remit-loan-view.component.html',
  styleUrls: ['./remit-loan-view.component.scss']
})
export class RemitLoanViewComponent implements OnInit {

  constructor() { }
@Input() selectedIdData;
  @Input() ref;
  beneficiaryData: any;
  senderData: any;
  data: any;
  proposalData: any;
  agentData: any;
  ngOnInit() {

    try {
      this.agentData = JSON.parse(this.selectedIdData.agentData);
      this.senderData = JSON.parse(this.selectedIdData.senderData);
      this.beneficiaryData = JSON.parse(this.selectedIdData.beneficiaryData);
    } catch (ex) {

    }

  }

}
