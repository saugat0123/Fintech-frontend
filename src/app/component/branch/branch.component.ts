import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';
import { Pageable } from '../../shared-service/baseservice/common-pageable';
import { CommonService } from '../../shared-service/baseservice/common-baseservice';
import { CommonPageService } from '../../shared-service/baseservice/common-pagination-service';
import { Branch } from '../../modal/branch';
declare var $;
@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit,DoCheck {
  
  title = "Branch";
  breadcrumb ="Branch > List"
  dataList: any;
  spinner: boolean = false;
  globalMsg;
  search =new Object;
  pageable: Pageable = new Pageable();
  currentApi:any;
  
  constructor(
    private dataService: CommonDataService,
    private commonService:CommonService,
    private commonPageService:CommonPageService
  ) { }

  ngOnInit() {
    console.log("branch component")
    this.dataService.changeTitle(this.title);
    this.currentApi='v1/branch/get';
    this.spinner = true;
    this.commonService.getByPostAllPageable(this.currentApi,this.search, 0, 10).subscribe((response: any) => {
      this.dataList = response.detail.content;
      this.dataService.setDataList(this.dataList);
      this.commonPageService.setCurrentApi(this.currentApi);
      this.pageable = this.commonPageService.setPageable(response.detail);
      this.spinner =false;
      
    }, error => {
      this.globalMsg = error.error.message;
      if(this.globalMsg==null){
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

  openEdit(branch:Branch){
  this.dataService.setBranch(branch);
    $('.add-branch').modal('show');
  }

  addBranch(){
    this.dataService.setBranch(new Branch());
    $('.add-branch').modal('show');
  }
  
}
