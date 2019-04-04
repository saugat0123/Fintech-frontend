import {Component, DoCheck, OnInit} from '@angular/core';
import {SubSegment} from '../../../../modal/subSegment';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Segment} from '../../../../modal/segment';

declare var $;
@Component({
  selector: 'app-sub-segment',
  templateUrl: './sub-segment.component.html',
  styleUrls: ['./sub-segment.component.css']
})
export class SubSegmentComponent implements OnInit, DoCheck {

  title = "Sub-Segment";
  breadcrumb = "Sub-Segment > List"
  dataList: any;

  spinner: boolean = false;
  globalMsg;
  search: any = {};
  pageable: Pageable = new Pageable();
  currentApi: any;
  activeCount: any;
  inactiveCount: any;
  subSegment: any;
  segment: Segment = new Segment();

  constructor(
      private dataService: CommonDataService,
      private commonService: CommonService,
      private commonPageService: CommonPageService,
      private router: Router
  ) { }
  ngOnInit() {
    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/subSegment/get';
    this.getPagination();
  }
  ngDoCheck(): void {
    this.dataList = this.dataService.getDataList();
  }
  addSubSegment(){
    this.dataService.setSubSegment(new SubSegment())
    $('.add-sub-segment').modal('show');
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
  openEdit(subSegment: SubSegment, segment: Segment) {
    this.dataService.setSubSegment(subSegment);
    this.dataService.setSegment(segment);
    this.segment = this.dataService.getSegment();

    console.log(this.segment.segmentName);
    $('.add-sub-segment').modal('show');
  }
}
