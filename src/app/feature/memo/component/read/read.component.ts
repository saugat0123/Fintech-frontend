import {Component, DoCheck, OnInit} from '@angular/core';
import {Memo} from '../../model/memo';
import {ActivatedRoute, Router} from '@angular/router';
import {MemoService} from '../../service/memo.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../../admin/modal/user';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {MemoBaseComponent} from '../memo-base/memo-base.component';
import {UserService} from '../../../admin/component/user/user.service';
import {ForwardActionComponent} from '../actions/forward-action.component';
import {ApproveActionComponent} from '../actions/approve-action.component';
import {RejectActionComponent} from '../actions/reject-action.component';
import {MemoFullRoute} from '../../memo-full-routes';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-memo-read',
    templateUrl: './read.component.html',
    styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit, DoCheck {

    static TITLE = `${MemoBaseComponent.TITLE} - Read`;
    vendor: String;
    memo: Memo;
    modalRef: NgbModalRef;
    currentUrl: string;
    memoForwardForm: FormGroup;
    memoBackwardForm: FormGroup;
    roles$: any;
    users$: Array<User>;
    search = new Object();

    constructor(
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private router: Router,
        private memoService: MemoService,
        private modalService: NgbModal,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) {
        this.vendor = environment.client;
    }

    ngOnInit() {
        this.breadcrumbService.notify(ReadComponent.TITLE);
        const memoId = +this.activatedRoute.snapshot.paramMap.get('id');
        this.memoService.detail(memoId).subscribe((response: any) => {
            this.memo = response.detail;
            console.log(this.memo);
        });

        this.roles$ = ['CEO', 'BDO', 'PDO'];
        this.userService.getPaginationWithSearchObject(this.search, 1, 20).subscribe((response: any) => {
            this.users$ = response.detail.content;
        });

        this.buildForwardForm();
        this.buildBackwardForm();
    }

    ngDoCheck(): void {
        this.currentUrl = this.router.url;
    }

    buildForwardForm() {
        this.memoForwardForm = this.formBuilder.group(
            {
                forwardRole: [undefined],
                forwardUser: [undefined],
                comment: [undefined]
            }
        );
    }

    buildBackwardForm() {
        this.memoBackwardForm = this.formBuilder.group(
            {
                comment: [undefined]
            }
        );
    }

    editMemo(id: number) {
        this.router.navigate([`${MemoFullRoute.COMPOSE}/${id}`]);
    }

    deleteMemo() {
        this.memoService.delete(this.memo.id).subscribe(result => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Removed Memo'));
                this.reloadPage();

            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Remove Memo'));
            }
        );
    }

    reloadPage() {
        this.router.navigate([MemoFullRoute.REVIEW]);
    }

    backward() {
        const modalRef = this.modalService.open(RejectActionComponent);
        modalRef.componentInstance.memo = this.memo;
        modalRef.componentInstance.users$ = this.users$;
        modalRef.componentInstance.roles$ = this.roles$;

        modalRef.result.then(() => {
                console.log('success');

                this.reloadPage();
            },
            () => {
                console.log('failure');
            });
    }

    forward() {
        const modalRef = this.modalService.open(ForwardActionComponent);
        modalRef.componentInstance.memo = this.memo;
        modalRef.componentInstance.users$ = this.users$;
        modalRef.componentInstance.roles$ = this.roles$;

        modalRef.result.then(() => {
                console.log('success');

                this.reloadPage();
            },
            () => {
                console.log('failure');
            });
    }

    approve() {
        const modalRef = this.modalService.open(ApproveActionComponent);
        modalRef.componentInstance.memo = this.memo;
        modalRef.componentInstance.users$ = this.users$;
        modalRef.componentInstance.roles$ = this.roles$;

        modalRef.result.then(() => {
                console.log('success');

                this.reloadPage();
            },
            () => {
                console.log('failure');
            });
    }

}
