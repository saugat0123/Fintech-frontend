import {Component, OnInit} from '@angular/core';
import {CommonDataService} from "../../../../shared-service/baseservice/common-dataService";
import {MemoService} from "../../memo.service";
import {CommonPageService} from "../../../../shared-service/baseservice/common-pagination-service";
import {Pageable} from "../../../../shared-service/baseservice/common-pageable";
import {MemoType} from "../../model/memoType";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddMemoTypeComponent} from "./add-memo-type/add-memo-type.component";
import {DeleteMemoTypeComponent} from "./delete-memo-type/delete-memo-type.component";

declare var $;

@Component({
    selector: 'app-memo-type',
    templateUrl: './memo-type.component.html',
    styleUrls: ['./memo-type.component.css']
})
export class MemoTypeComponent implements OnInit {

    title = "Memo Type";
    search = {};
    spinner: boolean = false;
    dataList: any;
    currentApi: string;
    pageable: Pageable = new Pageable();
    globalMsg;

    constructor(
        private dataService: CommonDataService,
        private memoService: MemoService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal
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
        this.dataService.setMemoType(new MemoType());
        this.modalService.open(AddMemoTypeComponent);
    }

    openEdit(memoType: MemoType) {
        this.dataService.setMemoType(memoType);
        this.modalService.open(AddMemoTypeComponent);
    }

    openDelete(data) {
        this.dataService.setData(data);
        this.modalService.open(DeleteMemoTypeComponent);
    }

    getPagination() {
        this.spinner = true;
        this.memoService.getAll(this.currentApi, 1, 20, null).subscribe((response: any) => {
                this.dataList = response.content;
                this.dataService.setDataList(this.dataList);
                this.commonPageService.setCurrentApi(this.currentApi);
                this.pageable = this.commonPageService.setPageable(response.content);

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
