import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {SubSegment} from '../../../modal/subSegment';
import {Segment} from '../../../modal/segment';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {LoanConfig} from '../../../modal/loan-config';


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
    loanTypeList: Array<LoanConfig>;
    loanConfig: LoanConfig = new LoanConfig();
    loanConfigs: Array<LoanConfig> = new Array<LoanConfig>();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal

    ) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/segment/getList').subscribe((response: any) => {
            this.segmentList = response.detail;

        });
        this.commonService.getByAll('v1/config/getAll').subscribe((response: any) => {
            this.loanTypeList = response.detail;

        });
    }

    ngDoCheck(): void {
        this.subSegment = this.dataService.getSubSegment();
        if (this.subSegment.id == null) {
            this.task = 'Add';
            this.segment = new Segment();
            this.loanConfigs = new Array<LoanConfig>();
        } else {
            this.segment = this.subSegment.segment;
            this.loanConfig = this.subSegment.loanConfig[0]
            console.log(this.loanConfig);
            this.task = 'Edit';
        }

    }

    setSegment() {
        this.subSegment.segment = this.segment;
    }

    setLoan() {
        this.subSegment.loanConfig = [this.loanConfig];
    }

    onSubmit() {
        this.submitted = true;
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


            }, error => {

                this.modalService.dismissAll(AddSubSegmentComponent);
                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/sub-segment']));

            }
        );
    }

    onClose() {
        this.activeModal.dismiss(AddSubSegmentComponent);
    }
}
