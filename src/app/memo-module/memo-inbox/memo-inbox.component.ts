import { Component, OnInit } from '@angular/core';
import {CommonDataService} from "../../shared-service/baseservice/common-dataService";
import {CommonService} from "../../shared-service/baseservice/common-baseservice";
import {CommonPageService} from "../../shared-service/baseservice/common-pagination-service";
import {Pageable} from "../../shared-service/baseservice/common-pageable";
declare var $;

@Component({
  selector: 'app-memo-inbox',
  templateUrl: './memo-inbox.component.html',
  styleUrls: ['./memo-inbox.component.css']
})
export class MemoInboxComponent implements OnInit {

  title = "Memo - Inbox";
  dataList: any;
  currentApi: any;

  spinner: boolean = false;
  pageable: Pageable = new Pageable();
  globalMsg;
  search = new Object;

  constructor(
      private dataService: CommonDataService,
      private commonService: CommonService,
      private commonPageService: CommonPageService
  ) { }

  ngOnInit() {
    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/branch/get';
    this.getPagination();
  }

  ngDoCheck(): void {
    this.dataList = this.dataService.getDataList();
  }

  onSearch() {
    this.dataService.setData(this.search);
    this.getPagination();
  }

  onSearchChange(searchValue: string) {
    this.search = {
      'name': searchValue
    }
    this.dataService.setData(this.search);
    this.getPagination();
  }

  getPagination() {
    this.spinner = true;
    this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
          this.dataList = response.detail.content;
          this.dataService.setDataList(this.dataList);
          this.commonPageService.setCurrentApi(this.currentApi);
          this.pageable = this.commonPageService.setPageable(response.detail);

          this.spinner = false;

        }, error => {
          this.globalMsg = error.error.message;
          if (this.globalMsg == null) {
            this.globalMsg = "Please check your network connection"
          }
          this.spinner = false;
          this.dataService.getGlobalMsg(this.globalMsg);
          $('.global-msgModal').modal('show');
        }
    );

  }

}
