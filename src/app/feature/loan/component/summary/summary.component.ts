import {Component, OnInit, ViewChild} from '@angular/core';
import {DmsLoanFile} from '../../../admin/modal/dms-loan-file';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {User} from '../../../admin/modal/user';
import {Security} from '../../../admin/modal/security';
import {LoanDataHolder} from '../../model/loanData';
import {ActionModel} from '../../model/action';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {LoanStage} from '../../model/loanStage';
import {UserService} from '../../../../@core/service/user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {DmsLoanService} from '../loan-main-template/dms-loan-file/dms-loan-service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {ApprovalLimitService} from '../../../admin/component/approvallimit/approval-limit.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

    constructor(private userService: UserService,
                private router: ActivatedRoute,
                private loanFormService: LoanFormService,
                private loanActionService: LoanActionService,
                private dmsLoanService: DmsLoanService,
                private activatedRoute: ActivatedRoute,
                private loanConfigService: LoanConfigService,
                private approvalLimitService: ApprovalLimitService) {

    }

    ngOnInit() {

    }
}
