import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {MemoService} from '../../service/memo.service';
import {MemoDataService} from '../../service/memo-data.service';
import {MemoViewButtonComponent} from './memo-view-button/memo-view-button.component';

@Component({
    selector: 'app-memo-under-review',
    templateUrl: './memo-underReview.component.html',
    styleUrls: ['./memo-underReview.component.css']
})
export class MemoUnderReviewComponent implements OnInit {

    title = 'Memo - Under Review';
    memoApi: string;

    spinner = false;
    globalMsg;

    public gridApi;
    public gridColumnApi;
    public columnDefs;
    public defaultColDef;
    public rowData: any;
    public paginationPageSize;
    public context;
    public frameworkComponents;

    constructor(
        private dataService: CommonDataService,
        private memoService: MemoService,
        private memoDataService: MemoDataService
    ) {
        this.columnDefs = [
            {
                headerName: 'ID',
                field: 'id',
                width: 100,
                suppressSizeToFit: true,
                sortable: true,
                filter: true,
                hide: true
            },
            {
                headerName: 'Memo Type',
                field: 'type.name',
                width: 110,
                sortable: true,
                filter: true
            },
            {
                headerName: 'Subject',
                field: 'subject',
                width: 110,
                sortable: true,
                filter: true
            },
            {
                headerName: 'Stage',
                field: 'stage',
                width: 80,
                sortable: true,
                filter: true
            },
            {
                headerName: 'Status',
                field: 'status',
                width: 80,
                sortable: true,
                filter: true
            },
            {
                headerName: 'View',
                width: 50,
                sortable: false,
                filter: false,
                cellRenderer: 'viewButtonComponent'
            }
        ];
        this.defaultColDef = {resizable: true};
        this.paginationPageSize = 10;
        this.context = {componentParent: this};

        this.frameworkComponents = {
            viewButtonComponent: MemoViewButtonComponent
        };
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoApi = this.memoDataService.getMemoApi();
    }

    sizeToFit() {
        this.gridApi.sizeColumnsToFit();
    }

    autoSizeAll() {
        const allColumnIds = [];
        this.gridColumnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.gridColumnApi.autoSizeColumns(allColumnIds);
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.memoService.getPageable(this.memoApi, 1, 20, null).subscribe((data: any) => {
            this.rowData = data.content;
        }, error => {
            this.globalMsg = error.error.message;
            if (this.globalMsg == null) {
                this.globalMsg = 'Please check your network connection';
            }
            this.spinner = false;
            this.dataService.getGlobalMsg(this.globalMsg);
        });

        this.sizeToFit();
    }

    onPageSizeChanged() {
        const value = (<HTMLInputElement>document.getElementById('page-size')).value;
        this.gridApi.paginationSetPageSize(Number(value));
    }

}
