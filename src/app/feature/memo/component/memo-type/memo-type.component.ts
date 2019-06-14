import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {MemoType} from '../../model/memoType';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {MemoTypeService} from '../../service/memo-type.service';
import {Action} from '../../../../@core/Action';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {MemoBaseComponent} from '../memo-base/memo-base.component';
import {MemoTypeFormComponent} from './memo-type-form/memo-type-form.component';
import {MemoTypeDeleteComponent} from './memo-type-form/memo-type-delete.component';

@Component({
    selector: 'app-memo-type',
    templateUrl: './memo-type.component.html',
    styleUrls: ['./memo-type.component.css']
})
export class MemoTypeComponent implements OnInit {
    static TITLE = `${MemoBaseComponent.TITLE} - Type`;
    page = 1;

    types: Array<MemoType>;

    search: string;
    spinner = false;
    pageable: Pageable = new Pageable();
    memoType: MemoType;

    constructor(
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private memoTypeService: MemoTypeService,
        private modalService: NgbModal,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) {
    }

    static loadData(other: MemoTypeComponent) {
        other.spinner = true;
        other.memoTypeService.getPaginationWithSearch(other.search, other.page, 10).subscribe((response: any) => {
                other.types = response.content;
                other.pageable = PaginationUtils.getPageable(response);
                other.spinner = false;
            }, error => {
                console.error(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Failed to Load Memo Types'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.breadcrumbService.notify(MemoTypeComponent.TITLE);
        MemoTypeComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;

        MemoTypeComponent.loadData(this);
    }

    onSearch() {
        MemoTypeComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = searchValue;

        MemoTypeComponent.loadData(this);
    }

    add() {
        const modalRef = this.modalService.open(MemoTypeFormComponent, {backdrop: 'static'});

        modalRef.componentInstance.model = new MemoType();
        modalRef.componentInstance.action = Action.ADD;

        ModalUtils.resolve(modalRef.result, MemoTypeComponent.loadData, this);
    }

    update(memoType: MemoType) {

        const modalRef = this.modalService.open(MemoTypeFormComponent, {backdrop: 'static'});

        modalRef.componentInstance.model = memoType;
        modalRef.componentInstance.action = Action.UPDATE;
        ModalUtils.resolve(modalRef.result, MemoTypeComponent.loadData, this);
    }

    delete(memoType: MemoType) {
        this.memoType = memoType;

        const modalRef = this.modalService.open(MemoTypeDeleteComponent);

        modalRef.componentInstance.model = memoType;
        modalRef.componentInstance.action = Action.DELETE;

        ModalUtils.resolve(modalRef.result, MemoTypeComponent.loadData, this);
    }
}
