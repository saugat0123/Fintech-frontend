import {Component, OnInit} from '@angular/core';
import {CreditMemoFullRoutes} from '../../../feature/credit-memo/credit-memo-full-routes';
import {CreditMemoService} from '../../../feature/credit-memo/service/credit-memo.service';

@Component({
    selector: 'app-memo-details',
    templateUrl: './memo-details.component.html',
    styleUrls: ['./memo-details.component.scss']
})
export class MemoDetailsComponent implements OnInit {
    creditMemoFullRoutes = CreditMemoFullRoutes;

    pendingCount = '0';
    approvedCount = '0';
    rejectedCount = '0';

    constructor(private creditMemoService: CreditMemoService) {
    }

    ngOnInit() {
        this.creditMemoService.getStatus().subscribe(response => {
            console.log('resonse of memo details', response);
            this.approvedCount = response.detail.Approved;
            this.pendingCount = response.detail.Pending;
            this.rejectedCount = response.detail.Rejected;
        });
    }
}
