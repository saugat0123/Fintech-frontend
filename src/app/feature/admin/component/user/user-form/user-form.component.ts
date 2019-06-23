import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../modal/user';
import {Branch} from '../../../modal/branch';
import {Role} from '../../../modal/role';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {UserService} from '../user.service';
import {RoleService} from '../../role-permission/role.service';
import {BranchService} from '../../branch/branch.service';
import {RoleAccess} from '../../../modal/role-access';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

    @Input()
    model: User;
    task: string;
    submitted = false;
    spinner = false;
    branchList: Array<Branch>;
    branch = new Array<Branch>();
    roleList: Array<Role>;
    role = new Role();
    selectedRole;
    isSpecific = false;
    isAll = false;
    tempBranch;
    finalBranchList = [];
    branchIdList;

    constructor(
        private commonService: CommonService,
        private service: UserService,
        private roleService: RoleService,
        private branchService: BranchService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.branchService.getAll().subscribe((response: any) => {
            this.branchList = response.detail;
        });
        this.roleService.getAll().subscribe((response: any) => {
            this.roleList = response.detail;
        });

        this.roleService.getActiveRoles().subscribe((response: any) => {
            this.roleList = response.detail;
        });

        this.getEdit();

    }


    onSubmit() {
        this.submitted = true;
        this.finalBranchList = [];

        if (this.selectedRole.roleAccess === RoleAccess[0]) {
            if (this.branchIdList.length > 0) {
                for (let i = 0; i < this.branchIdList.length; i++) {
                    this.tempBranch = new Branch();
                    this.tempBranch.id = this.branchIdList[i];
                    this.finalBranchList.push(this.tempBranch);

                }
            }
        }
        if (this.selectedRole.roleAccess === RoleAccess[1]) {
            const b = {
                id: this.tempBranch
            };
            this.finalBranchList.push(b);
        }
        if (this.selectedRole.roleAccess === RoleAccess[2]) {
            this.finalBranchList = [];
        }
        this.model.branch = this.finalBranchList;
        this.model.role = this.role;
        console.log(this.model);
        this.service.save(this.model).subscribe(() => {
                this.model = new User();

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved User'));

                this.activeModal.close(ModalResponse.SUCCESS);


            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save User'));
                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

    profileUploader(event) {
        const file = <File>event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', 'profile');

        this.service.uploadFile(formdata).subscribe((result: any) => {
            this.model.profilePicture = result.detail;
        });
    }

    signatureUploader(event) {
        const file = <File>event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', 'signature');

        this.service.uploadFile(formdata).subscribe((result: any) => {
            this.model.signatureImage = result.detail;
        });
    }

    getBranchByRole(id) {
        this.isSpecific = false;
        this.isAll = false;
        this.roleService.detail(id).subscribe((res: any) => {
            this.selectedRole = res.detail;
            if (this.selectedRole.roleAccess === RoleAccess[2]) {
                this.isSpecific = false;
                this.isAll = true;
            }

            if (this.selectedRole.roleAccess === RoleAccess[1]) {
                this.isSpecific = false;
            }

            if (this.selectedRole.roleAccess === RoleAccess[0]) {
                this.isSpecific = true;

            }
            this.role = res.detail;
        });
    }


    getEdit() {
        if (this.model.id == null) {
            this.task = 'Add';
        } else {
            if (this.model.branch != null) {
                this.branch = this.model.branch;
            }
            if (this.model.role != null) {
                this.role = this.model.role;
            }
            this.task = 'Edit';
            this.isAll = false;
            const tempRoleAccess = this.model.role.roleAccess;
            this.branchIdList = [];
            if (tempRoleAccess === RoleAccess[0]) {
                this.isSpecific = true;
                for (let i = 0; i < this.model.branch.length; i++) {
                    this.branchIdList.push(this.model.branch[i].id);
                }
            }
            if (tempRoleAccess === RoleAccess[1]) {
                this.isSpecific = false;
                for (let i = 0; i < this.model.branch.length; i++) {
                    this.tempBranch = this.model.branch[i].id;
                }
            }

            if (tempRoleAccess === RoleAccess[2]) {
                this.isAll = true;
            }

        }
    }

}

