import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../admin/modal/roleType';

@Component({
    selector: 'app-customer-loan-verify',
    templateUrl: './customer-loan-verify.component.html',
    styleUrls: ['./customer-loan-verify.component.scss']
})
export class CustomerLoanVerifyComponent implements OnInit {

    @Input()
    customerInfo: CustomerInfoData;
    loanDataHolders: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    spinner = false;
    showHideConfirmBtn = false;
    roleType = RoleType.MAKER;

    constructor(private service: LoanFormService, public activeModal: NgbActiveModal,) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerInfo)) {
            this.spinner = true;

            this.service.getInitialLoansByLoanHolderIdForVerification(this.customerInfo.id).subscribe((res: any) => {
                this.loanDataHolders = res.detail;
                const makerList = this.loanDataHolders.filter(l => this.roleType === l.currentStage.toRole.roleType);
                if (makerList.length === this.loanDataHolders.length) {
                    this.showHideConfirmBtn = true;
                }
                this.spinner = false;
            }, error => this.spinner = false);
        } else {
            this.close();
        }
    }

    onClick(id, cId) {
    }

    confirmed() {
        this.activeModal.close(true);
    }

    close() {
        this.activeModal.close(false);
    }

}
