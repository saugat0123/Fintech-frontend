import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../../shared-service/baseservice/common-baseservice';
import { LoanCycle } from '../../../../modal/loan-cycle';

@Component({
  selector: 'app-update-document',
  templateUrl: './update-document.component.html',
  styleUrls: ['./update-document.component.css']
})
export class UpdateDocumentComponent implements OnInit {

  @Input() public cycle;
  title:string;
  documentList: any;
  loanCycle:LoanCycle = new LoanCycle();
  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.loanCycle = this.cycle;
    this.title = this.loanCycle.cycle;
    this.loanCycle.level = "";
    this.documentsNotContaining(this.loanCycle);
  }
  documentsNotContaining(loanCycle:LoanCycle){
    this.commonService.getByPost("v1/document/list",loanCycle).subscribe((response: any) => {
      this.documentList = response.detail;
    })
  }

}
