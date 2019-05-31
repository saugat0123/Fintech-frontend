import {Component, DoCheck, OnInit, TemplateRef} from '@angular/core';
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

@Component({
    selector: 'app-memo-read',
    templateUrl: './memo-read.component.html',
    styleUrls: ['./memo-read.component.css']
})
export class MemoReadComponent implements OnInit, DoCheck {

    static TITLE = `${MemoBaseComponent.TITLE} - Read`;
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
    }

    ngOnInit() {
        this.breadcrumbService.notify(MemoReadComponent.TITLE);
        const memoId = +this.activatedRoute.snapshot.paramMap.get('id');
        this.memoService.detail(memoId).subscribe((response: any) => {
            this.memo = response.detail;
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
        this.router.navigate([`home/memo/compose/${id}`]);
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
        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
            if (e) {
                this.router.navigate([this.currentUrl]);
                this.modalRef.dismiss();
            }
        });
    }


    showDeleteMemo(template: TemplateRef<any>) {
        this.modalRef = this.modalService.open(template);
    }

    showForwardMemo(template: TemplateRef<any>) {
        this.modalRef = this.modalService.open(template);
    }

    showBackwardMemo(template: TemplateRef<any>) {
        this.modalRef = this.modalService.open(template);
    }

    backwardMemo() {
    }

    forwardMemo() {
    }

}
