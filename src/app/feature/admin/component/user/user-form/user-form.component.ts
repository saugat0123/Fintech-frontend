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
    disableRoleBranch = false;

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

        if (this.selectedRole.roleAccess === RoleAccess.SPECIFIC) {
            if (this.branchIdList.length > 0) {
                for (let i = 0; i < this.branchIdList.length; i++) {
                    this.tempBranch = new Branch();
                    this.tempBranch.id = this.branchIdList[i];
                    this.finalBranchList.push(this.tempBranch);

                }
            }
        }
        if (this.selectedRole.roleAccess === RoleAccess.OWN) {
            const b = {
                id: this.tempBranch
            };
            this.finalBranchList.push(b);
        }
        if (this.selectedRole.roleAccess === RoleAccess.ALL) {
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
            if (this.selectedRole.roleAccess === RoleAccess.ALL) {
                this.isSpecific = false;
                this.isAll = true;
            }

            if (this.selectedRole.roleAccess === RoleAccess.OWN) {
                this.isSpecific = false;
                this.branchService.getBranchNoTAssignUser(id).subscribe((r: any) => {
                    this.branchList = r.detail;
                });
            }

            if (this.selectedRole.roleAccess === RoleAccess.SPECIFIC) {
                this.isSpecific = true;
                this.branchService.getBranchNoTAssignUser(id).subscribe((re: any) => {
                    this.branchList = re.detail;
                });

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
            this.disableRoleBranch = true;

            this.branchService.getBranchNoTAssignUser(this.model.role.id).subscribe((re: any) => {
                const temp = re.detail;
                this.branchList = this.model.branch;
                temp.forEach(t => {
                    this.branchList.push(t);
                });
            });
            this.selectedRole = this.model.role;
            const tempRoleAccess = this.model.role.roleAccess;
            this.branchIdList = [];
            if (tempRoleAccess === RoleAccess.SPECIFIC) {
                this.isSpecific = true;
                for (let i = 0; i < this.model.branch.length; i++) {
                    this.branchIdList.push(this.model.branch[i].id);
                }
            }
            if (tempRoleAccess === RoleAccess.OWN) {
                this.isSpecific = false;
                for (let i = 0; i < this.model.branch.length; i++) {
                    this.tempBranch = this.model.branch[i].id;
                }
            }

            if (tempRoleAccess === RoleAccess.ALL) {
                this.isAll = true;
            }

        }
    }

}

