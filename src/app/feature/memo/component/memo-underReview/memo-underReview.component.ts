import {Component, OnInit} from '@angular/core';
import {MemoService} from '../../service/memo.service';
import {MemoViewButtonComponent} from './memo-view-button/memo-view-button.component';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../../@core/utils';

@Component({
    selector: 'app-memo-under-review',
    templateUrl: './memo-underReview.component.html',
    styleUrls: ['./memo-underReview.component.css']
})
export class MemoUnderReviewComponent implements OnInit {

    static TITLE = 'Memo - Under Review';

    spinner = false;
    globalMsg;
    search: string;

    public gridApi;
    public gridColumnApi;
    public columnDefs;
    public defaultColDef;
    public rowData: any;
    public paginationPageSize;
    public context;
    public frameworkComponents;

    constructor(
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private memoService: MemoService,
        private toastService: ToastService
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
        this.breadcrumbService.notify(MemoUnderReviewComponent.TITLE);
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

        this.memoService.getPaginationWithSearch(this.search).subscribe((data: any) => {
            this.rowData = data.content;
        }, error => {

            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Fetch Memo'));
            this.spinner = false;
        });

        this.sizeToFit();
    }

    onPageSizeChanged() {
        const value = (<HTMLInputElement>document.getElementById('page-size')).value;
        this.gridApi.paginationSetPageSize(Number(value));
    }

}
