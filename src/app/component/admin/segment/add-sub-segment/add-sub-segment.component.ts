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

  task: string;
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  subSegment: SubSegment = new SubSegment();
  segment: Segment = new Segment();
  segmentList: any;
  constructor(
      private commonService: CommonService,
      private router: Router,
      private dataService: CommonDataService
  ) { }

  ngOnInit() {
    this.commonService.getByAll('v1/segment/getList').subscribe((response: any) => {
      this.segmentList = response.detail;
      console.log(this.segmentList);
    });
  }
  ngDoCheck(): void {
    this.subSegment = this.dataService.getSubSegment();
    if (this.subSegment.id == null) {
      this.task = 'Add';
    } else { this.task = 'Edit'; }

  }

  onSubmit() {
    this.submitted = true;
    this.subSegment.segment = this.segment;
    console.log(this.segment);
    console.log(this.subSegment.segment);
    this.commonService.saveOrEdit(this.subSegment, 'v1/subSegment').subscribe(result => {
          /*console.log(this.subSegment);*/
          $('.add-sub-segment').modal('hide');
          if (this.subSegment.id == null) {
            this.globalMsg = "SUCCESSFULLY ADDED BRANCH";
          } else {
            this.globalMsg = "SUCCESSFULLY EDITED BRANCH";
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
}
