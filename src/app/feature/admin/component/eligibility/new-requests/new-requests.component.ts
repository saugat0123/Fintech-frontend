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

@Component({
    selector: 'app-new-requests',
    templateUrl: './new-requests.component.html',
    styleUrls: ['./new-requests.component.css']
})
export class NewRequestsComponent implements OnInit {
    spinner = false;
    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    applicantList: Array<Applicant> = new Array<Applicant>();
    filterForm: FormGroup;

    page = 1;
    searchString: string = NewRequestService.resolveSearchString(null, null, null);
    pageable: Pageable = new Pageable();

    constructor(private newRequestService: NewRequestService,
                private toastService: ToastService,
                private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private branchService: BranchService,
                private loanConfigService: LoanConfigService) {
    }

    static loadData(other: NewRequestsComponent) {

        other.spinner = true;
        other.newRequestService.getAllWithSearchObject(other.page, 10, other.searchString).subscribe((response: any) => {
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
        });
    }

    filterSearch() {
        const branchId: number = this.filterForm.get('branch').value === null ? undefined :
            this.filterForm.get('branch').value;
        const loanConfigId: number = this.filterForm.get('loanType').value === null ? undefined :
            this.filterForm.get('loanType').value;
        this.searchString = NewRequestService.resolveSearchString(null, branchId, loanConfigId);
        NewRequestsComponent.loadData(this);
    }

    clearSearch() {
        this.buildSearchForm();
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

}
