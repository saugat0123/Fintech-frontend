import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../admin/component/user/user.service';

@Component({
    selector: 'app-assign-pop-up',
    templateUrl: './assign-pop-up.component.html',
    styleUrls: ['./assign-pop-up.component.scss']
})
export class AssignPopUpComponent implements OnInit {
    errorMessage;
    offerLetterAssignForm: FormGroup;
    userList = [];
    selectedBranchId;
    submitted = false;

    constructor(private userService: UserService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
    }

    assignOfferLetter() {

    }

    public getUserList(role) {
        this.offerLetterAssignForm.patchValue({
            role: role,
            user: undefined
        });
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.selectedBranchId).subscribe((response: any) => {
            this.errorMessage = null;
            this.userList = response.detail;
            if (this.userList.length === 1) {
                this.offerLetterAssignForm.patchValue({
                    user: this.userList[0],
                    role: role
                });
            } else if (this.userList.length > 1) {
                this.offerLetterAssignForm.patchValue({
                    user: this.userList[0],
                    role: role
                });

            } else {
                this.errorMessage = 'NO User Present in this Role';
            }
        });
    }


    buildOfferLetterAssignForm(): void {
        this.offerLetterAssignForm = this.formBuilder.group(
            {
                customerLoanIds: [undefined],
                user: [undefined, Validators.required],
                role: [undefined, Validators.required]
            });
    }

}
