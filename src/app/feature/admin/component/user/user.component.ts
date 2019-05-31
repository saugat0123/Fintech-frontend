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

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

    title = 'User';
    breadcrumb = 'User > List';
    dataList: Array<User>;

    page = 1;

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
        private service: UserService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
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

    changePage(page: number) {
        this.page = page;

        UserComponent.loadData(this);
    }

    onSearch() {
        UserComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        UserComponent.loadData(this);
    }

    edit(user: User) {
        const modalRef = this.modalService.open(UserFormComponent);
        modalRef.componentInstance.model = user;

        ModalUtils.resolve(modalRef.result, UserComponent.loadData, this);
    }

    add() {
        const modalRef = this.modalService.open(UserFormComponent);
        modalRef.componentInstance.model = new User();

        ModalUtils.resolve(modalRef.result, UserComponent.loadData, this);
    }

    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.newValue = newValue;
        this.modalService.open(UpdateModalComponent);
    }


    getCsv() {

        this.service.download(this.search).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = response.detail;
            link.download = response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

        });
    }

}
