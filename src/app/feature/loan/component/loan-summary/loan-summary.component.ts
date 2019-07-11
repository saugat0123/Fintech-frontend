import {Component, OnInit, ViewChild} from '@angular/core';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {User} from '../../../admin/modal/user';
import {Security} from '../../../admin/modal/security';
import {LoanDataHolder} from '../../model/loanData';
import {UserService} from '../../../../@core/service/user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {DmsLoanService} from '../loan-main-template/dms-loan-file/dms-loan-service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {DmsLoanFile} from '../../../admin/modal/dms-loan-file';
import {ActionModel} from '../../model/action';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {ApprovalLimitService} from '../../../admin/component/approvallimit/approval-limit.service';
import {LoanStage} from '../../model/loanStage';
import {AppConstant} from '../../../../@core/utils/appConstant';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-loan-summary',
    templateUrl: './loan-summary.component.html',
    styleUrls: ['./loan-summary.component.scss']
})
export class LoanSummaryComponent implements OnInit {

    client: String;

    dmsLoanFile: DmsLoanFile = new DmsLoanFile();
    loanConfig: LoanConfig = new LoanConfig();
    loan: string;
    index = 0;
    currentIndex: number;
    user: User = new User();
    security: string;
    securities: any = [];
    Security: typeof Security = Security;
    documents: [] = [];
    documentUrls = [];
    documentUrl: string;
    documentNames = [];
    documentName: string;
    document: string;
    documentNamesSplit: string[] = [];
    id: number;
    customerInfo: any;
    loanDataHolder: LoanDataHolder = new LoanDataHolder();
    allId;
    customerId;
    loanConfigId;
    actionsList: ActionModel = new ActionModel();
    showAction = true;
    RootUrl = ApiConfig.URL;
    signatureList = [];
    previousList: Array<LoanStage> = new Array<LoanStage>();
    loanStage: LoanStage = new LoanStage();
    bankName = AppConstant.BANKNAME;
    currentDocAction = '';

    @ViewChild('print') print;


    constructor(private userService: UserService,
                private router: ActivatedRoute,
                private loanFormService: LoanFormService,
                private loanActionService: LoanActionService,
                private dmsLoanService: DmsLoanService,
                private activatedRoute: ActivatedRoute,
                private loanConfigService: LoanConfigService,
                private approvalLimitService: ApprovalLimitService) {

        this.client = environment.client;

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanConfigId: null,
                    customerId: null,
                    catalogue: null
                };
                this.allId = paramsValue;
                this.customerId = this.allId.customerId;
                this.loanConfigId = this.allId.loanConfigId;
                if (this.allId.catalogue) {
                    this.showAction = false;
                }
            });
        this.id = this.router.snapshot.params['id'];
        this.loanConfigService.detail(this.loanConfigId).subscribe(
            (response: any) => {
                this.loanConfig = response.detail;
            }
        );
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
                if (this.user.role.roleType === 'MAKER') {
                    this.actionsList.roleTypeMaker = true;
                } else {
                    this.actionsList.roleTypeMaker = false;
                }
            }
        );
        this.loanFormService.detail(this.customerId).subscribe(
            (response: any) => {
                this.loanDataHolder = response.detail;
                this.currentIndex = this.loanDataHolder.previousList.length;
                this.signatureList = this.loanDataHolder.distinctPreviousList;
                this.previousList = this.loanDataHolder.previousList;
                this.actionsList.approved = true;
                this.actionsList.sendForward = true;
                this.actionsList.edit = true;
                this.actionsList.sendBackward = true;
                this.actionsList.rejected = true;
                this.actionsList.closed = true;
                this.currentDocAction = this.loanDataHolder.currentStage.docAction.toString();
                if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
                    this.actionsList.offerLetter = true;
                } else {
                    this.actionsList.offerLetter = false;
                }
                if (this.loanDataHolder.createdBy.toString() === localStorage.getItem('userId')) {
                    this.actionsList.sendBackward = false;
                    this.actionsList.edit = true;
                    this.actionsList.approved = false;
                } else {
                    this.actionsList.edit = false;
                }

                this.loanActionService.getSendForwardList().subscribe((res: any) => {
                    const forward = res.detail;
                    if (forward.length === 0) {
                        this.actionsList.sendForward = false;
                    }
                });
                if (this.loanDataHolder.currentStage.docAction.toString() === 'APPROVED' ||
                    this.loanDataHolder.currentStage.docAction.toString() === 'REJECT' ||
                    this.loanDataHolder.currentStage.docAction.toString() === 'CLOSED') {
                    this.actionsList.approved = false;
                    this.actionsList.sendForward = false;
                    this.actionsList.edit = false;
                    this.actionsList.sendBackward = false;
                    this.actionsList.rejected = false;
                    this.actionsList.closed = false;
                }
                // commented code is for approval limit
                // this.approvalLimitService.getLimitByRoleAndLoan(this.loanDataHolder.loan.id).subscribe((res: any) => {
                //     if (res.detail === undefined) {
                //         this.actionsList.approved = false;
                //     } else {
                //         if (this.loanDataHolder.dmsLoanFile !== null
                //             && this.loanDataHolder.dmsLoanFile.proposedAmount > res.detail.amount) {
                //             this.actionsList.approved = false;
                //         }
                //     }
                // });
                this.id = this.loanDataHolder.id;
                this.dmsLoanFile = this.loanDataHolder.dmsLoanFile;
                if (this.dmsLoanFile !== undefined && this.dmsLoanFile !== null) {
                    this.security = this.dmsLoanFile.security;
                    this.securities = this.security.split(',');
                    this.documents = JSON.parse(this.dmsLoanFile.documentPath);
                    if (this.documents !== null) {
                        for (this.document of this.documents) {
                            this.documentNamesSplit = this.document.split(':');
                            this.documentNames.push(this.documentNamesSplit[0]);
                            this.documentUrls.push(this.documentNamesSplit[1]);
                        }
                    }
                }

            }
        );

    }

    download(i) {
        this.documentUrl = this.documentUrls[i];
        this.documentName = this.documentNames[i];
        this.dmsLoanService.downloadDocument(this.documentUrl).subscribe(
            (response: any) => {
                const newBlob = new Blob([response], {type: 'application/txt'});
                const downloadUrl = window.URL.createObjectURL(response);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = this.documentName + '.jpg';
                link.click();
            },
            error1 => {
                console.log(error1);
                console.log('Error downloading the file');
            }
        );
    }

    signatureWidth(contentLength: number) {
      if (contentLength >= 4) {
        return 3;
      } else if (contentLength === 3) {
        return 4;
      } else if (contentLength === 2) {
        return 6;
      } else if (contentLength <= 1) {
        return 12;
      }
    }

}

