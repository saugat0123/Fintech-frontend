import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {SubSegment} from '../../../../modal/subSegment';
import {Segment} from '../../../../modal/segment';

declare var $;
@Component({
  selector: 'app-add-sub-segment',
  templateUrl: './add-sub-segment.component.html',
  styleUrls: ['./add-sub-segment.component.css']
})
export class AddSubSegmentComponent implements OnInit, DoCheck {

    checkBoxValue: any = false;
  task: string;
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  subSegment: SubSegment = new SubSegment();
  segment: Segment = new Segment();
  segmentList: any;
  isActive: boolean;
  constructor(
      private commonService: CommonService,
      private router: Router,
      private dataService: CommonDataService
  ) { }

  ngOnInit() {
    this.commonService.getByAll('v1/segment/getList').subscribe((response: any) => {
      this.segmentList = response.detail;
      console.log(this.segmentList);
      this.segment= this.dataService.getSegment();
      console.log(this.segment);

    });
  }
  ngDoCheck(): void {
    this.subSegment = this.dataService.getSubSegment();
    console.log(this.subSegment)
    if (this.subSegment.id == null) {
        this.segment = new Segment();
      this.task = 'Add';
    } else {
        if(this.subSegment.segment != null){
            this.checkBoxValue = this.subSegment.funded;
            this.segment = this.subSegment.segment;
        }
        this.task = 'Edit'; }

  }

  onSubmit() {
    this.submitted = true;
    this.subSegment.segment = this.segment;
      this.subSegment.funded = this.checkBoxValue;
    console.log(this.segment);
    console.log(this.subSegment.segment);
    this.commonService.saveOrEdit(this.subSegment, 'v1/subSegment').subscribe(result => {
          console.log(this.subSegment);
          $('.add-sub-segment').modal('hide');
          if (this.subSegment.id == null) {
            this.globalMsg = "SUCCESSFULLY ADDED SUB SEGMENT";
          } else {
            this.globalMsg = "SUCCESSFULLY EDITED SUB SEGMENT";
          }

          this.dataService.getGlobalMsg(this.globalMsg);
          this.dataService.getAlertMsg('true');
          this.subSegment = new SubSegment();
          this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
              this.router.navigate(['home/sub-segment']));
          $('.alert-custom').slideDown();



        }, error => {

          $('.add-sub-segment').modal('hide');

          this.globalMsg = error.error.message;
          this.dataService.getGlobalMsg(this.globalMsg);
          this.dataService.getAlertMsg('false');

          this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
              this.router.navigate(["home/sub-segment"]));
          $(".alert-custom").slideDown();

        }
    );
  }
    checkCheckBoxvalue(){
        this.subSegment.funded = this.checkBoxValue;
        console.log(this.subSegment.funded)
    }
}
