import { Component, OnInit } from '@angular/core';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {Document} from '../../../../admin/modal/document';

@Component({
  selector: 'app-dms-summary',
  templateUrl: './dms-summary.component.html',
  styleUrls: ['./dms-summary.component.css']
})
export class DmsSummaryComponent implements OnInit {
    dmsLoanFile: DmsLoanFile = new DmsLoanFile();
    initialDocument: Document[] = [];
  constructor(private dataService: CommonDataService) { }

  ngOnInit() {
      this.dmsLoanFile = this.dataService.getDmsLoanFile();
      this.initialDocument = this.dataService.getInitialDocument();
  }


}
