import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ApprovalRoleHierarchyService} from '../../approval/approval-role-hierarchy.service';
import {LoanDataHolder} from '../../model/loanData';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../admin/modal/roleType';
import {User} from '../../../admin/modal/user';
import {Role} from '../../../admin/modal/role';
import {DocStatus} from '../../model/docStatus';
import {LoanActionVerificationComponent} from '../loan-action-verification/loan-action-verification.component';
import {ToastService} from '../../../../@core/utils';
import {SocketService} from '../../../../@core/service/socket.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../component/loan-form/service/loan-form.service';
import {Router} from '@angular/router';
import {DocAction} from '../../model/docAction';
import {LoanStage} from '../../model/loanStage';
import {UserService} from '../../../admin/component/user/user.service';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
    selector: 'app-role-hierarchy-model',
    templateUrl: './role-hierarchy-model.component.html',
    styleUrls: ['./role-hierarchy-model.component.scss']
})
export class RoleHierarchyModelComponent implements OnInit {

    form: FormGroup;
    submitted = false;
    @Input() isMaker: string;
    @Input() approvalType: string;
    @Input() refId: number;
    @Input() currentRole: string;
    @Input() loanConfigId: number;
    @Input() customerLoanId: number;
    @Input() branchId: number;
    @Input() customerLoanHolder: LoanDataHolder;
    @Input() popUpTitle: string;
    @Input() currentRoleOrder: number;
    @Input() docAction: string;
    @Input() documentStatus: DocStatus;
    @Input() isTransfer: boolean;
    length = false;
    roleId: number;
    transferRoleList = [];
    userList: Array<User> = new Array<User>();
    roleOrder: number;
    isEmptyUser = false;
    showUserList = true;
    selectedRole: Role;
    ckeConfig = Editor.CK_CONFIG;
    selectedUsername: string;
    username: string;

    constructor(
        public nbDialogRef: NbDialogRef<RoleHierarchyModelComponent>,
        private formBuilder: FormBuilder,
        private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
        private userService: UserService,
        private loanFormService: LoanFormService,
        private nbDialogService: NbDialogService,
        private toastService: ToastService,
        private socketService: SocketService,
        private router: Router,
        private roleService: RoleService) {
    }

    ngOnInit() {
        this.form = this.buildForm();
        // get and fetch roleId from local storage
        this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
        // method called
        this.getRoleData();
        console.log('username', this.username);
    }

    // method to build form control names
    public buildForm(): FormGroup {
        return this.formBuilder.group({
            toRole: [this.selectedRole, this.isTransfer ? [Validators.required] : []],
            toUser: [undefined],
            comment: [undefined, Validators.required],
            loanConfigId: [this.loanConfigId],
            customerLoanId: [this.customerLoanId],
            docAction: [this.docAction],
            documentStatus: [this.documentStatus],
        });
    }
    // get all roll based on set hierarchy
    private getRoleData(): void {
        this.approvalRoleHierarchyService.findAll(this.approvalType, this.refId).subscribe((response: any) => {
                this.transferRoleList = [];
                this.transferRoleList = response.detail;
            });
    }

    // get user list based on role
    public getUserList(role) {
        this.selectedRole = role;
        this.isEmptyUser = false;
        this.showUserList = true;
        this.roleService.detail(role.id).subscribe((res: any) => {
            role = res.detail;
            this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
                this.userList = response.detail;
                // check for empty user
                if (this.userList.length === 0) {
                    this.isEmptyUser = true;
                } else if (this.userList.length === 1) {
                    // fetch user internally
                    this.form.patchValue({
                        toUser: this.userList[0]
                    });
                }
            });
        });
    }
    
    // get selected user username
    getSelectedUser(toUser) {
        // set selected user
        this.selectedUsername = toUser.username;
    }

    public onSubmit() {
        this.submitted = true;
        // stop form submit if invalid
        if (this.form.invalid) {
            return;
        }
        // restricting loan transfer for same user
        if (this.selectedRole.roleType === RoleType.MAKER &&
            this.selectedUsername === LocalStorageUtil.getStorage().username) {
            this.toastService.show(new Alert(AlertType.ERROR, 'Please select different user to transfer file'));
            return;
        }
        const dialogRef = this.nbDialogService.open(LoanActionVerificationComponent, {
            context: {
                // send context to Loan Action Verification Component for authentication
                toUser: this.form.get('toUser').value,
                toRole: this.form.get('toRole').value,
                action: this.docAction
            }
        });
        dialogRef.onClose.subscribe((verified: boolean) => {
            if (verified === true) {
                this.postAction();
                this.nbDialogRef.close();
            }
        });

    }

    // method for sending notification and redirecting to dashboard
    private postAction() {
        this.loanFormService.postLoanAction(this.form.value).subscribe((response: any) => {
            const msg = `Document Has been Successfully ${this.form.get('docAction').value}`;
            this.toastService.show(new Alert(AlertType.SUCCESS, msg));
            this.sendLoanNotification(response.detail.customerLoanId);
            this.router.navigate(['/home/pending']);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

    // method to set and send notification
    private sendLoanNotification(customerLoanId: number): void {
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
            if (docAction === DocAction.value(DocAction.TRANSFER) ||
                docAction === DocAction.value(DocAction.FORWARD) ||
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
