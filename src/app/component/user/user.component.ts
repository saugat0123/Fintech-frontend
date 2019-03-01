import { Component, OnInit } from '@angular/core';
import {Pageable} from '../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Document} from '../../modal/document';
import { HttpClient } from '@angular/common/http';
declare var $;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  title = 'User';
  breadcrumb = 'Document > List';
  dataList: any;

  spinner: boolean = false;
  globalMsg;
  search = new Object();
  pageable: Pageable = new Pageable();
  currentApi: any;
  activeCount: any;
  inactiveCount: any;
  documents: any;
  newValue: any;
  data: any;


  constructor(
      private dataService: CommonDataService,
      private commonService: CommonService,
      private commonPageService: CommonPageService,
      private router: Router,
      private httpClient: HttpClient,
  ) {
  }

  ngOnInit() {

    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/document/get';
    this.getPagination()

    console.log("test document")
    this.commonService.getByPostAllPageable( this.currentApi, this.search, 1, 10).subscribe((response: any) => {
      console.log('testing', response);

      this.documents = response.detail.documents;
    });


  }

  onSearch() {
    this.dataService.setData(this.search);
    this.getPagination();
  }

  /*onSearchChange(searchValue: string) {
      this.search = {
          'name': searchValue
      };
      this.dataService.setData(this.search);
      this.getPagination();
  }*/


  ngDoCheck(): void {
    this.dataList = this.dataService.getDataList();
  }

  openEdit(document: Document) {
    this.dataService.setDocument(document);
    $('.add-document').modal('show');
  }

  addDocument() {
    this.dataService.setDocument(new Document());
    $('.add-document').modal('show');
  }

  onChange(newValue, data) {
    this.newValue = newValue;
    this.dataService.setDocument(data);
    this.commonPageService.setCurrentApi('v1/document/add');
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
        this.globalMsg = 'Please check your network connection';
      }
      this.spinner = false;
      this.dataService.getGlobalMsg(this.globalMsg);
      $('.global-msgModal').modal('show');
    });

  }

}

