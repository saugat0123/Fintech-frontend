import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bill-purchase',
  templateUrl: './bill-purchase.component.html',
  styleUrls: ['./bill-purchase.component.scss']
})
export class BillPurchaseComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
