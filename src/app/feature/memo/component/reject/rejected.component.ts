import {Component, OnInit} from '@angular/core';
import {MemoService} from '../../service/memo.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../../@core/utils';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Router} from '@angular/router';
import {MemoBaseComponent} from '../memo-base/memo-base.component';
import {MemoFullRoute} from '../../memo-full-routes';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-memo-under-review',
    templateUrl: './rejected.component.html',
})
export class RejectedComponent implements OnInit {

    static TITLE = `${MemoBaseComponent.TITLE} - Rejected`;

    page = 1;
    spinner = false;
    search: string;
    dataList: any;
    pageable: Pageable = new Pageable();

    constructor(
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private memoService: MemoService,
        private toastService: ToastService,
        private router: Router
    ) {
    }

    static loadData(other: RejectedComponent) {
        other.spinner = true;
        if (other.search === null || other.search === undefined) {
            other.search = `stage=BACKWARD&stages.sentTo.id=${LocalStorageUtil.getStorage().userId}`;
        }
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
        this.breadcrumbService.notify(RejectedComponent.TITLE);
        RejectedComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;

        RejectedComponent.loadData(this);
    }

    viewMemo(id: number) {
        this.router.navigate([`${MemoFullRoute.READ}${id}`]);
    }

}
