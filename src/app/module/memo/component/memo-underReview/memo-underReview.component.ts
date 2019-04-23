import { Component, OnInit } from '@angular/core';
import {CommonDataService} from "../../../../shared-service/baseservice/common-dataService";
import {MemoService} from "../../memo.service";
import {CommonPageService} from "../../../../shared-service/baseservice/common-pagination-service";
import {Pageable} from "../../../../shared-service/baseservice/common-pageable";
import {Memo} from "../../model/memo";
import {Router} from "@angular/router";
declare var $;

@Component({
  selector: 'app-memo-underReview',
  templateUrl: './memo-underReview.component.html',
  styleUrls: ['./memo-underReview.component.css']
})
export class MemoUnderReviewComponent implements OnInit {

  title = "Memo - Under Review";
  dataList: any;
  currentApi: any;

  spinner: boolean = false;
  pageable: Pageable = new Pageable();
  globalMsg;
  search = new Object;

  constructor(
      private dataService: CommonDataService,
      private memoService: MemoService,
      private commonPageService: CommonPageService,
      private router: Router
  ) { }

  ngOnInit() {
    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/memos';
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
    this.memoService.getAll(this.currentApi + "/all", 1, 20, null).subscribe((response: any) => {
          this.dataList = response.detail;
          this.dataService.setDataList(this.dataList);
          this.commonPageService.setCurrentApi(this.currentApi + "/all");
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

  memoById: Memo;
  getMemoById(id: number) {
    this.memoService.getById(this.currentApi, id).subscribe((response: any) => {
      this.memoById = response.detail;
      this.dataService.setMemo(this.memoById);
      this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
          this.router.navigate(["home/memo/read"]));
    });
  }

}
