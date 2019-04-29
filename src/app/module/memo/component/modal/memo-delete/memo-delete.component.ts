import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MemoService} from '../../../service/memo.service';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MemoDataService} from '../../../service/memo-data.service';

declare var $;

@Component({
    selector: 'app-delete-memo-type',
    templateUrl: './memo-delete.component.html',
    styleUrls: ['./memo-delete.component.css']
})
export class MemoDeleteComponent implements OnInit, DoCheck {

    modalName: string;
    currentUrl: any;
    deleteApi: any;
    deleteId: number;
    globalMsg;

    constructor(
        private router: Router,
        private memoService: MemoService,
        private memoDataService: MemoDataService,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal
    ) {
    }

    ngOnInit() {
        this.deleteApi = this.memoDataService.getDeleteApi();

        if (this.deleteApi === this.memoDataService.getMemoApi()) {
            this.modalName = 'Memo';
            this.deleteId = this.memoDataService.getMemo().id;
        } else if (this.deleteApi === this.memoDataService.getMemoTypeApi()) {
            this.modalName = 'Memo Type';
            this.deleteId = this.memoDataService.getMemoType().id;
        }
    }

    ngDoCheck(): void {
        this.currentUrl = this.router.url;
    }

    deleteClick() {
        this.memoService.deleteById(this.deleteApi, this.deleteId).subscribe(result => {

                this.globalMsg = 'SUCCESSFULLY DELETED ' + this.modalName;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');

                $('.alert-custom').slideDown();

                this.reloadPage();

            }, error => {
                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');
                $('.alert-custom').slideDown();

            }
        );
        this.memoDataService.clearAll();
    }

    reloadPage() {
        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
            if (e) {
                this.router.navigate([this.currentUrl]);
                this.activeModal.close();
            }
        });
    }

}
