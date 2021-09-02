import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-remit-details',
  templateUrl: './remit-details.component.html',
  styleUrls: ['./remit-details.component.scss']
})
export class RemitDetailsComponent implements OnInit {

  constructor() { }
@Input() loanHolder;
  remit: any;
  agentDetails: any;
  beneficiaryDetails: any;
  senderDetails: any;

  ngOnInit() {
    this.remit = this.loanHolder.remitCustomer;
    this.agentDetails = JSON.parse(this.remit.agentData);
    this.senderDetails = JSON.parse(this.remit.senderData);
    this.beneficiaryDetails = JSON.parse(this.remit.beneficiaryData);
  }

}
