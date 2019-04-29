import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MemoDataService} from '../../../service/memo-data.service';
import {Memo} from '../../../model/memo';

@Component({
    selector: 'app-memo-backward',
    templateUrl: './memo-backward.component.html',
    styleUrls: ['./memo-backward.component.css']
})
export class MemoBackwardComponent implements OnInit, DoCheck {

    currentUrl: string;
    memo: Memo;

    constructor(
        private memoDataService: MemoDataService,
        private router: Router,
        private activeModal: NgbActiveModal
    ) {
    }

    ngOnInit() {
        this.memo = this.memoDataService.getMemo();
    }

    ngDoCheck(): void {
        this.currentUrl = this.router.url;
    }

    reloadPage() {
        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
            if (e) {
                this.router.navigate([this.currentUrl]);
                this.activeModal.close();
            }
        });
    }

    backwardMemo() {
    }

}
