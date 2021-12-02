import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-documentary-bill-purchase-negotiation',
  templateUrl: './documentary-bill-purchase-negotiation.component.html',
  styleUrls: ['./documentary-bill-purchase-negotiation.component.scss']
})
export class DocumentaryBillPurchaseNegotiationComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
