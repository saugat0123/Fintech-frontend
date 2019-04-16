import {Component, DoCheck, ElementRef, OnInit, Renderer} from '@angular/core';
import {User} from '../../modal/user';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddUserComponent} from './add-user/add-user.component';
import {UpdateModalComponent} from '../../../../common/update-modal/update-modal.component';
declare var $;

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
        // private elRef: ElementRef, private renderer: Renderer
    ) {
    }

    ngOnInit() {
        // this.renderer.invokeElementMethod(
        //     this.elRef.nativeElement.ownerDocument.activeElement, 'blur');
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/user/get';
        this.getPagination();
        this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
            this.user = response.detail.user;
        });
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
            this.globalMsg = error.error.message;
            if (this.globalMsg == null) {
                this.globalMsg = 'Please check your network connection';
            }
            this.spinner = false;
            this.dataService.getGlobalMsg(this.globalMsg);
            $('.global-msgModal').modal('show');
        });

    }

    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) { document.activeElement.blur(); }
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

