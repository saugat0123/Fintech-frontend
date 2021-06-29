import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Action} from '../../../../../@core/Action';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {LoanConfigFormComponent} from './loan-config-form/loan-config-form.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaginationUtils} from "../../../../../@core/utils/PaginationUtils";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {Pageable} from "../../../../../@core/service/baseservice/common-pageable";
import {LoanConfigDeleteModalComponent} from "./loan-config-delete-modal/loan-config-delete-modal.component";
import {LoanConfigService} from "../../loan-config/loan-config.service";
import {LoanConfig} from "../../../modal/loan-config";

@Component({
    selector: 'app-eligibility-loan-config',
    templateUrl: './eligibility-loan-config.component.html',
    styleUrls: ['./eligibility-loan-config.component.scss']
})
export class EligibilityLoanConfigComponent implements OnInit {
    eligibilityLoanConfig: Array<LoanConfig>;
    page = 1;
    search = {};
    spinner = false;
    pageable: Pageable = new Pageable();


    constructor(private router: Router,
                private modalService: NgbModal,
                private service: LoanConfigService,
                private toastService: ToastService
    ) {
    }

    static loadData(other: EligibilityLoanConfigComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
                console.log(response.detail)
                other.eligibilityLoanConfig = response.detail.content;
                other.pageable = PaginationUtils.getPageable(response.detail);
                other.spinner = false;
            }, error => {

                console.error(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Failed to Load Eligibility Loan'));
                other.spinner = false;

            }
        );
    }


    ngOnInit() {
        EligibilityLoanConfigComponent.loadData(this);

    }


    add() {
        const modalRef = this.modalService.open(LoanConfigFormComponent, {backdrop: 'static', size: 'lg'});
        modalRef.componentInstance.action = Action.ADD;
        modalRef.componentInstance.model = new LoanConfig();
        ModalUtils.resolve(modalRef.result, EligibilityLoanConfigComponent.loadData, this);
    }

    update(loanId: number, loanConfig: LoanConfig) {
        const modalRef = this.modalService.open(LoanConfigFormComponent, {backdrop: 'static', size: 'lg'});
        modalRef.componentInstance.action = Action.UPDATE;
        modalRef.componentInstance.loanId = loanId;
        modalRef.componentInstance.model = loanConfig;
        ModalUtils.resolve(modalRef.result, EligibilityLoanConfigComponent.loadData, this);
    }

    delete(loanConfig: LoanConfig) {
        const modalRef = this.modalService.open(LoanConfigDeleteModalComponent, {backdrop: 'static', size: 'lg'});
        modalRef.componentInstance.model = loanConfig;
        modalRef.componentInstance.action = Action.DELETE;
        ModalUtils.resolve(modalRef.result, EligibilityLoanConfigComponent.loadData, this);
    }

    changePage(page: number) {
        this.page = page;
        EligibilityLoanConfigComponent.loadData(this);
    }


}
