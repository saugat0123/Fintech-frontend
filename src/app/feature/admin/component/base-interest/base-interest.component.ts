import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseInterestService} from '../../service/base-interest.service';
import {BaseInterest} from './BaseInterest';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseInterestFormComponent} from './base-interest-form/base-interest-form.component';


@Component({
    selector: 'app-base-interest',
    templateUrl: './base-interest.component.html',
    styleUrls: ['./base-interest.component.scss'],
})
export class BaseInterestComponent implements OnInit {
    title = 'Base Interest';
    page = 1;
    search: any = {};

    pageable: Pageable = new Pageable();
    datalist: Array<BaseInterest>;
    listing: Array<BaseInterest>;
    public baseList: BaseInterest;
    public list: BaseInterest[] = [];
    formGroups: FormGroup;
    submitted = false;
    spinner = false;
    constructor(private formBuilder: FormBuilder,
                private baseInterestService: BaseInterestService,
                private toastService: ToastService,
                private modalService: NgbModal,
                private breadcrumbService: BreadcrumbService) {
    }

    static loadData(other: BaseInterestComponent) {
        other.spinner = true;
        other.baseInterestService.getPaginationWithSearchObject(other.search, other.page, 5).subscribe((response: any) => {
            other.listing = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);

            other.spinner = false;

        }, error => {

            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));

            other.spinner = false;
        });

    }

    ngOnInit() {
        this.formGroups = this.formBuilder.group({
            rate: [undefined, Validators.required]
        });
        this.GetInterestData();
        this.breadcrumbService.notify(this.title);
        BaseInterestComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        BaseInterestComponent.loadData(this);
    }

    onsubmit(inter: BaseInterest) {
        this.baseInterestService.save(inter).subscribe((data: any) => {
            this.baseList = data;
            this.GetInterestData();
            this.add();

        });


    }

    GetInterestData() {
        this.baseInterestService.getAll().subscribe((data: any) => {
            this.datalist = data;

        });
    }



    add() {
        const modalRef = this.modalService.open(BaseInterestFormComponent);
        modalRef.componentInstance.model = new BaseInterest();
        ModalUtils.resolve(modalRef.result, BaseInterestComponent.loadData, this);
    }

}

