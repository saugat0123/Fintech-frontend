import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-income-from-account-view',
  templateUrl: './income-from-account-view.component.html',
  styleUrls: ['./income-from-account-view.component.scss']
})
export class IncomeFromAccountViewComponent implements OnInit {
  @Input()  data;
  @Input()  individual;

  // disableCrgAlpha and disableCrgLambda
  disabledLambda = environment.disableCrgLambda;
  disabledAlpha = environment.disableCrgAlpha;

  constructor() { }

  ngOnInit() {
    if (!this.individual) {
      this.data.accountTransactionForm = JSON.parse(this.data.accountTransactionForm);
    }
  }

}
