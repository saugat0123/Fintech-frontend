import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../shared-service/baseservice/common-pagination-service';
import {Pageable} from '../../../../../shared-service/baseservice/common-pageable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MsgModalComponent} from '../../../../../common/msg-modal/msg-modal.component';


@Component({
    selector: 'app-ui',
    templateUrl: './ui.component.html',
    styleUrls: ['./ui.component.css']
})
export class UIComponent implements OnInit {
    spinner = false;
    title: string;
    pageable: Pageable = new Pageable();
    search = {};
    globalMsg: any;
    documentList: any;
    comfirmDocumentList = Array<Document>();
    currentApi: any;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal
    ) {

    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/document/get';
        this.getPagination();


    }

    getPagination() {
        this.spinner = true;
        this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
            this.documentList = response.detail.content;
            this.dataService.setDataList(this.documentList);
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
            this.modalService.open(MsgModalComponent);
        });

    }

    updateSelectDocument(document) {
        const d: Document = document;
        this.comfirmDocumentList.push(d);
        this.documentList.splice(this.documentList.indexOf(d), 1);
    }


    updateUnselectDocument(document) {
        const d: Document = document;
        this.documentList.push(d);
        this.comfirmDocumentList.splice(this.comfirmDocumentList.indexOf(d), 1);
    }


}
