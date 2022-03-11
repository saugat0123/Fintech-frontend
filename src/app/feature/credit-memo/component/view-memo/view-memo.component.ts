import { Component, OnInit } from '@angular/core';
import {CreditMemoFullRoutes} from '../../credit-memo-full-routes';
import {DocStatus} from '../../../loan/model/docStatus';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {CreditMemoService} from '../../service/credit-memo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../@core/utils';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CreditMemo} from '../../model/credit-memo';

@Component({
  selector: 'app-view-memo',
  templateUrl: './view-memo.component.html'
})
export class ViewMemoComponent implements OnInit {
  memoTitle = '';
  search = {};

  page = 1;
  spinner = false;
  memoList: CreditMemo[] = [];
  pageable: Pageable = new Pageable();

  constructor(private activatedRoute: ActivatedRoute,
              private toastService: ToastService,
              private router: Router,
              private creditMemoService: CreditMemoService
  ) {
  }

  static loadData(other: ViewMemoComponent) {
    other.spinner = true;
    other.creditMemoService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
        console.log( response , ':::::views')
          other.memoList = response.detail.content;
          other.pageable = PaginationUtils.getPageable(response.detail);
          other.spinner = false;
        }, error => {
          console.error(error);
          other.toastService.show(new Alert(AlertType.ERROR, 'Failed to Load Memos'));
          other.spinner = false;
        }
    );
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(params => {
      switch (params[0].path) {
        case 'inbox': {
          this.search = {
            documentStatus: DocStatus.value(DocStatus.PENDING)
          };
          ViewMemoComponent.loadData(this);
          this.memoTitle = 'Inbox';
          break;
        }
        case 'rejected': {
          this.search = {
            documentStatus: DocStatus.value(DocStatus.REJECTED)
          };
          ViewMemoComponent.loadData(this);
          this.memoTitle = 'Rejected';
          break;
        }
        case 'approved': {
          this.search = {
            documentStatus: DocStatus.value(DocStatus.APPROVED)
          };
          ViewMemoComponent.loadData(this);
          this.memoTitle = 'Approved';
          break;
        }
      }
    });
    ViewMemoComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    ViewMemoComponent.loadData(this);
  }

  viewMemo(id: number) {
    this.router.navigate([`${CreditMemoFullRoutes.READ}/${id}`]);
  }
}
