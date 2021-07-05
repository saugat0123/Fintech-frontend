import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-income-from-account-view',
  templateUrl: './income-from-account-view.component.html',
  styleUrls: ['./income-from-account-view.component.scss']
})
export class IncomeFromAccountViewComponent implements OnInit {
  @Input()  data;

  // disableCrgAlpha and disableCrgLambda
  disabledLambda = environment.disableCrgLambda;
  disabledAlpha = environment.disableCrgAlpha;

  constructor() { }

  ngOnInit() {
  }

}
