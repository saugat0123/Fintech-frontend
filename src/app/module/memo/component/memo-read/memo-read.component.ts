import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Memo} from "../../model/memo";
import {Router} from "@angular/router";
import {MemoService} from "../../service/memo.service";
import {MemoDataService} from "../../service/memo-data.service";

@Component({
    selector: 'app-memo-read',
    templateUrl: './memo-read.component.html',
    styleUrls: ['./memo-read.component.css']
})
export class MemoReadComponent implements OnInit {

    title = 'Memo - Read';
    memoApi: string;
    memo: Memo;

    constructor(
        private dataService: CommonDataService,
        private router: Router,
        private memoService: MemoService,
        private memoDataService: MemoDataService
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoApi = this.memoDataService.getMemoApi();

        if (this.memoDataService.getMemo().id == undefined) {
            this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                this.router.navigate(['home/memo/underReview']));
        } else {
            this.memo = this.memoDataService.getMemo();
        }
    }

    editMemo(id: number) {
        this.memoDataService.isNewMemo = false;
        this.memoService.getById(this.memoApi, id).subscribe((response: any) => {
            this.memoDataService.setMemo(response.detail);
        });

        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
            this.router.navigate(['home/memo/compose']));
    }

    openDelete() {

    }

}
