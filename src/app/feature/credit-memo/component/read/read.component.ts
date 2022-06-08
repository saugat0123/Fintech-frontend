import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../@core/utils';
import {environment} from '../../../../../environments/environment';
import {ActionComponent} from '../action/action.component';
import {CreditMemoService} from '../../service/credit-memo.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CreditMemoFullRoutes} from '../../credit-memo-full-routes';
import {HttpErrorResponse} from '@angular/common/http';
import {DocAction} from '../../../loan/model/docAction';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {CreditMemo} from '../../model/credit-memo';
import {CreditMemoStage} from '../../model/credit-memo-stage';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {LoanDataHolder} from '../../../loan/model/loanData';

@Component({
    selector: 'app-read',
    templateUrl: './read.component.html',
    styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {
    RootUrl = ApiConfig.URL;

    vendor: string;
    memo: CreditMemo;
    spinner = false;

    activeUserId = Number(LocalStorageUtil.getStorage().userId);
    roleType = LocalStorageUtil.getStorage().roleType;

    currentMemoStage = '';

    signatureList = [];
    sortedList: CreditMemoStage[] = [];
    mergedSecurity = [];
    taggedLoans: LoanDataHolder [] = [];
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private activatedRoute: ActivatedRoute,
        private creditMemoService: CreditMemoService,
        private toastService: ToastService
    ) {
        this.vendor = environment.client;
    }

    ngOnInit() {
        this.spinner = true;
        const memoId = +this.activatedRoute.snapshot.paramMap.get('id');

        this.creditMemoService.detail(memoId).subscribe((response: any) => {
            this.memo = response.detail;
            this.currentMemoStage = String(this.memo.currentStage.docAction);
            this.signatureList = this.memo.distinctPreviousList;
            this.taggedLoans = this.memo.customerLoans;
            if (this.taggedLoans.length > 0) {
                this.taggedLoans.forEach((d) => {
                    if (d.securities.length > 0) {
                        d.securities.forEach((s) => {
                            this.mergedSecurity.push(s);
                        });
                    }
                });
            }
            this.sortedList.push(...this.memo.previousStages, this.memo.currentStage);
            let lastBackwardIndex = 0;
            this.sortedList.forEach((data, index) => {
                if (data.docAction.toString() === DocAction.value(DocAction.BACKWARD)) {
                    lastBackwardIndex = index;
                }
            });
            if (lastBackwardIndex !== 0) {
                this.sortedList.splice(0, lastBackwardIndex);
                if (this.sortedList.length === 1) {
                    this.sortedList.splice(0, 1);
                }
            }
            if (this.sortedList.length !== 0) {
                this.sortedList.splice(0, 1);
            }

            this.spinner = false;

        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error loading memo!'));
            this.spinner = false;
        });

    }

    memoAction(action) {
        const modalRef = this.modalService.open(ActionComponent, {backdrop: 'static'});

        modalRef.componentInstance.creditMemo = this.memo;
        modalRef.componentInstance.actionTitle = action;
    }

    editMemo(id: number) {
        this.router.navigate([`${CreditMemoFullRoutes.COMPOSE}/${id}`]);
    }

    viewAssociated() {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: this.memo.customerLoan[0].loan.id,
                customerId: this.memo.customerLoan[0].id,
                catalogue: true
            }
        }).then(() => {
            this.spinner = false;
        });
    }

    creditMemoHandler(index: number, length: number) {
        const roleName: string = this.signatureList[index].toRole.roleName.toLowerCase();
        if (roleName === 'branch manager' || roleName === 'bm') {
            return 'RECOMMENDED BY';
        }

        if (index === 0) {
            return 'INITIATED BY:';
        } else if (index === length - 1) {
            if (this.memo.documentStatus.toString() === 'APPROVED') {
                return 'APPROVED BY:';
            } else if (this.memo.documentStatus.toString() === 'REJECTED') {
                return 'REJECTED BY:';
            } else {
                return 'SUPPORTED BY:';
            }
        } else {
            return 'SUPPORTED BY:';
        }
    }

    downloadSpecificDocument(url: string, name: string): void {
        this.creditMemoService.downloadDocument(url).subscribe((response: any) => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(response);
            const toArray = url.split('.');
            const extension = toArray[toArray.length - 1];
            link.download = `${name}.${extension}`;
            link.click();
        }, error => {
            console.error(error);
            if (error instanceof HttpErrorResponse && error.status === 404) {
                this.toastService.show(new Alert(AlertType.ERROR, 'File is corrupted, please upload it again.'));
            }
        });
    }

    privewSpecificDocument(path: string, name: string,): void {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${path}?${Math.floor(Math.random() * 100) + 1}`;
        link.download = name;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }
}
