import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';

@Component({
  selector: 'app-nrb-statutory-remarks-status',
  templateUrl: './nrb-statutory-remarks-status.component.html',
  styleUrls: ['./nrb-statutory-remarks-status.component.scss']
})
export class NrbStatutoryRemarksStatusComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  commentData;
  constructor() { }

  ngOnInit() {
      const data =  JSON.parse(this.loanDataHolder.loanHolder.data);
      this.commentData = JSON.parse(data.data);
  }

}
