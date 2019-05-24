import {Component, DoCheck, OnInit} from '@angular/core';
import {User} from '../../modal/user';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserFormComponent} from './user-form/user-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit, DoCheck {

    title = 'User';
    breadcrumb = 'User > List';
    dataList: Array<User>;

    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    user: User;
    newValue: string;
    users: number;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: any) {
        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, 1, 10).subscribe((response: any) => {
            other.dataList = response.detail.content;
            other.dataService.setDataList(other.dataList);
            other.commonPageService.setCurrentApi(other.currentApi);
            other.pageable = other.commonPageService.setPageable(response.detail);

            other.spinner = false;

        }, error => {

            console.log(error);

            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));

            other.spinner = false;
        });

    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/user/get';

        UserComponent.loadData(this);

        // this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
        //     this.user = response.detail.user;
        // });
        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.users = response.detail.users;

        });


    }

    onSearch() {
        this.dataService.setData(this.search);
        UserComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        UserComponent.loadData(this);
    }


    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(user: User) {
        this.dataService.setUser(user);
        ModalUtils.resolve(this.modalService.open(UserFormComponent).result, UserComponent.loadData, this);
    }

    addUser() {
        this.dataService.setUser(new User());
        ModalUtils.resolve(this.modalService.open(UserFormComponent).result, UserComponent.loadData, this);
    }

    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/user');
        this.modalService.open(UpdateModalComponent);

    }


    getCsv() {

        this.commonService.saveOrEdit(this.search, 'v1/user/csv').subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = response.detail;
            link.download = response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

        });
    }

}
