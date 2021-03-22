import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-income-from-account-view',
  templateUrl: './income-from-account-view.component.html',
  styleUrls: ['./income-from-account-view.component.scss']
})
export class IncomeFromAccountViewComponent implements OnInit {
  @Input()  data;
  constructor() { }

  ngOnInit() {
  }

}
