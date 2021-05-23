import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Branch} from '../../../admin/modal/branch';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {ToastService} from '../../../../@core/utils';
import {CadDocStatus} from '../../model/CadDocStatus';
import {UserService} from '../../../../@core/service/user.service';
import {RoleType} from '../../../admin/modal/roleType';
import {User} from '../../../admin/modal/user';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {ApprovalRoleHierarchyService} from '../../../loan/approval/approval-role-hierarchy.service';
import {Role} from '../../../admin/modal/role';
import {ApprovalRoleHierarchy} from '../../../loan/approval/ApprovalRoleHierarchy';
import {RoleAccess} from '../../../admin/modal/role-access';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
    isFilterCollapsed = true;
    filterForm: FormGroup;
    branchList: Array<Branch> = new Array<Branch>();
    cadDocStatus = CadDocStatus.key();
    role = RoleType;
    possessionUnderUserList: Array<User>;
    showPossessionUnder = false;
    @Output() eventEmitter = new EventEmitter();
    @Input() fromCadDashboard;
    @Input() docStatus;
    possessionRoleList: Array<Role>;
    branchAccessIsOwn = false;

    constructor(private branchService: BranchService,
                private toastService: ToastService,
                private formBuilder: FormBuilder,
                private userService: UserService,
                private routerUtils: RouterUtilsService,
                private service: ApprovalRoleHierarchyService,
    ) {
    }

    ngOnInit() {

        this.buildFilterForm();
        this.userService.getLoggedInUser().subscribe(res => {
            if (res.detail.role.roleType === RoleType.CAD_ADMIN || res.detail.role.roleType === RoleType.CAD_SUPERVISOR) {
                this.showPossessionUnder = true;
                this.getCadRoleList();
            }
            if (res.detail.role.roleAccess === RoleAccess.OWN) {
                this.branchAccessIsOwn = true;
            } else {
                this.branchAccessIsOwn = false;
            }
            if (res.detail.role.roleType === RoleType.CAD_SUPERVISOR) {
                const idList = [];
                res.detail.provinces.forEach(value => {
                    idList.push(value);
                });
                this.branchService.getBranchByProvinceList(idList).subscribe((branchLists: any) => {
                    this.branchList = branchLists.detail;
                });
            } else {
                this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
                    this.branchList = response.detail;
                }, error => {
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
                });
            }
        });


    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            name: [undefined],
            customerType: [undefined],
            branchIds: [undefined],
            toUser: undefined,
            docStatus: undefined,
            toRole: undefined
        });
    }

    onSearch() {
        this.eventEmitter.emit(this.filterForm.value);
    }

    clear() {
        this.filterForm.reset();
        this.eventEmitter.emit(this.filterForm.value);

    }

    getUserList() {
        this.userService.getAllUserByCurrentRoleBranchAccess().subscribe((value: any) => {
            this.possessionUnderUserList = value.detail;
        });

    }

    getCadRoleList() {
        const approvalType = 'CAD';
        const refId = 0;

        this.service.findAll(approvalType, refId).subscribe((response: any) => {
            let approvalList: ApprovalRoleHierarchy[] = [];
            approvalList = response.detail;
            this.possessionRoleList = approvalList.map(a => a.role);
        });

    }

    getReport() {
        this.routerUtils.generateReport(this.filterForm.value, this.docStatus, this.fromCadDashboard);
    }

}
