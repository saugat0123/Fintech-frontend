import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-memo-base',
  templateUrl: './credit-memo-base.component.html',
  styleUrls: ['./credit-memo-base.component.scss']
})
export class CreditMemoBaseComponent implements OnInit {
  isMaker = false;

  constructor() {
  }

  ngOnInit() {
    if (localStorage.getItem('roleType') === 'MAKER') {
      this.isMaker = true;
    }
  }
}
