import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonDataService} from '../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Pageable} from '../../../shared-service/baseservice/common-pageable';
import {District} from '../../../modal/district';
import {Nepse} from '../../../modal/nepse';

declare var $;
@Component({
  selector: 'app-nepse',
  templateUrl: './nepse.component.html',
  styleUrls: ['./nepse.component.css']
})
export class NepseComponent implements OnInit, DoCheck {

  title = "Nepse";
  breadcrumb = "Nepse > List"
  dataList: any;

  spinner: boolean = false;
  globalMsg;
  search: any = {};
  pageable: Pageable = new Pageable();
  currentApi: any;
  activeCount: any;
  inactiveCount: any;
  nepse: any;

  constructor(
      private dataService: CommonDataService,
      private commonService: CommonService,
      private commonPageService: CommonPageService,
      private router: Router
  ) { }

  ngOnInit() {
    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/nepseCompany/get';
    this.getPagination();
  }
  getPagination() {
    this.spinner = true;
    this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
          this.dataList = response.detail.content;
          this.dataService.setDataList(this.dataList);
          this.commonPageService.setCurrentApi(this.currentApi);
          this.pageable = this.commonPageService.setPageable(response.detail);
          console.log(this.dataList);
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

  ngDoCheck(): void {
    this.dataList = this.dataService.getDataList();
  }
  onSearch() {
    this.dataService.setData(this.search);
    this.getPagination();
  }

  onSearchChange(searchValue: string) {
    this.search = {
      'companyName': searchValue
    }
    this.dataService.setData(this.search);
    this.getPagination();
  }
  addNepse() {
    this.dataService.setNepse(new Nepse());
    $('.add-nepse').modal('show');
  }
}
