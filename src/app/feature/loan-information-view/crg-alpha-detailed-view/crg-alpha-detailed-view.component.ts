import {Component, Input, OnInit} from '@angular/core';
import {LoanTag} from '../../loan/model/loanTag';

@Component({
  selector: 'app-crg-alpha-detailed-view',
  templateUrl: './crg-alpha-detailed-view.component.html',
  styleUrls: ['./crg-alpha-detailed-view.component.scss']
})
export class CrgAlphaDetailedViewComponent implements OnInit {

  @Input() formData;
  @Input() loanTag;
  crgAlphaData: any;
  loanTagEnum = LoanTag;

  constructor() { }

  ngOnInit() {
    this.crgAlphaData = JSON.parse(this.formData.data);
  }

}
