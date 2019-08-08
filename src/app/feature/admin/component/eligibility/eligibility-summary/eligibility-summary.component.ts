import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NewRequestService} from '../new-requests/new-request.service';
import {Applicant} from '../../../modal/applicant';
import {environment} from '../../../../../../environments/environment';
import {DateService} from '../../../../../@core/service/baseservice/date.service';

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

    constructor(
        private activatedRoute: ActivatedRoute,
        private applicantService: NewRequestService,
        private dateService: DateService
    ) {
        this.client = environment.client;
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.applicantParam = {applicantId: null};
                this.applicantParam = paramsValue;
                this.applicantId = this.applicantParam.applicantId;
            });

        this.applicantService.detail(this.applicantId).subscribe((response: any) => {
            this.applicant = response.detail;
            console.log(this.applicant);
        });

        this.dateService.getCurrentDateInNepali().subscribe((response: any) => {
            this.currentNepDate = response.detail.nepDateFormat;
        });
    }

}
