import {Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {MemoService} from '../../../service/memo.service';
import {MemoDataService} from '../../../service/memo-data.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-memo-view-button',
    templateUrl: './memo-view-button.component.html',
    styleUrls: ['./memo-view-button.component.css']
})
export class MemoViewButtonComponent implements OnInit, ICellRendererAngularComp {

    public params: any;
    memoApi: string;

    constructor(
        private memoService: MemoService,
        private memoDataService: MemoDataService,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        this.memoApi = this.memoDataService.getMemoApi();
    }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    getMemoById() {
        const id = this.params.api.getRowNode(this.params.node.rowIndex).data.id;
        this.router.navigate([`home/memo/read/${id}`]);
    }

}
