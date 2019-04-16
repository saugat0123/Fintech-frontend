import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {SubSegment} from '../../../modal/subSegment';
import {Segment} from '../../../modal/segment';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-sub-segment',
    templateUrl: './add-sub-segment.component.html',
    styleUrls: ['./add-sub-segment.component.css']
})
export class AddSubSegmentComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    subSegment: SubSegment = new SubSegment();
    segment: Segment = new Segment();
    segmentList: Array<Segment>;

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal:NgbActiveModal,
        private modalService:NgbModal

    ) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/segment/getList').subscribe((response: any) => {
            this.segmentList = response.detail;

        });
    }

    ngDoCheck(): void {
        this.subSegment = this.dataService.getSubSegment();
        if (this.subSegment.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
            if (this.subSegment.segment != null) {
                this.segment = this.subSegment.segment;
            } else {
                this.segment = new Segment();
            }
        }

    }

    onSubmit() {
        this.submitted = true;
        this.subSegment.segment = this.segment;
        this.commonService.saveOrEdit(this.subSegment, 'v1/subSegment').subscribe(result => {
            this.modalService.dismissAll(AddSubSegmentComponent);
                if (this.subSegment.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED SUB SEGMENT';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED SUB SEGMENT';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.subSegment = new SubSegment();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/sub-segment']));
                this.dataService.alertmsg();


            }, error => {

            this.modalService.dismissAll(AddSubSegmentComponent);

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/sub-segment']));
                this.dataService.alertmsg();

            }
        );
    }
    onClose() {
        this.activeModal.dismiss(AddSubSegmentComponent);
    }
}
