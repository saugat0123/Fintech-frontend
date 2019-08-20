import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NewRequestService} from '../new-requests/new-request.service';
import {Applicant} from '../../../modal/applicant';
import {environment} from '../../../../../../environments/environment';
import {DateService} from '../../../../../@core/service/baseservice/date.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {ApplicantService} from './applicant.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Status} from '../../../modal/eligibility';

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
    showApproveAndRejectButton = true;
    loading = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private requestService: NewRequestService,
        private applicantService: ApplicantService,
        private dateService: DateService,
        private modalService: NgbModal,
        private toastService: ToastService,
        private router: Router
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
            this.applicant.eligibilityStatus === 'ELIGIBLE' || this.applicant.eligibilityStatus === 'NOT_ELIGIBLE'
                ? this.showApproveAndRejectButton = true : this.showApproveAndRejectButton = false;
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
        this.loading = true;
        if (status === Status.APPROVED) {
            this.applicant.eligibilityStatus = Status.APPROVED;
        } else {
            this.applicant.eligibilityStatus = Status.REJECTED;
        }
        this.applicantService.update(this.applicant).subscribe( () => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated Eligibility Status !'));
            this.router.navigate(['/home/admin/eligibility/new-requests']);
        }, errorResponse => {
            console.log(errorResponse.error.message);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to update Eligibility Status !'));
            this.loading = false;
        });
    }
}
