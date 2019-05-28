import {Component, OnInit} from '@angular/core';
import {MemoService} from '../../service/memo.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../../@core/utils';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Router} from '@angular/router';

@Component({
    selector: 'app-memo-under-review',
    templateUrl: './memo-underReview.component.html',
    styleUrls: ['./memo-underReview.component.css']
})
export class MemoUnderReviewComponent implements OnInit {

    static TITLE = 'Memo - Under Review';

    page = 1;
    spinner = false;
    globalMsg;
    search: string;
    dataList: any;
    pageable: Pageable = new Pageable();

    constructor(
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private memoService: MemoService,
        private toastService: ToastService,
        private router: Router
    ) {}

    static loadData(other: MemoUnderReviewComponent) {
        other.spinner = true;
        other.memoService.getPaginationWithSearch(other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.content;
                other.pageable = PaginationUtils.getPageable(response);
                other.spinner = false;
            }, error => {
                console.error(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Failed to Load Memos'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.breadcrumbService.notify(MemoUnderReviewComponent.TITLE);
        MemoUnderReviewComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;

        MemoUnderReviewComponent.loadData(this);
    }

    viewMemo(id: number) {
        this.router.navigate([`home/memo/read/${id}`]);
    }

}
