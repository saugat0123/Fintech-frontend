import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MemoService} from '../../service/memo.service';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

declare var $;

@Component({
    selector: 'app-delete-memo-type',
    templateUrl: './memo-delete-modal.component.html',
    styleUrls: ['./memo-delete-modal.component.css']
})
export class MemoDeleteModalComponent implements OnInit, DoCheck {

    modalData: any = {};
    data: any;
    currentUrl: any;
    currentApi: any;
    globalMsg;

    constructor(
        private router: Router,
        private memoService: MemoService,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal
    ) {
    }

    ngOnInit() {
        this.modalData = {
            'name': 'Memo Type'
        };

        this.currentApi = 'v1/memos/types';
    }

    ngDoCheck(): void {
        this.currentUrl = this.router.url;
        if (this.dataService.getData() != null) {
            this.data = this.dataService.getData();
        }
    }

    deleteClick() {
        this.memoService.deleteById(this.currentApi, this.data.id).subscribe(result => {

                this.globalMsg = 'SUCCESSFULLY DELETED MEMO TYPE';
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
