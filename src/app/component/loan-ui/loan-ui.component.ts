import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonService } from '../../shared-service/baseservice/common-baseservice';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';

@Component({
  selector: 'app-loan-ui',
  templateUrl: './loan-ui.component.html',
  styleUrls: ['./loan-ui.component.css']
})
export class LoanUiComponent implements OnInit, DoCheck {
  title;
  templateList: any;
  tempId: any;
  constructor(
    private dataService: CommonDataService,
    private commonService: CommonService,
  ) { }

  ngDoCheck(): void {


  }

  ngOnInit() {

    /*this.tempId = this.dataService.getData();
    if (this.tempId == undefined) { } else {
      this.commonService.getById('v1/config/get/' + this.tempId).subscribe((response: any) => {
        this.templateList = response.detail.templateList;
        this.title = response.detail.name;
        this.dataService.changeTitle(this.title);
      });*/

    }
 /* }*/

}
