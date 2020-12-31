import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../admin/component/user/user.service';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-assign-pop-up',
    templateUrl: './assign-pop-up.component.html',
    styleUrls: ['./assign-pop-up.component.scss']
})
export class AssignPopUpComponent implements OnInit {
    @Input()
    cadData: any;
    errorMessage;
    offerLetterAssignForm: FormGroup;
    userList = [];
    selectedBranchId;
    submitted = false;
    roleListInCAD = [];

    constructor(private userService: UserService,
                private formBuilder: FormBuilder,
                private cadService: CreditAdministrationService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            if (ObjectUtil.isEmpty(this.cadData.cadId)) {
                this.selectedBranchId = this.cadData.branch.id;
            } else {

            }
        }
        this.buildOfferLetterAssignForm();
        this.getRoleListPresentInCad();
    }

    assignOfferLetter() {
        console.log(this.offerLetterAssignForm.value);
        this.cadService.assignLoanToUser(this.offerLetterAssignForm.value).subscribe((res: any) => {

        });
    }

    public getRoleListPresentInCad() {
        this.cadService.getRoleInCad().subscribe((res: any) => {
            this.roleListInCAD = res.detail;
            if (this.roleListInCAD.length > 1) {
                this.getUserList(this.roleListInCAD[0].role);
            }

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
                loanHolderId:[this.cadData.id]
            });
    }

    onClose() {
    }

}
