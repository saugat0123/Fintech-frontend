import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-income-from-account-summery',
  templateUrl: './income-from-account-summery.component.html',
  styleUrls: ['./income-from-account-summery.component.scss']
})
export class IncomeFromAccountSummeryComponent implements OnInit {
  @Input() formData;

  constructor() {
    console.log(this.formData);
  }

  ngOnInit() {

  }

}
