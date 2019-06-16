import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanActionService} from './service/loan-action.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../@core/utils';
import {AlertService} from '../../../@theme/components/alert/alert.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {User} from '../../admin/modal/user';
import {UserService} from '../../admin/component/user/user.service';


@Component({
    selector: 'app-loan-action',
    templateUrl: './loan-action.component.html',
    styleUrls: ['./loan-action.component.scss']
})
export class LoanActionComponent implements OnInit {


    @Input() loanConfigId: number;
    @Input() id: number;
    popUpTitle: string;
    sendForwardBackwardList = [];
    formAction: FormGroup;
    userList: Array<User> = new Array<User>();

    constructor(
        private router: ActivatedRoute,
        private route: Router,
        private loanActionService: LoanActionService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private toastService: ToastService,
        private userService: UserService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.formAction = this.formBuilder.group(
            {
                loanConfigId: [undefined],
                customerId: [undefined],
                toUser: [undefined],
                toRole: [undefined],
                docAction: [undefined],
                comment: [undefined]
            }
        );


    }

    sendBackwardList(template) {
        this.popUpTitle = 'Send Backward';
        this.loanActionService.getSendBackwardList().subscribe(
            (response: any) => {
                this.sendForwardBackwardList = response.detail;
            });
        this.formAction.patchValue({
                docAction: 'BACKWARD'
            }
        );
        this.modalService.open(template);
    }

    sendForwardList(template) {
        this.popUpTitle = 'Send Forward';
        this.loanActionService.getSendForwardList().subscribe(
            (response: any) => {
                this.sendForwardBackwardList = response.detail;
            });
        this.formAction.patchValue({
                docAction: 'FORWARD'
            }
        );
        this.modalService.open(template);
    }

    onSubmit() {
        this.formAction.patchValue({
                loanConfigId: this.loanConfigId,
                customerId: this.id
            }
        );

        this.onClose();

        this.loanActionService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            this.route.navigate(['/home/pending']);
        }, error => {

            console.log(error);

            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });

    }

    getUserList(roleId) {
        this.userService.getUserListByRoleId(roleId).subscribe((response: any) => {
            this.userList = response.detail;

            if (this.userList.length === 1) {
                this.formAction.patchValue({
                        toUser: this.userList[0].id
                    }
                );
            }
        });
    }

    onClose() {
        this.modalService.dismissAll(this.formAction.value);
    }

    onEdit() {
        this.route.navigate(['/home/loan/loanForm'], {queryParams: {loanId: this.loanConfigId, customerId: this.id}});
    }

}
