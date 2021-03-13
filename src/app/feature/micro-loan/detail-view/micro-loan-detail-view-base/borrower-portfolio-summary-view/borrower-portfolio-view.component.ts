import {Component, Input, OnInit} from '@angular/core';
import {NumberUtils} from '../../../../../@core/utils/number-utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {BorrowerPortfolio} from '../../../../loan/model/borrwerportfolio';

@Component({
  selector: 'app-borrower-portfolio-view',
  templateUrl: './borrower-portfolio-summary.component.html',
  styleUrls: ['./borrower-portfolio-summary.component.scss']
})
export class BorrowerPortfolioViewComponent implements OnInit {
  @Input() borrowerData: BorrowerPortfolio;

  parsedData;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.borrowerData)) {
      this.parsedData = JSON.parse(this.borrowerData.data);
    }
  }

  total(formControlName) {
    let total = 0;
    this.parsedData.portfolioDetail.forEach(item => {
      total += Number(item[formControlName]);
    });
    return NumberUtils.isNumber(total);
  }

  calcTotal(data: any[]) {
    return data.map(value => Number(value)).reduce((previousValue, currentValue) =>
        previousValue + currentValue);
  }

}
