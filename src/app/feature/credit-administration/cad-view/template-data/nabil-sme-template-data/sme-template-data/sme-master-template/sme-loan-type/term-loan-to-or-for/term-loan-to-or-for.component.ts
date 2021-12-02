import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-term-loan-to-or-for',
  templateUrl: './term-loan-to-or-for.component.html',
  styleUrls: ['./term-loan-to-or-for.component.scss']
})
export class TermLoanToOrForComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
