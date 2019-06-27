import {Component, OnInit} from '@angular/core';
import {BranchService} from '../branch/branch.service';
import {Branch} from '../../modal/branch';
import {LoanConfig} from '../../modal/loan-config';
import {LoanConfigService} from '../loan-config/loan-config.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';

@Component({
    selector: 'app-catalogue',
    templateUrl: './catalogue.component.html',
    styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    page = 1;
    spinner = false;
    search: any = {
        documentStatus: 'PENDING'
    };
    pageable: Pageable = new Pageable();

    constructor(private branchService: BranchService,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private loanFormService: LoanFormService) {
    }

    ngOnInit() {
        this.loanFormService.getPaginationWithSearchObject(this.search, this.page, 10).subscribe((response: any) => {
            this.loanDataHolderList = response.detail;
            this.pageable = PaginationUtils.getPageable(response.detail);
            this.spinner = false;

        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
            this.spinner = false;
        });
        this.branchService.getAll().subscribe((response: any) => {
            this.branchList = response.detail;
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });
    }

}
