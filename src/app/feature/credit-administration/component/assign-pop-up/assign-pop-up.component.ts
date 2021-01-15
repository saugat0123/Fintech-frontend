import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../admin/component/user/user.service';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {RouteConst} from '../../model/RouteConst';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-assign-pop-up',
    templateUrl: './assign-pop-up.component.html',
    styleUrls: ['./assign-pop-up.component.scss']
})
export class AssignPopUpComponent implements OnInit {
    @Input()
    cadData: any;
    @Input()
    disbursementDataAssign: boolean;
    errorMessage;
    offerLetterAssignForm: FormGroup;
    userList = [];
    selectedBranchId;
    submitted = false;
    roleListInCAD = [];
    spinner = false;

    constructor(private userService: UserService,
                private formBuilder: FormBuilder,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService,
                private modalRef: NgbActiveModal,
                private cadService: CreditAdministrationService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            if (ObjectUtil.isEmpty(this.cadData.cadId)) {
                this.selectedBranchId = this.cadData.branch.id;
            } else {
                this.selectedBranchId = this.cadData.branch.id;
            }
        }
        this.buildOfferLetterAssignForm();
        this.getRoleListPresentInCad();
    }

    assignOfferLetter() {
        this.spinner = true;
        if (this.disbursementDataAssign) {
            this.disbursementAssign();
        } else {
            this.cadService.assignLoanToUser(this.offerLetterAssignForm.value).subscribe((res: any) => {
                console.log(res);
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.SUCCESS, 'SuccessFully Assigned Cad Document'));
                this.onClose();
                this.routerUtilsService.reloadRoute(RouteConst.ROUTE_DASHBOARD, RouteConst.ROUTE_OFFER_ALL);
            }, error => {
                this.spinner = false;
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error While Assigning Cad Document'));
            });
        }
    }

    public getRoleListPresentInCad() {
        this.spinner = true;
        this.cadService.getRoleInCad().subscribe((res: any) => {
            this.roleListInCAD = res.detail;
            if (this.roleListInCAD.length > 1) {
                this.getUserList(this.roleListInCAD[0].role);
            }

        }, error => {
            this.spinner = false;
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Loading Role List'));
        });
    }

    public getUserList(role) {
        this.offerLetterAssignForm.patchValue({
            toRole: role,
            toUser: undefined
        });
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.selectedBranchId).subscribe((response: any) => {
            this.errorMessage = null;
            this.userList = response.detail;
            if (this.userList.length === 1) {
                this.offerLetterAssignForm.patchValue({
                    toUser: this.userList[0],
                    toRole: role
                });
            } else if (this.userList.length > 1) {
                this.offerLetterAssignForm.patchValue({
                    toUser: this.userList[0],
                    toRole: role
                });

            } else {
                this.errorMessage = 'NO User Present in this Role';
            }
            this.spinner = false;
        }, error => {
            this.spinner = false;
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Loading Users'));
        });
    }


    buildOfferLetterAssignForm(): void {
        this.offerLetterAssignForm = this.formBuilder.group(
            {
                customerLoanDtoList: [this.cadData.customerLoanDtoList],
                toUser: [undefined, Validators.required],
                toRole: [undefined, Validators.required],
                docAction: ['ASSIGNED'],
                comment: ['assigned'],
                loanHolderId: [this.cadData.id],
                cadId: [ObjectUtil.isEmpty(this.cadData.cadId) ? undefined : this.cadData.cadId]
            });
    }

    onClose() {
        this.modalRef.close();
    }


    disbursementAssign() {
        this.cadService.assignCADToUser(this.offerLetterAssignForm.value).subscribe((res: any) => {
            console.log(res);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'SuccessFully Assigned Cad Document'));
            this.onClose();
            this.routerUtilsService.reloadRoute(RouteConst.ROUTE_DASHBOARD, RouteConst.ROUTE_DISBURSEMENT_PENDING);
        }, error => {
            this.spinner = false;
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Assigning Cad Document'));
        });
    }

}
