import { Component, OnInit, DoCheck } from '@angular/core';
import { Pageable } from '../../shared-service/baseservice/common-pageable';
import { ActivatedRoute } from '@angular/router';
import { CommonPageService } from '../../shared-service/baseservice/common-pagination-service';
import { CommonService } from '../../shared-service/baseservice/common-baseservice';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements DoCheck {
 spinner=false;
 search=new Object;
 dataList:any
pageable:Pageable = new Pageable();
currentAPI:any;
  constructor(
    private dataService: CommonDataService,
    private commonPageService:CommonPageService,private commonService:CommonService) { }


  ngDoCheck(): void {
    this.pageable = this.commonPageService.getPageable();
    this.currentAPI =this.commonPageService.getCurrentApi();

  }

  loadPage(pageNumber: number) {
this.spinner = true;
    this.commonService.getByPostAllPageable(this.currentAPI,this.search, +pageNumber - 1, 10).subscribe((response: any) => {
      this.dataList = response.detail.content;
      this.dataService.setDataList(this.dataList);
      this.pageable = this.commonPageService.setPageable(response.detail);
        console.log(this.pageable)
      this.spinner = false;
    }, error => {
      this.spinner = false;
      console.error(error);
    }
    );
  }

}
