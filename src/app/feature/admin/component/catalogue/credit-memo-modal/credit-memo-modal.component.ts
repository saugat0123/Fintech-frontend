import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CreditMemo} from '../../../../credit-memo/model/credit-memo';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CreditMemoFullRoutes} from '../../../../credit-memo/credit-memo-full-routes';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-credit-memo-modal',
    templateUrl: './credit-memo-modal.component.html',
    styleUrls: ['./credit-memo-modal.component.scss']
})
export class CreditMemoModalComponent {
    @Input()
    creditMemoList: Array<CreditMemo>;

    @Input()
    customerLoan: LoanDataHolder;

    spinner = false;

    // currentRole = localStorage.getItem('roleType');
    currentRole = LocalStorageUtil.getStorage().roleType;


    constructor(private activeModalService: NgbActiveModal,
                private router: Router) {
    }

    onViewMemo(id: number) {
        this.spinner = true;
        this.router.navigate([`${CreditMemoFullRoutes.READ}/${id}`]).then(() => {
            this.activeModalService.close();
        });
    }

    onRaiseMemo() {
        this.spinner = true;
        this.router.navigate([`${CreditMemoFullRoutes.COMPOSE}`],
            {queryParams: {loanCategoryId: this.customerLoan.loan.id, loanId: this.customerLoan.id, customerInfoId: this.customerLoan.loanHolder.id}})
            .then(() => {
                this.activeModalService.close();
            });
    }

    onClose() {
        this.activeModalService.dismiss();
    }
}
