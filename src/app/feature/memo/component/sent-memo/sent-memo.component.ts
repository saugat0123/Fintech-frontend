import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {MemoService} from '../../service/memo.service';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-sent-memo',
    templateUrl: './sent-memo.component.html',
    styleUrls: ['./sent-memo.component.scss']
})
export class SentMemoComponent implements OnInit {
    page = 1;
    spinner = false;
    search: string;
    dataList: any;
    pageable: Pageable = new Pageable();

    constructor(
        private memoService: MemoService,
        private toastService: ToastService,
        private router: Router
    ) {
    }

  static loadData(other: SentMemoComponent) {
    other.spinner = true;
    if (other.search === null || other.search === undefined) {
      other.search = `stage=FORWARD&sentBy.id=${LocalStorageUtil.getStorage().userId}`;
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
      SentMemoComponent.loadData(this);
    }

  changePage(page: number) {
    this.page = page;
    SentMemoComponent.loadData(this);
  }

  viewMemo(id: number) {
    this.router.navigate([`home/memo/read/${id}`]);
  }

}
