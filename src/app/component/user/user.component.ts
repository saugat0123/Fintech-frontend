import { Component, OnInit } from '@angular/core';
import { Pageable } from '../../shared-service/baseservice/common-pageable';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';
import { CommonService } from '../../shared-service/baseservice/common-baseservice';
import { CommonPageService } from '../../shared-service/baseservice/common-pagination-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../modal/user'
declare var $;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  title = 'User';
  breadcrumb = 'User > List';
  dataList: any;

  spinner: boolean = false;
  globalMsg;
  search: any = {};
  pageable: Pageable = new Pageable();
  currentApi: any;
  activeCount: any;
  inactiveCount: any;
  user: any;
  newValue: any;
  data: any;
  users: any


  constructor(
    private dataService: CommonDataService,
    private commonService: CommonService,
    private commonPageService: CommonPageService,
    private router: Router,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit() {

    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/user/get';
    this.getPagination()
    this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
      console.log('testing', response);

      this.user = response.detail.user;
    });
    this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

      this.activeCount = response.detail.active;
      this.inactiveCount = response.detail.inactive;
      this.users = response.detail.users;

    });


  }

  onSearch() {
    this.dataService.setData(this.search);
    this.getPagination();
  }

  onSearchChange(searchValue: string) {
      this.search = {
          'name': searchValue
      };
      this.dataService.setData(this.search);
      this.getPagination();
  }


  ngDoCheck(): void {
    this.dataList = this.dataService.getDataList();
  }

  openEdit(user: User) {
    this.dataService.setUser(user);
    $('.add-user').modal('show');
  }

  addUser() {
    this.dataService.setUser(new User());
    $('.add-user').modal('show');
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
        this.globalMsg = 'Please check your network connection';
      }
      this.spinner = false;
      this.dataService.getGlobalMsg(this.globalMsg);
      $('.global-msgModal').modal('show');
    });

  }

  onChange(newValue, data) {
    this.newValue = newValue;
    this.dataService.setUser(data);
    this.commonPageService.setCurrentApi('v1/user');
    $('.updateStatus').modal('show');

  }


    getCsv() {

        this.commonService.saveOrEdit(this.search, 'v1/user/csv').subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = response.detail;
            link.download = response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

        });
    }

}

