import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MicroBorrowerFinancial} from '../../../loan/model/micro-borrower-financial';

@Component({
  selector: 'app-borrower-financial',
  templateUrl: './borrower-financial.component.html',
  styleUrls: ['./borrower-financial.component.scss']
})
export class BorrowerFinancialComponent implements OnInit {
  @Input() fromProfile;
  @Input() microBorrowerFinancial: MicroBorrowerFinancial;
  @Output() dataEmitter = new EventEmitter();
  dataForEdit;

  constructor() { }

  ngOnInit() {
  }

  submit() {
    const m = new MicroBorrowerFinancial();
    m.data = 'amulye bro don';
    this.dataEmitter.emit(m);
  }

}
