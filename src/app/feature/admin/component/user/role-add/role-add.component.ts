import {Component, Input, OnInit} from '@angular/core';
import {RoleService} from '../../role-permission/role.service';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../user.service';
import {User} from '../../../modal/user';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Role} from '../../../modal/role';

@Component({
    selector: 'app-role-add',
    templateUrl: './role-add.component.html',
    styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
    @Input()
    user: User;
    roleList = [];
    roleForm: FormGroup;
    selectedRoleList = [];
    placeHolder = 'Select Role';
    documentInRoles = [];
    errorMessage = null;

    constructor(private roleService: RoleService,
                private formBuilder: FormBuilder,
                private toastService: ToastService,
                private activeModal: NgbActiveModal,
                private userService: UserService) {
    }

    ngOnInit() {
        this.buildForm();
        this.roleService.getAll().subscribe((response: any) => {
            this.roleList = response.detail;
            this.roleList = this.roleList.filter((f: Role) =>
                f.id !== this.user.role.id
            );
        });
        this.user.roleList.forEach((f: any) => {
            this.placeHolder = '';
            this.selectedRoleList.push(f.id);
        });
        this.roleForm.get('roleIds').patchValue(this.selectedRoleList);
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

    buildForm() {
        this.roleForm = this.formBuilder.group({
            roleIds: [[]]
        });
    }

    submit() {
        this.errorMessage = null;
        const selected = this.roleForm.get('roleIds').value;
        this.userService.updateUserRoles(selected, this.user.id).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED ROLES'));
            this.activeModal.close();
        }, error => {
            this.errorMessage = null;
            switch (error.status) {
                case 403:
                    this.documentInRoles = error.error.detail;
                    this.errorMessage = error.error.message;
                    break;

                default:
                    this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
                    this.activeModal.close();
            }

        });
    }

}
