import {Component, DoCheck, OnInit} from '@angular/core';
import {User} from '../../../modal/user';
import {CommonService} from '../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../shared-service/baseservice/common-dataService';
import {Branch} from '../../../modal/branch';

declare var $;

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner: boolean = false;
    globalMsg;
    user: User = new User();
    branchList: any;
    branch: Branch = new Branch();
    roleList;

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/branch/getList').subscribe((response: any) => {
            this.branchList = response.detail;
            console.log(this.branchList);
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
            this.task = 'Edit';
        }

    }

    onSubmit() {

        console.log(this.user);
        this.commonService.saveOrEdit(this.user, 'v1/user').subscribe(result => {
                $('.add-user').modal('hide');
                if (this.user.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED USER';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED USER';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.user = new User();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/user']));
                this.dataService.alertmsg();


            }, error => {

                $('.add-user').modal('hide');

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/user']));
                this.dataService.alertmsg();

            }
        );
    }

    profileUploader(event) {
        console.log('here');
        console.log(event.target.files[0]);
        let file = <File> event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        this.commonService.getByPost('v1/user/uploadProfile', formdata).subscribe(result => {
            console.log(result);
        });
    }

    signatureUploader(event) {
        console.log('here');
        console.log(event.target.files[0]);
        let file = <File> event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        this.commonService.getByPost('v1/user/uploadSignature', formdata).subscribe(result => {
            console.log(result);
        });
    }

}

