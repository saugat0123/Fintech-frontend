import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NewRequestService} from '../new-requests/new-request.service';
import {Applicant} from '../../../modal/applicant';
import {environment} from '../../../../../../environments/environment';
import {DateService} from '../../../../../@core/service/baseservice/date.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {ApplicantService} from './applicant.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Status} from '../../../modal/eligibility';
import {UpdateModalComponent} from '../../../../../@theme/components';

@Component({
    selector: 'app-eligibility-summary',
    templateUrl: './eligibility-summary.component.html',
    styleUrls: ['./eligibility-summary.component.scss']
})
export class EligibilitySummaryComponent implements OnInit {
    client: string;
    applicantParam;
    applicantId: number;
    applicant: Applicant = new Applicant();
    currentNepDate: string;
    currentDate = new Date();
    loading = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private requestService: NewRequestService,
        private applicantService: ApplicantService,
        private dateService: DateService,
        private modalService: NgbModal,
        private toastService: ToastService
    ) {
        this.client = environment.client;
    }

    ngOnInit() {
        this.loading = true;
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.applicantParam = {applicantId: null};
                this.applicantParam = paramsValue;
                this.applicantId = this.applicantParam.applicantId;
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                this.loading = false;
            });

        this.requestService.detail(this.applicantId).subscribe((response: any) => {
            this.applicant = response.detail;
            this.loading = false;
        });

        this.dateService.getCurrentDateInNepali().subscribe((response: any) => {
            this.currentNepDate = response.detail.nepDateFormat;
        });
    }

    print() {
        window.print();
    }

    onApproveOrReject(status) {
        if (status === Status.APPROVED) {
            this.applicant.eligibilityStatus = Status.APPROVED;
        } else {
            this.applicant.eligibilityStatus = Status.REJECTED;
        }
        console.log(this.applicant);
        const modalRef = this.modalService.open(UpdateModalComponent, {size: 'lg'});
        modalRef.componentInstance.data = this.applicant;
        modalRef.componentInstance.service = this.applicantService;
    }
}
