import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {MemoService} from '../../service/memo.service';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {MemoType} from '../../model/memoType';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddMemoTypeComponent} from './add-memo-type/add-memo-type.component';
import {MemoDeleteModalComponent} from '../memo-delete-modal/memo-delete-modal.component';
import {MemoDataService} from "../../service/memo-data.service";

declare var $;

@Component({
    selector: 'app-memo-type',
    templateUrl: './memo-type.component.html',
    styleUrls: ['./memo-type.component.css']
})
export class MemoTypeComponent implements OnInit {

    title = 'Memo Type';
    search = {};
    spinner = false;
    dataList: any;
    memoTypeApi: string;
    pageable: Pageable = new Pageable();
    globalMsg;

    constructor(
        private dataService: CommonDataService,
        private memoService: MemoService,
        private memoDataService: MemoDataService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoTypeApi = this.memoDataService.getMemoTypeApi();
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
        this.memoDataService.setMemoType(new MemoType());
        this.modalService.open(AddMemoTypeComponent);
    }

    openEdit(memoType: MemoType) {
        this.memoDataService.setMemoType(memoType);
        this.modalService.open(AddMemoTypeComponent);
    }

    openDelete(data) {
        this.dataService.setData(data);
        this.modalService.open(MemoDeleteModalComponent);
    }

    getPagination() {
        this.spinner = true;
        this.memoService.getAll(this.memoTypeApi, 1, 20, null).subscribe((response: any) => {
                this.dataList = response.content;
                this.dataService.setDataList(this.dataList);
                this.commonPageService.setCurrentApi(this.memoTypeApi);
                this.pageable = this.commonPageService.setPageable(response.content);

                this.spinner = false;

            }, error => {
                this.globalMsg = error.error.message;
                if (this.globalMsg == null) {
                    this.globalMsg = 'Please check your network connection';
                }
                this.spinner = false;
                this.dataService.getGlobalMsg(this.globalMsg);
                $('.global-msgModal').modal('show');
            }
        );

    }

}
