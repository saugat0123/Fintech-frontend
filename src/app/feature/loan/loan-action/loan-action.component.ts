import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanActionService} from './service/loan-action.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../@core/utils';
import {AlertService} from '../../../@theme/components/alert/alert.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {User} from '../../admin/modal/user';
import {UserService} from '../../admin/component/user/user.service';
import {ActionModel} from '../model/action';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {DocStatus} from '../model/docStatus';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../../admin/modal/loan-config';
import {RoleType} from '../../admin/modal/roleType';
import {SocketService} from '../../../@core/service/socket.service';
import {LoanFormService} from '../component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../model/loanData';
import {LoanStage} from '../model/loanStage';
import {DocAction} from '../model/docAction';


@Component({
    selector: 'app-loan-action',
    templateUrl: './loan-action.component.html',
    styleUrls: ['./loan-action.component.scss']
})
export class LoanActionComponent implements OnInit {


    @Input() loanConfigId: number;
    @Input() id: number;
    @Input() loanCategory: string;
    @Input() catalogueStatus = false;

    @Input() actionsList: ActionModel;
    popUpTitle: string;
    currentUserRoleType = false;
    sendForwardBackwardList = [];
    formAction: FormGroup;
    userList: Array<User> = new Array<User>();
    submitted = false;
    loanConfig: LoanConfig = new LoanConfig();
    private securityUrl = ApiConfig.TOKEN;
    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });

    constructor(
        private router: ActivatedRoute,
        private route: Router,
        private loanActionService: LoanActionService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private toastService: ToastService,
        private userService: UserService,
        private loanConfigService: LoanConfigService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private http: HttpClient,
        private socketService: SocketService,
        private loanFormService: LoanFormService
    ) {
    }

    ngOnInit() {
        this.formAction = this.formBuilder.group(
            {
                loanConfigId: [undefined],
                customerLoanId: [undefined],
                toUser: [undefined],
                toRole: [undefined],
                docAction: [undefined],
                comment: [undefined, Validators.required],
                documentStatus: [undefined]
            }
        );

        this.loanConfigService.detail(this.loanConfigId).subscribe((response: any) => {
            this.loanConfig = response.detail;
        });

        const roleName: string = localStorage.getItem('roleName');
        const roleType: string = localStorage.getItem('roleType');
        if (roleName !== 'admin') {
            this.currentUserRoleType = roleType === RoleType.MAKER;
        }

        if (roleType === RoleType.MAKER) {
            this.currentUserRoleType = true;
        }

    }

    sendBackwardList(template) {
        this.popUpTitle = 'Send Backward';
        this.loanActionService.getSendBackwardList().subscribe(
            (response: any) => {
                this.sendForwardBackwardList = response.detail;
            });
        this.formAction.patchValue({
                docAction: 'BACKWARD',
                documentStatus: DocStatus.PENDING,
                comment: null
            }
        );
        this.modalService.open(template);
    }

    sendForwardList(template) {
        this.popUpTitle = 'Send Forward';
        this.loanActionService.getSendForwardList().subscribe(
            (response: any) => {
                this.sendForwardBackwardList = [];
                this.sendForwardBackwardList = response.detail;
            });
        this.formAction.patchValue({
                docAction: 'FORWARD',
                documentStatus: DocStatus.PENDING,
                comment: null
            }
        );
        this.modalService.open(template);
    }

    onSubmit(templateLogin) {
        this.submitted = true;
        if (this.formAction.invalid) {
            return;
        }
        this.modalService.open(templateLogin);
        this.formAction.patchValue({
                loanConfigId: this.loanConfigId,
                customerLoanId: this.id
            }
        );
        this.onClose();
        this.modalService.open(templateLogin);

    }

    getUserList(roleId) {
        this.userService.getUserListByRoleId(roleId.id).subscribe((response: any) => {
            this.userList = response.detail;
            if (this.userList.length === 1) {
                this.formAction.patchValue({
                        toUser: this.userList[0]
                    }
                );
            }
        });
    }

    onClose() {
        this.modalService.dismissAll(this.formAction.value);
    }

    onEdit() {
        this.route.navigate(['/home/loan/loanForm'], {
            queryParams: {
                loanId: this.loanConfigId,
                customerId: this.id,
                loanCategory: this.loanCategory
            }
        });
    }

    onLogin(datavalue) {
        this.onClose();
        const data: { email: string, password: string } = datavalue.value;
        data.email = localStorage.getItem('username');
        const datas = 'grant_type=password&username=' + data.email + '&password=' + data.password;
        this.http.post(this.securityUrl, datas, {headers: this.headers})
            .subscribe(
                (res: any) => {
                    this.postAction();
                },
                error => {

                    this.toastService.show(new Alert(AlertType.ERROR, error.error.errorDescription));
                }
            );


    }

    postAction() {
        this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            this.sendLoanNotification(response.detail.customerLoanId);
            this.route.navigate(['/home/pending']);
        }, error => {


            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });
    }

    approved(template) {
        this.popUpTitle = 'APPROVED';
        this.formAction.patchValue({
                loanConfigId: this.loanConfigId,
                customerLoanId: this.id,
                docAction: 'APPROVED',
                documentStatus: DocStatus.APPROVED,
                comment: null
            }
        );
        this.modalService.open(template);


    }

    closeReject(commentTemplate, value) {
        this.popUpTitle = value;
        this.modalService.open(commentTemplate);
        let docAction = value;
        let documentStatus = null;
        if (value === 'REJECTED') {
            docAction = 'REJECT';
            documentStatus = DocStatus.REJECTED;
        } else {
            docAction = 'CLOSED';
            documentStatus = DocStatus.CLOSED;
        }
        this.formAction.patchValue({
                loanConfigId: this.loanConfigId,
                customerLoanId: this.id,
                docAction: docAction,
                documentStatus: documentStatus
            }
        );


    }

    /*print() {
        window.print();
    }*/

    generateOfferLetter(templateUrl) {
        this.route.navigate([templateUrl], {queryParams: {customerId: this.id}});
    }

    deleteCustomerLoan() {
        this.loanFormService.deleteLoanCustomer(this.id).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully Deleted'));
                this.route.navigate(['/home/pending']);
            },
            error => {
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            });
    }

    sendLoanNotification(customerLoanId: number): void {
        this.loanFormService.detail(customerLoanId).subscribe((loanResponse: any) => {
            const customerLoan: LoanDataHolder = loanResponse.detail;
            // set loan stage information
            this.socketService.message.loanConfigId = customerLoan.loan.id;
            this.socketService.message.customerId = customerLoan.id;
            this.socketService.message.toUserId = customerLoan.currentStage.toUser.id;
            this.socketService.message.toRoleId = customerLoan.currentStage.toRole.id;
            this.socketService.message.fromId = customerLoan.currentStage.fromUser.id;
            this.socketService.message.fromRole = customerLoan.currentStage.fromRole.id;
            this.socketService.message.date = new Date();
            this.socketService.message.docAction = customerLoan.currentStage.docAction;

            const docAction = customerLoan.currentStage.docAction.toString();
            if (docAction === DocAction.value(DocAction.FORWARD) ||
                docAction === DocAction.value(DocAction.BACKWARD)) {
                // send notification to current stage user
                this.socketService.message.toId = customerLoan.currentStage.toUser.id;
                this.socketService.message.toRole = customerLoan.currentStage.toRole.id;
                this.socketService.sendMessageUsingSocket();
            }
            // send notifications to unique previous stage users
            for (const distinct of customerLoan.distinctPreviousList) {
                const distinctStage: LoanStage = distinct;

                if (customerLoan.currentStage.toUser.id !== distinctStage.toUser.id
                    && customerLoan.currentStage.fromUser.id !== distinctStage.toUser.id) {
                    this.socketService.message.toId = distinctStage.toUser.id;
                    this.socketService.message.toRole = distinctStage.toRole.id;
                    this.socketService.sendMessageUsingSocket();
                }
            }
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

}
