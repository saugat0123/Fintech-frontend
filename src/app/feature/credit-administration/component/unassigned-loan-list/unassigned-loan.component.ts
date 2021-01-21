import {Component, OnInit} from '@angular/core';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../loan/model/loanType';
import {NbDialogService} from '@nebular/theme';
import {AssignPopUpComponent} from '../assign-pop-up/assign-pop-up.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';

@Component({
    selector: 'app-unassigned-loan',
    templateUrl: './unassigned-loan.component.html',
    styleUrls: ['./unassigned-loan.component.scss']
})
export class UnassignedLoanComponent implements OnInit {
    searchObj = {};
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    loanList = [];
    loanType = LoanType;
    toggleArray: { toggled: boolean }[] = [];

    constructor(private service: CreditAdministrationService,
                private spinnerService: NgxSpinnerService,
                private nbModalService: NbDialogService,
                private modalService: NgbModal) {
    }

    static loadData(other: UnassignedLoanComponent) {
        other.spinnerService.show();
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.searchObj, other.page, 10).subscribe((res: any) => {
            other.loanList = res.detail.content;
            other.pageable = PaginationUtils.getPageable(res.detail);
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
            other.spinnerService.hide();
            other.spinner = false;

        });
    }

    ngOnInit() {
        UnassignedLoanComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        UnassignedLoanComponent.loadData(this);
    }

    openAssignPopUp(data: CustomerApprovedLoanCadDocumentation) {
       const comp = this.modalService.open(AssignPopUpComponent);
       comp.componentInstance.cadData = data;
    }

    setSearchValue(value){
        this.searchObj = value;
        UnassignedLoanComponent.loadData(this);
    }
}
