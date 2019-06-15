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


@Component({
    selector: 'app-loan-action',
    templateUrl: './loan-action.component.html',
    styleUrls: ['./loan-action.component.scss']
})
export class LoanActionComponent implements OnInit {


    @Input() loanConfigId: number;
    @Input() id: number;

    @Input() actionsList: ActionModel;
    popUpTitle: string;
    sendForwardBackwardList = [];
    formAction: FormGroup;
    userList: Array<User> = new Array<User>();
    submitted = false;
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
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private http: HttpClient
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
                comment: [undefined, Validators.required]
            }
        );
        console.log(this.actionsList);

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
        this.route.navigate(['/home/loan/loanForm'], {queryParams: {loanId: this.loanConfigId, customerId: this.id}});
    }

    onLogin(datavalue) {
        this.onClose();
        const data: { email: string, password: string } = datavalue.value;
        if (data.email !== localStorage.getItem('username')) {
            this.toastService.show(new Alert(AlertType.ERROR, 'INVALID'));
        } else {
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
    }

    postAction() {
        this.loanActionService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            this.route.navigate(['/home/pending']);
        }, error => {


            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });
    }

}
