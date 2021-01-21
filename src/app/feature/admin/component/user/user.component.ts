import {Component, OnInit} from '@angular/core';
import {User} from '../../modal/user';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserFormComponent} from './user-form/user-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {UserService} from './user.service';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RoleAccess} from '../../modal/role-access';
import {BranchService} from '../branch/branch.service';
import {RoleService} from '../role-permission/role.service';
import {Branch} from '../../modal/branch';
import {Role} from '../../modal/role';
import {Status} from '../../../../@core/Status';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {UserHistoryComponent} from './user-history/user-history.component';
import {RoleType} from '../../modal/roleType';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

    title = 'User';
    breadcrumb = 'User > List';
    dataList: Array<User>;
    restApi = ApiConfig.URL;
    page = 1;
    isFilterCollapsed = true;

    spinner = false;
    globalMsg: string;
    search: any = {
        name: undefined,
        branchIds: undefined,
        userId: undefined,
        status: undefined
    };
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    user: User;
    newValue: string;
    users: number;
    dismissBranch = false;
    RootUrl = ApiConfig.URL;
    filterForm: FormGroup;
    branchList: Array<Branch> = new Array<Branch>();
    roleList: Array<Role> = new Array<Role>();
    active = Status.ACTIVE;
    inactive = Status.INACTIVE;
    allBranches = RoleAccess.ALL;
    roleType = RoleType;

    constructor(
        private service: UserService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private branchService: BranchService,
        private roleService: RoleService
    ) {
    }

    static loadData(other: UserComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
            other.dataList = response.detail.content;

            other.pageable = PaginationUtils.getPageable(response.detail);

            other.spinner = false;

        }, error => {

            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));

            other.spinner = false;
        });

    }

    ngOnInit() {
        this.buildFilterForm();
        this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
            this.branchList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });
        this.roleService.getAll().subscribe(
            (response: any) => {
                this.roleList = response.detail;
                this.roleList.splice(0, 1); // removes ADMIN
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Roles'));
            }
        );
        this.breadcrumbService.notify(this.title);

        UserComponent.loadData(this);

        // this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
        //     this.user = response.detail.user;
        // });
        this.service.getStatus().subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.users = response.detail.users;

        });
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            name: [undefined],
            branch: [undefined],
            role: [undefined],
            activeStatus: [undefined]
        });
    }

    changePage(page: number) {
        this.page = page;

        UserComponent.loadData(this);
    }

    onSearch() {
        this.search.name = ObjectUtil.isEmpty(this.filterForm.get('name').value) ? undefined :
            this.filterForm.get('name').value;
        this.search.branchIds = ObjectUtil.isEmpty(this.filterForm.get('branch').value) ? undefined :
            this.filterForm.get('branch').value;
        this.search.roleId = ObjectUtil.isEmpty(this.filterForm.get('role').value) ? undefined : this.filterForm.get('role').value;
        this.search.status = ObjectUtil.isEmpty(this.filterForm.get('activeStatus').value) ? undefined :
            this.filterForm.get('activeStatus').value;
        UserComponent.loadData(this);
    }

    clearSearch() {
        this.buildFilterForm();
        this.isFilterCollapsed = true;
    }

    edit(user: User) {
        const modalRef = this.modalService.open(UserFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = user;

        ModalUtils.resolve(modalRef.result, UserComponent.loadData, this);
    }

    add() {
        const modalRef = this.modalService.open(UserFormComponent, {size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.model = new User();

        ModalUtils.resolve(modalRef.result, UserComponent.loadData, this);
    }

    onChange(data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        const modalRef = this.modalService.open(UpdateModalComponent, {size: 'lg'});
        console.log(data);
        modalRef.componentInstance.data = data;
        modalRef.componentInstance.service = this.service;
        modalRef.result.then(
            close => {
                UserComponent.loadData(this);
            }, dismiss => {
                UserComponent.loadData(this);
            }
        );
    }

    dismiss(data, dismiss) {
        this.modalService.open(dismiss);
        this.user = data;
    }

    setDismissBranch(value) {
        this.dismissBranch = value;
        if (this.dismissBranch === true) {
            this.service.postDismiss(this.user).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Dismissed User'));
                UserComponent.loadData(this);

            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            });
        }
        this.modalService.dismissAll();
    }


    getCsv() {

        this.service.download(this.search).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = this.restApi + '/' + response.detail;
            link.download = this.restApi + '/' + response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

        });
    }

    history(user: User): void {
        const modalRef = this.modalService.open(UserHistoryComponent, {size: 'xl'});
        modalRef.componentInstance.userId = user.id;
    }

}
