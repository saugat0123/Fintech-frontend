import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Memo} from '../../model/memo';
import {ActivatedRoute, Router} from '@angular/router';
import {MemoService} from '../../service/memo.service';
import {MemoDataService} from '../../service/memo-data.service';
import {MemoDeleteComponent} from '../modal/memo-delete/memo-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MemoForwardComponent} from '../modal/memo-forward/memo-forward.component';
import {MemoBackwardComponent} from '../modal/memo-backward/memo-backward.component';

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
        private memoDataService: MemoDataService,
        private modalService: NgbModal,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoApi = this.memoDataService.getMemoApi();
        const memoId = +this.activatedRoute.snapshot.paramMap.get('id');
        this.memoService.getById(this.memoApi, memoId).subscribe((response: any) => {
            this.memo = response.detail;
        });
    }

    editMemo(id: number) {
        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
            this.router.navigate([`home/memo/compose/${id}`]));
    }

    openDelete(memo: Memo) {
        this.memoDataService.setMemo(memo);
        this.memoDataService.setDeleteApi(this.memoDataService.getMemoApi());
        this.modalService.open(MemoDeleteComponent);
    }

    forwardMemo(memo: Memo) {
        this.memoDataService.setMemo(memo);
        this.modalService.open(MemoForwardComponent);
    }

    backwardMemo(memo: Memo) {
        this.memoDataService.setMemo(memo);
        this.modalService.open(MemoBackwardComponent);
    }

}
