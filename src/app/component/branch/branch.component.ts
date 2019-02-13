import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';
import { Pageable } from '../../shared-service/baseservice/common-pageable';
import { CommonService } from '../../shared-service/baseservice/common-baseservice';
import { CommonPageService } from '../../shared-service/baseservice/common-pagination-service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  title = "Branch";
  breadcrumb ="Branch > List"
  branchList: any;
  spinner: boolean = false;

  search =new Object;;
  pageable: Pageable = new Pageable();
  constructor(
    private dataService: CommonDataService,
    private commonService:CommonService,
    private commonPageService:CommonPageService
  ) { }

  ngOnInit() {
    this.dataService.changeTitle(this.title);

    this.spinner = true;
    this.commonService.getByPostAllPageable('v1/branch/get',this.search, 0, 10).subscribe((response: any) => {
      this.branchList = response.detail.content;
      this.pageable = this.commonPageService.getPageable(response.detail);
      console.log(this.pageable)
      this.spinner = false;
    }, error => {
      
      console.error(error);
    }
    );


  }

  loadPage(pageNumber: number) {
    this.spinner = true;
    this.commonService.getByPostAllPageable('v1/branch/get',this.search, +pageNumber - 1, 10).subscribe((response: any) => {
      this.branchList = response.detail.content;
      this.pageable = this.commonPageService.getPageable(response.detail);
      console.log(this.pageable)
      this.spinner = false;
    }, error => {
      
      console.error(error);
    }
    );
  }
}
