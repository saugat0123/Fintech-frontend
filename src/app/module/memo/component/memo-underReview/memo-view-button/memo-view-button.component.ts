import {Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {Memo} from "../../../model/memo";
import {MemoService} from "../../../service/memo.service";
import {MemoDataService} from "../../../service/memo-data.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-memo-view-button',
    templateUrl: './memo-view-button.component.html',
    styleUrls: ['./memo-view-button.component.css']
})
export class MemoViewButtonComponent implements OnInit, ICellRendererAngularComp {

    public params: any;
    memoById: Memo;
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
        let id = this.params.api.getRowNode(this.params.node.rowIndex).data.id;
        this.memoService.getById(this.memoApi, id).subscribe((response: any) => {
            this.memoById = response.detail;
            this.memoDataService.setMemo(this.memoById);
            this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                this.router.navigate(["home/memo/read"]));
        });
    }

}
