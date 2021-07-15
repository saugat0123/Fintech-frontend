import {Component, OnInit} from '@angular/core';
import {NewRequestService} from './new-request.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Applicant} from '../../../modal/applicant';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EligibilityDocumentViewComponent} from '../eligibility-document-view/eligibility-document-view.component';
import {SubmissionDocument} from '../../../modal/submission-document';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Branch} from '../../../modal/branch';
import {LoanConfig} from '../../../modal/loan-config';
import {BranchService} from '../../branch/branch.service';
import {LoanConfigService} from '../../loan-config/loan-config.service';
import {Router} from '@angular/router';
import {Status} from '../../../modal/eligibility';
import {EligibilityLoanConfigService} from "../eligibility-loan-config/eligibility-loan-config-service";
import {EligibilityLoanConfiguration} from "../eligibility-loan-config/EligibilityLoanConfiguration";

@Component({
    selector: 'app-new-requests',
    templateUrl: './new-requests.component.html',
    styleUrls: ['./new-requests.component.css']
})
export class NewRequestsComponent implements OnInit {
    spinner = false;
    validStartDate = true;
    validEndDate = true;
    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    applicantList: Array<Applicant> = new Array<Applicant>();
    filterForm: FormGroup;
    isFilterCollapsed = true;
    loanType: boolean=false;
    page = 1;
    search: any = {
        branchIds: undefined,
        loanConfigId: undefined,
        dateFilter: undefined,
        eligibilityStatus: `${Status.ELIGIBLE},${Status.NOT_ELIGIBLE},${Status.NEW_REQUEST}`
    };
    pageable: Pageable = new Pageable();

    constructor(private newRequestService: NewRequestService,
                private toastService: ToastService,
                private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private router: Router,
                private branchService: BranchService,
                private loanConfigService: LoanConfigService) {
    }

    static loadData(other: NewRequestsComponent) {
        other.spinner = true;
        other.newRequestService.getAllWithSearchObject(other.page, 10, other.search).subscribe((response: any) => {
                other.applicantList = response.detail.content;
                other.pageable = PaginationUtils.getPageable(response.detail);

                other.spinner = false;
            }, error => {

                console.log(error);

                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.buildSearchForm();
        this.branchService.getAll().subscribe((response: any) => {
            this.branchList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });

        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });




        NewRequestsComponent.loadData(this);
    }

    buildSearchForm() {
        this.filterForm = this.formBuilder.group({
            branch: [undefined],
            loanType: [undefined],
            startDate: [undefined],
            endDate: [undefined]
        });
    }

    filterSearch() {
        if (this.filterForm.get('startDate').value !== null && this.filterForm.get('endDate').value) {
            this.search.dateFilter = JSON.stringify({
                // note: new Date().toString() is needed here to preserve timezone while JSON.stringify()
                'startDate': new Date(this.filterForm.get('startDate').value).toLocaleDateString(),
                'endDate': new Date(this.filterForm.get('endDate').value).toLocaleDateString()
            });
        }
        this.search.branchIds = this.filterForm.get('branch').value === null ? undefined :
            this.filterForm.get('branch').value;
        this.search.loanConfigId = this.filterForm.get('loanType').value === null ? undefined :
            this.filterForm.get('loanType').value;
        console.log(this.filterForm.value, 'New Test');
        NewRequestsComponent.loadData(this);
    }

    checkIfDateFiltration() {
        this.validStartDate = this.filterForm.get('startDate').valid;
        this.validEndDate = this.filterForm.get('endDate').valid;
    }

    clearSearch() {
        this.buildSearchForm();
        this.search.dateFilter = undefined;
    }

    changePage(page: number) {
        this.page = page;

        NewRequestsComponent.loadData(this);
    }

    viewDocument(document: SubmissionDocument) {

        const modalRef = this.modalService.open(EligibilityDocumentViewComponent, {size: 'lg'});
        modalRef.componentInstance.model = document;
        ModalUtils.resolve(modalRef.result, NewRequestsComponent.loadData, this);
    }

    onApplicantClick(applicantId) {
        this.spinner = true;
        this.router.navigate(['/home/admin/eligibility/eligibility-summary'], {queryParams: {applicantId: applicantId}});
    }

}
