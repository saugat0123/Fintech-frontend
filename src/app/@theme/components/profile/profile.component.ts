import {Component, OnInit} from '@angular/core';
import {BranchService} from '../../../feature/admin/component/branch/branch.service';
import {Branch} from '../../../feature/admin/modal/branch';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
        this.username = localStorage.getItem('username');
        this.roleName = localStorage.getItem('roleName');
        this.roleType = localStorage.getItem('roleType');
        this.branchService.getBranchAccessByCurrentUser().subscribe(
            (response: any) => {
                this.branches = response.detail;

            });
    }

    onClose() {
        this.modalService.dismissAll();
    }


}
