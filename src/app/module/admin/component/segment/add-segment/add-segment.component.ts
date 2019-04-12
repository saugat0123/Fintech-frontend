import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {Segment} from '../../../../../modal/segment';

declare var $;

@Component({
    selector: 'app-add-segment',
    templateUrl: './add-segment.component.html',
    styleUrls: ['./add-segment.component.css']
})
export class AddSegmentComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    spinner: boolean = false;
    globalMsg;
    segment: Segment = new Segment();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        this.segment = this.dataService.getSegment();
        if (this.segment.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.segment, 'v1/segment').subscribe(result => {
                $('.add-segment').modal('hide');
                if (this.segment.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED SEGMENT';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED SEGMENT';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.segment = new Segment();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/segment']));
                this.dataService.alertmsg();


            }, error => {

                $('.add-segment').modal('hide');

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/segment']));
                this.dataService.alertmsg();

            }
        );
    }
}

