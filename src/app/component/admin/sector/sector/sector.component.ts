import { Component, OnInit } from '@angular/core';
import { Pageable } from '../../../../shared-service/baseservice/common-pageable';
import { CommonDataService } from '../../../../shared-service/baseservice/common-dataService';
import { CommonService } from '../../../../shared-service/baseservice/common-baseservice';
import { CommonPageService } from '../../../../shared-service/baseservice/common-pagination-service';
import { Sector } from '../../../../modal/sector';
declare var $;
@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})
export class SectorComponent implements OnInit {

  title = "Sector";
  breadcrumb = "Sector > List"
  dataList: any;
  newValue: any;
  spinner: boolean = false;
  globalMsg;
  search: any = {};
  pageable: Pageable = new Pageable();
  currentApi: any;
  activeCount: any;
  inactiveCount: any;
  sectors: any;


  constructor(private dataService: CommonDataService,
    private commonService: CommonService,
    private commonPageService: CommonPageService) { }

  ngOnInit() {
    this.dataService.changeTitle(this.title);
    this.currentApi = 'v1/sector/get';
    this.getPagination();

    this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

      this.activeCount = response.detail.active;
      this.inactiveCount = response.detail.inactive;
      this.sectors = response.detail.sectors;
    });
  }
  getPagination(){
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
  addSector(){
    this.dataService.setSector(new Sector());
    $('.add-sector').modal('show');
  }

  onChange(newValue, data) {
    this.newValue = newValue
    this.dataService.setData(data);
    this.commonPageService.setCurrentApi('v1/sector');
    $('.updateStatus').modal('show');

  }
  openEdit(sector: Sector){
    this.dataService.setSector(sector);
    $('.add-sector').modal('show');
  }
  onSearchChange(searchValue: string){
    this.search = {
      'name': searchValue
    }
    this.dataService.setData(this.search);
    this.getPagination();
  }
  onSearch(){
    this.dataService.setData(this.search);
    this.getPagination();
  }
  ngDoCheck(): void {
    this.dataList = this.dataService.getDataList();
  }
}
