import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../../../loan/model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {FormBuilder} from '@angular/forms';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';

@Component({
    selector: 'app-exposure',
    templateUrl: './exposure.component.html',
    styleUrls: ['./exposure.component.scss']
})
export class ExposureComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    customerLoanList: Array<LoanDataHolder>;

    constructor(private formBuilder: FormBuilder,
                private routerUtilsService: RouterUtilsService,
                private service: CreditAdministrationService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
        this.customerLoanList = this.cadData.assignedLoan;
    }
    }



}
