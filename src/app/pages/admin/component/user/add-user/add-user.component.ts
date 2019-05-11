import {Component, DoCheck, OnInit} from '@angular/core';
import {User} from '../../../modal/user';
import {Router} from '@angular/router';
import {Branch} from '../../../modal/branch';
import {Role} from '../../../modal/role';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    user: User = new User();
    branchList: Array<Branch>;
    branch = new Branch();
    roleList: Array<Role>;
    role = new Role();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal
    ) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/branch/getList').subscribe((response: any) => {
            this.branchList = response.detail;
        });
        this.commonService.getByAll('v1/role').subscribe((response: any) => {
            this.roleList = response.detail;
        });

        this.commonService.getByAll('v1/role/active').subscribe((response: any) => {
            this.roleList = response.detail;
        });
    }

    ngDoCheck(): void {
        this.user = this.dataService.getUser();
        if (this.user.id == null) {
            this.task = 'Add';
        } else {
            if (this.user.branch != null) {
                this.branch = this.user.branch;
            }
            if (this.user.role != null) {
                this.role = this.user.role;
            }
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.user.branch = this.branch;
        this.user.role = this.role;
        this.commonService.saveOrEdit(this.user, 'v1/user').subscribe(result => {
                this.modalService.dismissAll(AddUserComponent);
                if (this.user.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED USER';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED USER';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.user = new User();
                this.router.navigateByUrl('pages/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['pages/user']));


            }, error => {

                this.modalService.dismissAll(AddUserComponent);

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('pages/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['pages/user']));

            }
        );
    }

    onClose() {

        this.activeModal.dismiss(AddUserComponent);

    }

    profileUploader(event) {
        const file = <File>event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', 'profile');
        this.commonService.getByFilePost('v1/user/uploadFile', formdata).subscribe((result: any) => {
            this.user.profilePicture = result.detail;
        });
    }

    signatureUploader(event) {
        const file = <File>event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', 'signature');
        this.commonService.getByFilePost('v1/user/uploadFile', formdata).subscribe((result: any) => {
            this.user.signatureImage = result.detail;
        });
    }

}

