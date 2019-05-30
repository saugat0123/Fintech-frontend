import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {User} from '../../../modal/user';
import {Branch} from '../../../modal/branch';
import {Role} from '../../../modal/role';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {UserService} from '../user.service';
import {RoleService} from '../../role-permission/role.service';
import {BranchService} from '../../branch/branch.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit, DoCheck {

    @Input()
    model: User;
    task: string;
    submitted = false;
    spinner = false;
    branchList: Array<Branch>;
    branch = new Branch();
    roleList: Array<Role>;
    role = new Role();

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
        console.log(this.model.userName);
        this.branchService.getAll().subscribe((response: any) => {
            this.branchList = response.detail;
        });
        this.roleService.getAll().subscribe((response: any) => {
            this.roleList = response.detail;
        });

        this.roleService.getActiveRoles().subscribe((response: any) => {
            this.roleList = response.detail;
        });
    }

    ngDoCheck(): void {
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
        }
        console.log(this.model);
    }

    onSubmit() {
        this.submitted = true;
        this.model.branch = this.branch;
        this.model.role = this.role;
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
}

