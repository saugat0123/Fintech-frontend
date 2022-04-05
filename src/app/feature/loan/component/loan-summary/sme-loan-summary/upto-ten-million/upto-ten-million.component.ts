import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';

@Component({
  selector: 'app-upto-ten-million',
  templateUrl: './upto-ten-million.component.html',
  styleUrls: ['./upto-ten-million.component.scss']
})
export class UptoTenMillionComponent implements OnInit {
  @Input() loanData;
  loanDataHolder: LoanDataHolder;
  constructor() { }

  ngOnInit() {
  }

}
