import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CbsGroupService} from '../service/cbs-group.service';
import {Province} from '../../admin/modal/province';
import {CbsGroup} from '../model/cbsGroup';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
    selector: 'app-tag-cbs-customer',
    templateUrl: './tag-cbs-customer.component.html',
    styleUrls: ['./tag-cbs-customer.component.scss']
})
export class TagCbsCustomerComponent implements OnInit {

    @Input()
    customerInfo: CustomerInfoData;
    list: Array<CbsGroup> = new Array<CbsGroup>();
    page = 1;
    size = 20;
    searchObj = {obligor: null};
    spinner = false;
    pageable: Pageable = new Pageable();
    selectedObl;
    showSaveBtn = false;
    @Output() stringValue: EventEmitter<String> = new EventEmitter();

    constructor(private cbsService: CbsGroupService, private toastService: ToastService) {
    }

    static loadData(other: TagCbsCustomerComponent) {
        other.spinner = true;
        other.cbsService.getPaginationWithSearchObject(other.searchObj, other.page, other.size).subscribe(response => {
            other.list = response.detail.content;
            other.list = other.list.filter(value => !ObjectUtil.isEmpty(value.obligor));
            other.pageable = PaginationUtils.getPageable(response.detail);
        }, error => {
            other.spinner = false;
            other.toastService.show(new Alert(AlertType.WARNING, error.error.message));
        });
        other.spinner = false;
    }

    ngOnInit() {

        if (!ObjectUtil.isEmpty(this.customerInfo)) {
            this.selectedObl = this.customerInfo.obligor;
        }
        TagCbsCustomerComponent.loadData(this);
    }

    onScrollDown() {
        if (this.pageable.totalElements > this.size) {
            this.size = this.size + 20;
            TagCbsCustomerComponent.loadData(this);
        }

        this.spinner = false;
    }

    onSearch(event) {
        this.spinner = true;
        this.page = 1;
        this.size = 20;
        this.searchObj.obligor = event.value;
        TagCbsCustomerComponent.loadData(this);
    }

    onSubmit() {
        this.stringValue.emit(this.selectedObl);
    }

    setValue(value) {
        this.selectedObl = value;
        if (ObjectUtil.isEmpty(this.selectedObl)) {
            this.showSaveBtn = false;
        } else {
            this.showSaveBtn = true;
        }
    }

    clear() {
        this.selectedObl = null;
        this.onSubmit();
    }

}
