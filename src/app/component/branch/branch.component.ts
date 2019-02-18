import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';
import { Pageable } from '../../shared-service/baseservice/common-pageable';
import { CommonService } from '../../shared-service/baseservice/common-baseservice';
import { CommonPageService } from '../../shared-service/baseservice/common-pagination-service';
import { Branch } from '../../modal/branch';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../common/pagination/pagination.component';
declare var $;
@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit, DoCheck {

  title = "Branch";
  breadcrumb = "Branch > List"
  dataList: any;

  spinner: boolean = false;
  globalMsg;
  search = new Object;
  pageable: Pageable = new Pageable();
  currentApi: any;
  activeCount: any;
  inactiveCount: any;
  branches: any;


  constructor(
    private dataService: CommonDataService,
    private commonService: CommonService,
    private commonPageService: CommonPageService,
    private router: Router,

  ) { }

  ngOnInit() {

    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/branch/get';
    this.getPagination();

    this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {
      console.log("testing", response)
      this.activeCount = response.detail.active;
      this.inactiveCount = response.detail.inactive;
      this.branches = response.detail.branches;

    });


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

  ngDoCheck(): void {
    this.dataList = this.dataService.getDataList();
  }

  openEdit(branch: Branch) {
    this.dataService.setBranch(branch);
    $('.add-branch').modal('show');
  }

  addBranch() {
    this.dataService.setBranch(new Branch());
    $('.add-branch').modal('show');
  }

  newValue: any
  data: any

  onChange(newValue, data) {
    this.newValue = newValue
    this.dataService.setBranch(data);
    this.commonPageService.setCurrentApi('v1/branch');
    $('.updateStatus').modal('show');

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
