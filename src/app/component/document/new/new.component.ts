import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Detail} from '../../../modal/detail';
import {FormGroup} from '@angular/forms';
import {Document} from '../../../modal/document';

declare var $;
let checkedValue;
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit, DoCheck {



    title = 'Document';
    breadcrumb = 'Document > List';
    dataList: any;
    form: FormGroup;
    spinner = false;
    globalMsg;
    search = new Object();
    pageable: Pageable = new Pageable();
    currentApi: any;
    activeCount: any;
    inactiveCount: any;
    documents: any;
    newValue: any;
    data: any;
    api: any;
    types: any;
    private details: Detail[] = [];

  constructor(
    private dataService: CommonDataService,
    private commonService: CommonService,
    private commonPageService: CommonPageService,
    private router: Router,
    ) { }

  ngOnInit() {
      this.api = 'v1/document/lifeCycle';
      this.commonService.getByAll(this.api).subscribe((response: Detail[])=>{
          /*console.log(response);*/
          this.details = response;
          /*this.types = this.details.map(function (a) {
              return a["cycle"];
          });*/
          /*this.types = this.details[0]*/
          /*this.types = response.detail.types;*/
          console.log(this.details);

      });

  }




getData() {
this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/document/get';
        this.getPagination();

        console.log('new2 is working');
        this.commonService.getByPostAllPageable( this.currentApi, this.search, 1, 10).subscribe((response: any) => {
            console.log('testing', response);

            this.documents = response.detail.documents;
        });
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
ngDoCheck(): void {
  this.dataList = this.dataService.getDataList();
}
openEdit(document: Document) {
  this.dataService.setDocument(document);
  $('.type-document').modal('show');
}
onSubmit() {
    checkedValue = $('.messageCheckbox:checked').val();
    console.log('checkedValue');
}

}
