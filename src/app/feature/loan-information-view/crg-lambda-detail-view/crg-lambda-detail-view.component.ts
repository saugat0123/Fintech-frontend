import {Component, Input, OnInit} from '@angular/core';
import {LoanTag} from '../../loan/model/loanTag';

@Component({
  selector: 'app-crg-lambda-detail-view',
  templateUrl: './crg-lambda-detail-view.component.html',
  styleUrls: ['./crg-lambda-detail-view.component.scss']
})
export class CrgLambdaDetailViewComponent implements OnInit {

  @Input() lambdaData;
  @Input() loanTag;
  crgLambdaData: any;

  constructor() { }

  ngOnInit() {
    this.crgLambdaData = JSON.parse(this.lambdaData.data);
  }

}
