import {Component, DoCheck, OnInit} from '@angular/core';
import {User} from '../../modal/user';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddUserComponent} from './add-user/add-user.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
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

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/user/get';
        this.getPagination();
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
        this.getPagination();
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        this.getPagination();
    }


    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(user: User) {
        this.dataService.setUser(user);
        this.modalService.open(AddUserComponent);
    }

    addUser() {
        this.dataService.setUser(new User());
        this.modalService.open(AddUserComponent);
    }


    getPagination() {
        this.spinner = true;
        this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
            this.dataList = response.detail.content;
            this.dataService.setDataList(this.dataList);
            this.commonPageService.setCurrentApi(this.currentApi);
            this.pageable = this.commonPageService.setPageable(response.detail);

            this.spinner = false;

        }, error => {

            console.log(error);

            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));

            this.spinner = false;
        });

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
