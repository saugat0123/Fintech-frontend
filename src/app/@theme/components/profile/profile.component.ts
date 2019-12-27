import {Component, OnInit} from '@angular/core';
import {BranchService} from '../../../feature/admin/component/branch/branch.service';
import {Branch} from '../../../feature/admin/modal/branch';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    username;
    roleName;
    roleType;
    branches: Branch[] = [];

    constructor(private branchService: BranchService,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.username = LocalStorageUtil.getStorage().username;
        this.roleName = LocalStorageUtil.getStorage().roleName;
        this.roleType = LocalStorageUtil.getStorage().roleType;
        this.branchService.getBranchAccessByCurrentUser().subscribe(
            (response: any) => {
                this.branches = response.detail;

            });
    }

    onClose() {
        this.modalService.dismissAll();
    }


}
