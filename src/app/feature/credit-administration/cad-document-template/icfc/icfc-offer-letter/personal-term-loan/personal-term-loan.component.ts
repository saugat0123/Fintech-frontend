import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-personal-term-loan',
  templateUrl: './personal-term-loan.component.html',
  styleUrls: ['./personal-term-loan.component.scss']
})
export class PersonalTermLoanComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  personalTermLoan: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
