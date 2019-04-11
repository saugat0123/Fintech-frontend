import { Component, DoCheck, OnInit } from '@angular/core';
import { Pageable } from '../../../../shared-service/baseservice/common-pageable';
import { CommonDataService } from '../../../../shared-service/baseservice/common-dataService';
import { CommonService } from '../../../../shared-service/baseservice/common-baseservice';
import { CommonPageService } from '../../../../shared-service/baseservice/common-pagination-service';
import { Router } from '@angular/router';
import { Nepse } from '../../../../modal/nepse';
import { Company } from '../../../../modal/company';
import { User } from '../../../../modal/user';

declare var $;
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, DoCheck {

  title = "Company";
  breadcrumb = "Company > List"
  dataList: any;
  newValue: any;

  spinner: boolean = false;
  globalMsg;
  search: any = {};
  pageable: Pageable = new Pageable();
  currentApi: any;
  activeCount: any;
  inactiveCount: any;
  company: any;
  companys: any;

  constructor(
    private dataService: CommonDataService,
    private commonService: CommonService,
    private commonPageService: CommonPageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/company/get';
    this.getPagination();
    this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

      this.activeCount = response.detail.active;
      this.inactiveCount = response.detail.inactive;
      this.companys = response.detail.companys;

    });
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
      'name': searchValue
    }
    this.dataService.setData(this.search);
    this.getPagination();
  }
  onChange(newValue, data) {
    this.newValue = newValue;
    this.dataService.setCompany(data);
    this.commonPageService.setCurrentApi('v1/company');
    $('.updateStatus').modal('show');

  }
  addCompany() {
    this.dataService.setCompany(new Company());
    $('.add-company').modal('show');
  }
  openEdit(company: Company) {
    this.dataService.setCompany(company);
    $('.add-company').modal('show');
  }

}
