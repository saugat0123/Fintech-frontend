import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ToastService} from '../../../../@core/utils';
import {CreditMemo} from '../../model/CreditMemo';

@Component({
    selector: 'app-view-memo',
    templateUrl: './view-memo.component.html',
    styleUrls: ['./view-memo.component.scss']
})
export class ViewMemoComponent implements OnInit {
    memoTitle = '';
    searchString = '';
    routeToString = '';

    page = 1;
    spinner = false;
    memoList: CreditMemo[] = [];
    pageable: Pageable = new Pageable();

    constructor(private activatedRoute: ActivatedRoute,
                private toastService: ToastService,
                private router: Router
    ) {
    }

    static loadData(other: ViewMemoComponent) {
        other.spinner = true;
        // TODO: set search string in respective switch cases--
        /*if (other.searchString === null || other.searchString === undefined) {
          other.searchString = `stage=FORWARD&sentTo.id=${LocalStorageUtil.getStorage().userId}`;
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
        );*/
    }


    ngOnInit() {
        this.activatedRoute.url.subscribe(params => {
            console.log(params[0].path);
            switch (params[0].path) {
                case 'under-review': {
                    this.memoTitle = 'Under Review';
                    break;
                }
                case 'draft': {
                    this.memoTitle = 'Draft';
                    break;
                }
                case 'rejected': {
                    this.memoTitle = 'Rejected';
                    break;
                }
                case 'approved': {
                    this.memoTitle = 'Approved';
                    break;
                }
                case 'backward': {
                    this.memoTitle = 'Backward';
                    break;
                }
                case 'sent': {
                    this.memoTitle = 'Sent';
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
        // TODO: set appropriate route link for read memo action--
        this.router.navigate([`home/memo/read/${id}`]);
    }


}
