import {Component, OnInit} from '@angular/core';
import {CommonDataService} from "../../../../shared-service/baseservice/common-dataService";
import {CommonService} from "../../../../shared-service/baseservice/common-baseservice";
import {CommonPageService} from "../../../../shared-service/baseservice/common-pagination-service";
import {Pageable} from "../../../../shared-service/baseservice/common-pageable";
import {Memotype} from "../../model/memotype";

declare var $;

@Component({
    selector: 'app-memo-type',
    templateUrl: './memo-type.component.html',
    styleUrls: ['./memo-type.component.css']
})
export class MemoTypeComponent implements OnInit {

    title = "Memo Type";
    countMemoTypes: any = 10;
    search = {};
    spinner: boolean = false;
    dataList: any;
    currentApi: any;
    pageable: Pageable = new Pageable();
    globalMsg;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/memos/types';
        this.getPagination();
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

    addMemoType() {
        this.dataService.setMemoType(new Memotype());
        $('.add-memotype').modal('show');
    }


    newValue: any;

    onChange(newValue, data) {
        this.newValue = newValue;
        this.dataService.setData(data);
        // this.commonPageService.setCurrentApi('v1/memos/types');
        $('.updateStatus').modal('show');

    }

    openEdit(memotype: Memotype) {
        this.dataService.setMemoType(memotype);
        $('.add-memotype').modal('show');
    }

    openDelete(data) {
        this.dataService.setData(data);
        $('.deleteMemoType').modal('show');
    }

    getPagination() {
        this.spinner = true;
        // this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
                this.dataList = response.detail;
                console.log(this.dataList);
                this.dataService.setDataList(this.dataList);
                this.commonPageService.setCurrentApi(this.currentApi);
                this.pageable = this.commonPageService.setPageable(response.detail);

                this.spinner = false;

            }, error => {
                this.globalMsg = error.error.message;
                if (this.globalMsg == null) {
                    this.globalMsg = "Please check your network connection"
                }
                this.spinner = false;
                this.dataService.getGlobalMsg(this.globalMsg);
                $('.global-msgModal').modal('show');
            }
        );

    }

}
