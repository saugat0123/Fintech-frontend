import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';

@Component({
  selector: "app-above-ten-million",
  templateUrl: "./above-ten-million.component.html",
  styleUrls: ["./above-ten-million.component.scss"],
})
export class AboveTenMillionComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  isUsedForAboveTenMillion: boolean = true;

  constructor() {}

  ngOnInit() {}
}
