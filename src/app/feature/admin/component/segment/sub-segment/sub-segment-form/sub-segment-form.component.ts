import {Component, DoCheck, OnInit} from '@angular/core';
import {SubSegment} from '../../../../modal/subSegment';
import {Segment} from '../../../../modal/segment';
import {LoanConfig} from '../../../../modal/loan-config';
import {CommonService} from '../../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../../@core/service/baseservice/common-dataService';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';


@Component({
    selector: 'app-sub-segment-form',
    templateUrl: './sub-segment-form.component.html',
})
export class SubSegmentFormComponent implements OnInit, DoCheck {

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
        private toastService: ToastService
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
            this.loanConfig = this.subSegment.loanConfig[0];
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
        this.commonService.saveOrEdit(this.subSegment, 'v1/subSegment').subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Sub-Segment!'));

                this.subSegment = new SubSegment();

                this.activeModal.close(ModalResponse.SUCCESS);

            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Sub-Segment!'));

                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}
