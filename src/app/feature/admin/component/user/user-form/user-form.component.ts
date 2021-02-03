import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../modal/user';
import {Branch} from '../../../modal/branch';
import {Role} from '../../../modal/role';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {UserService} from '../user.service';
import {RoleService} from '../../role-permission/role.service';
import {BranchService} from '../../branch/branch.service';
import {RoleAccess} from '../../../modal/role-access';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {Router} from '@angular/router';
import {Province} from '../../../modal/province';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {RoleType} from '../../../modal/roleType';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

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
    provinces: Array<Province>;
    branch = new Array<Branch>();
    roleList: Array<Role>;
    role = new Role();
    selectedRole;
    isSpecific = false;
    isAll = false;
    tempBranch;
    tempProvince = [];
    finalBranchList = [];
    branchIdList;
    disableRoleBranch = false;
    hideCustomerCount = true;
    customerCount: String;
    hideSaveButton = false;
    editedId;
    tempFlags = {
        validUserName: true,
        validUserEmail: true,
    };
    roleType = RoleType;
    isCadSuperVisor = false;

    constructor(
        private service: UserService,
        private router: Router,
        private roleService: RoleService,
        private branchService: BranchService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService,
        private loanService: LoanFormService,
        private addressService: AddressService
    ) {
    }

    ngOnInit() {

        this.roleService.getAll().subscribe((response: any) => {
            this.roleList = response.detail;
        });

        this.roleService.getActiveRoles().subscribe((response: any) => {
            this.roleList = response.detail;
        });

        this.addressService.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while loading province'));
            console.log(error);
        });

        this.getEdit();

    }


    onSubmit() {
        this.submitted = true;
        this.finalBranchList = [];

        if (this.selectedRole.roleAccess === RoleAccess.SPECIFIC) {
            if (!ObjectUtil.isEmpty(this.branchIdList) && this.branchIdList.length > 0) {
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
        const provinces: Array<Province> = [];
        if (this.tempProvince.length > 0) {
            for (let i = 0; i < this.tempProvince.length; i++) {
                provinces.push(this.provinces.filter(value => value.id === this.tempProvince[i])[0]);
            }
        }
        this.model.provinces = provinces;
        this.service.save(this.model).subscribe(() => {
            if (this.model.id == null) {
                this.model = new User();
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved User!'));
                this.activeModal.close(ModalResponse.SUCCESS);
            } else {
                this.model = new User();
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated User'));
                this.activeModal.close(ModalResponse.SUCCESS);
            }
            }, error => {

                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
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
                this.branchService.getAll().subscribe((r: any) => {
                    this.branchList = r.detail;
                });
            }

            if (this.selectedRole.roleAccess === RoleAccess.SPECIFIC) {
                this.isSpecific = true;
                this.branchService.getAll().subscribe((re: any) => {
                    this.branchList = re.detail;
                });

            }
            this.role = res.detail;
            this.checkRoleData(this.role);
        });
    }

    checkRoleData(role: Role) {
        this.isCadSuperVisor = role.roleType === RoleType.CAD_SUPERVISOR;
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
            if (this.model.role !== null) {
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

                if (this.model.role.roleType === RoleType.CAD_SUPERVISOR) {
                    this.isCadSuperVisor = true;
                    for (let i = 0; i < this.model.provinces.length; i++) {
                        this.tempProvince.push(this.model.provinces[i].id);
                    }
                }
                this.checkRoleData(this.model.role);
            }

        }
    }

    editRole(id, chkStatus, role) {
        this.editedId = id;
        this.disableRoleBranch = true;
        if (role === undefined || role === null) {
            this.disableRoleBranch = false;
        } else if (chkStatus) {
            if (role.roleAccess === RoleAccess.OWN) {
                this.isSpecific = false;
                this.branchService.getAll().subscribe((r: any) => {
                    this.branchList = r.detail;
                });
            }

            if (role.roleAccess === RoleAccess.SPECIFIC) {
                this.isSpecific = true;
                this.branchService.getAll().subscribe((re: any) => {
                    this.branchList = re.detail;
                });

            }
            this.loanService.getLoanStatusApi(id).subscribe((response: any) => {
                if (response.detail.status === 'false') {
                    this.disableRoleBranch = false;
                } else {
                    this.customerCount = response.detail.count;
                    this.hideCustomerCount = false;
                    this.hideSaveButton = true;
                }
            });
        } else {
            this.disableRoleBranch = true;
            this.hideCustomerCount = true;
            this.hideSaveButton = false;
        }


    }

    goToCatalouge() {
        this.onClose();
        this.router.navigate(['home/admin/catalogue'], {queryParams: {userId: this.editedId}});

    }

    checkValidUserName(username) {
        this.spinner = true;
        const searchObject = {
            'username': username
        };
        this.service.getPaginationWithSearchObject(searchObject, 1, 1).subscribe(value => {
            this.tempFlags.validUserName = !!value.detail.empty;
            this.spinner = false;
        });
    }

    checkValidUserEmail(email) {
        this.spinner = true;
        const searchObject = {
            'email': email
        };
        this.service.getPaginationWithSearchObject(searchObject, 1, 1).subscribe(value => {
            this.tempFlags.validUserEmail = !!value.detail.empty;
            this.spinner = false;
        });
    }
}

