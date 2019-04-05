import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataService } from '../../../../../shared-service/baseservice/common-dataService';
import { CommonService } from '../../../../../shared-service/baseservice/common-baseservice';
import { Sector } from '../../../../../modal/sector';
import { SubSector } from '../../../../../modal/sub-sector';

declare var $;
@Component({
  selector: 'app-add-sub-sector',
  templateUrl: './add-sub-sector.component.html',
  styleUrls: ['./add-sub-sector.component.css']
})
export class AddSubSectorComponent implements OnInit, DoCheck {

  task: string;
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  sectorList: any;
  subSector: SubSector = new SubSector();
  sector: Sector = new Sector();
  selectedSector: any ;
  constructor(
    private commonService: CommonService,
    private router: Router,
    private dataService: CommonDataService) { 
    }

  ngOnInit() {
    this.commonService.getByAll("v1/sector/getList").subscribe((response: any) => {
      this.sectorList = response.detail;
    })
  }
  

  ngDoCheck(): void {
    this.subSector = this.dataService.getSubSector();
    if (this.subSector.id == null) {
      this.sector = new Sector();
      this.task = 'Add';
    } else {
      if (this.subSector.sector != null) {
        this.sector = this.subSector.sector;
      };
      this.task = 'Edit'; }

  }

  onSubmit() {
    this.subSector.sector=this.sector;
    this.commonService.saveOrEdit(this.subSector, 'v1/subSector').subscribe(result => {
      $('.add-subSector').modal('hide');
      if (this.subSector.id == null) {
        this.globalMsg = "SUCCESSFULLY ADDED SUB SECTOR";
      } else {
        this.globalMsg = "SUCCESSFULLY EDITED SUB SECTOR";
      }

      this.dataService.getGlobalMsg(this.globalMsg);
      this.dataService.getAlertMsg('true');
      this.subSector = new SubSector();
      this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
        this.router.navigate(["home/subSector"]));
      $(".alert-custom").slideDown();



    }, error => {

      $('.add-subSector').modal('hide');

      this.globalMsg = error.error.message;
      this.dataService.getGlobalMsg(this.globalMsg);
      this.dataService.getAlertMsg('false');

      this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
        this.router.navigate(["home/subSector"]));
      $(".alert-custom").slideDown();

    }
    );
  }

}

