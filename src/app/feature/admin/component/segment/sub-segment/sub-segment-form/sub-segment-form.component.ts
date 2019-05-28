import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {SubSegment} from '../../../../modal/subSegment';
import {Segment} from '../../../../modal/segment';
import {LoanConfig} from '../../../../modal/loan-config';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {SegmentService} from '../../segment/segment.service';
import {SubSegmentService} from '../sub-segment.service';
import {LoanConfigService} from '../../../loan-config/loan-config.service';


@Component({
    selector: 'app-sub-segment-form',
    templateUrl: './sub-segment-form.component.html',
})
export class SubSegmentFormComponent implements OnInit, DoCheck {

    @Input()
    model: SubSegment;

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    segment: Segment = new Segment();
    segmentList: Array<Segment>;
    loanTypeList: Array<LoanConfig>;
    loanConfig: LoanConfig = new LoanConfig();
    loanConfigs: Array<LoanConfig> = new Array<LoanConfig>();

    constructor(
        private service: SubSegmentService,
        private segmentService: SegmentService,
        private loanConfigSevice: LoanConfigService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.segmentService.getAll().subscribe((response: any) => {
            this.segmentList = response.detail;

        });
        this.loanConfigSevice.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;

        });
    }

    ngDoCheck(): void {
        if (this.model.id == null) {
            this.task = 'Add';
            this.segment = new Segment();
            this.loanConfigs = new Array<LoanConfig>();
        } else {
            this.segment = this.model.segment;
            this.loanConfig = this.model.loanConfig[0];
            this.task = 'Edit';
        }
    }

    setSegment() {
        this.model.segment = this.segment;
    }

    setLoan() {
        this.model.loanConfig = [this.loanConfig];
    }

    onSubmit() {
        this.submitted = true;
        this.service.save(this.model).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Sub-Segment!'));

                this.model = new SubSegment();

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
