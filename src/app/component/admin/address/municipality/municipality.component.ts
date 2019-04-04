import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {MunicipalityVDC} from '../../../../modal/municipality_VDC';

declare var $;
@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.css']
})
export class MunicipalityComponent implements OnInit, DoCheck {

  title = "Municipality";
  breadcrumb = "Municipality > List"
  dataList: any;

  spinner: boolean = false;
  globalMsg;
  search: any = {};
  pageable: Pageable = new Pageable();
  currentApi: any;
  activeCount: any;
  inactiveCount: any;
  municipality: any;

  constructor(
      private dataService: CommonDataService,
      private commonService: CommonService,
      private commonPageService: CommonPageService,
      private router: Router
  ) { }

  ngOnInit() {
    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/address/getMunicipalityVdc';
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
      'name': searchValue
    }
    this.dataService.setData(this.search);
    this.getPagination();
  }
  addMunicipality() {
    this.dataService.setMunicipality(new MunicipalityVDC());
    $('.add-municipality').modal('show');
  }
}
