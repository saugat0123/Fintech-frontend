import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../../@core/utils';
import {UserService} from '../../../admin/component/user/user.service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SocketService} from '../../../../@core/service/socket.service';
import {LoanFormService} from '../../component/loan-form/service/loan-form.service';
import {RoleType} from '../../../admin/modal/roleType';
import {DocStatus} from '../../model/docStatus';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-offer-letter-action',
    templateUrl: './offer-letter-action.component.html',
    styleUrls: ['./offer-letter-action.component.scss']
})
export class OfferLetterActionComponent implements OnInit {


    id;
    allId;
    popUpTitle: string;
    currentUserRoleType = false;

    formAction: FormGroup;

    submitted = false;
    userList;
    errorMsg;
    errorMsgStatus = false;

    private securityUrl = ApiConfig.TOKEN;
    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });
    falseCredential = false;
    falseCredentialMessage = '';

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
        private loanFormService: LoanFormService,
    ) {
    }

    ngOnInit() {

        this.router.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {

                    customerId: null,

                };
                this.allId = paramsValue;
                this.id = this.allId.customerId;
            });

        this.formAction = this.formBuilder.group(
            {
                toUser: [undefined],
                customerLoanId: [undefined],
                docAction: [undefined],
                comment: [undefined, Validators.required],
                documentStatus: [undefined]
            }
        );

        this.userService.getUserListByRoleCad().subscribe((res: any) => {
            this.userList = res.detail;
            if (this.userList.length === 1) {
                this.formAction.patchValue({
                        toUser: this.userList[0]
                    }
                );
            }
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


    onSubmit(templateLogin) {
        this.errorMsgStatus = false;
        this.falseCredential = false;
        this.submitted = true;
        if (this.formAction.invalid) {
            return;
        }
        if (this.formAction.get('docAction').value === 'FORWARD'
            && this.formAction.get('toUser').value === null) {
            this.errorMsg = 'User is required';
            this.errorMsgStatus = true;

        } else {
            this.onClose();
            this.modalService.open(templateLogin);
        }

    }


    onClose() {
        this.modalService.dismissAll(this.formAction.value);
    }


    onLogin(dataValue) {

        const data: { email: string, password: string } = dataValue.value;
        data.email = localStorage.getItem('username');
        const requestBody = 'grant_type=password&username=' + data.email + '&password=' + data.password;
        this.http.post(this.securityUrl, requestBody, {headers: this.headers})
            .subscribe(
                () => {
                    this.onClose();
                    this.postAction();
                },
                error => {
                    this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
                    this.falseCredential = true;
                }
            );


    }

    postAction() {

        this.loanFormService.postOfferLetterAction(this.formAction.value).subscribe((response: any) => {
            this.onClose();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));

            this.route.navigate(['/home/loan/loan-offer-letter']);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });
    }

    approvedForwardBackward(template, val) {
        this.popUpTitle = val;
        this.formAction.patchValue({
                customerLoanId: this.id,
                docAction: val,
                documentStatus: val === 'APPROVED' ? DocStatus.APPROVED : DocStatus.PENDING,
                comment: null
            }
        );

        if (this.userList.length === 0 && val === 'FORWARD') {
            this.toastService.show(new Alert(AlertType.ERROR, 'No CAD User Present. Please Contact Admin'));
        } else {
            this.modalService.open(template);
        }


    }


}
