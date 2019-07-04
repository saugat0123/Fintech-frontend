import {Component, OnInit} from '@angular/core';
import {MemoType} from '../../model/memoType';
import {MemoService} from '../../service/memo.service';
import {Observable} from 'rxjs';
import {Memo} from '../../model/memo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../admin/modal/user';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {MemoTypeService} from '../../service/memo-type.service';
import {UserService} from '../../../admin/component/user/user.service';
import {MemoBaseComponent} from '../memo-base/memo-base.component';
import {CustomValidator} from '../../../../@core/validator/custom-validator';

@Component({
    selector: 'app-memo-compose',
    templateUrl: './memo-compose.component.html',
    styleUrls: ['./memo-compose.component.css']
})
export class MemoComposeComponent implements OnInit {

    static TITLE = `${MemoBaseComponent.TITLE} - Compose`;

    isNewMemo: boolean;
    memoTask: string;
    memoTypes$: Observable<MemoType[]>;
    users$: Observable<User[]>;
    memo: Memo = new Memo();
    memoId: number;
    memoComposeForm: FormGroup;
    searchMemo: string;
    search: any = {};

    constructor(
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private memoService: MemoService,
        private memoTypeService: MemoTypeService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(MemoComposeComponent.TITLE);
        this.memoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (this.memoId === null || this.memoId === 0 || this.memoId === undefined) {
            this.isNewMemo = true;
            this.memoTask = 'Compose New';
            this.memo = new Memo();
        } else {
            this.isNewMemo = false;
            this.memoTask = 'Edit';
            this.breadcrumbService.notify('Memo - Edit');
            this.memoService.detail(Number(this.memoId)).subscribe((response: any) => {
                this.memo = response.detail;
                this.buildMemoForm(this.memo);
            }, error => console.error(error));
        }
        this.memoTypeService.getPaginationWithSearch(this.searchMemo).subscribe((response: any) => {
            this.memoTypes$ = response.content;
        }, error => console.error(error));
        this.userService.getPaginationWithSearchObject(this.search).subscribe((response: any) => {
            this.users$ = response.detail.content;
        }, error => console.error(error));

        this.buildMemoForm(this.memo);
    }

    buildMemoForm(memo: Memo) {
        this.memoComposeForm = this.formBuilder.group(
            {
                id: [memo.id, (memo.id === null || memo.id === 0 || memo.id === undefined) ? [] : Validators.required],
                subject: [memo.subject, [Validators.required, CustomValidator.notEmpty]],
                refNumber: [memo.refNumber, [Validators.required, CustomValidator.notEmpty]],
                memoType: [memo.type, Validators.required],
                sentBy: [memo.sentBy, Validators.required],
                sentTo: [memo.sentTo, Validators.required],
                cc: [memo.cc],
                bcc: [memo.bcc],
                content: [memo.content, [Validators.required, CustomValidator.notEmpty]]
            }
        );
    }

    onSubmit() {
        this.memo.id = this.memoComposeForm.get('id').value;
        this.memo.subject = this.memoComposeForm.get('subject').value;
        this.memo.refNumber = this.memoComposeForm.get('refNumber').value;
        this.memo.type = this.memoComposeForm.get('memoType').value;
        this.memo.sentBy = this.memoComposeForm.get('sentBy').value;
        this.memo.sentTo = this.memoComposeForm.get('sentTo').value;
        this.memo.cc = this.memoComposeForm.get('cc').value;
        this.memo.bcc = this.memoComposeForm.get('bcc').value;
        this.memo.content = this.memoComposeForm.get('content').value;

        if (this.isNewMemo) {
            this.memoService.save(this.memo).subscribe((response: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Created Memo'));

                this.router.navigate(['home/memo/underReview']);

            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Create Memo'));
            });
        } else {
            this.memoService.update(this.memo.id, this.memo).subscribe((response: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Memo'));
                this.router.navigate(['home/memo/underReview']);
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Memo'));
            });
        }
    }

    get subject() {
        return this.memoComposeForm.get('subject');
    }

    get refNumber() {
        return this.memoComposeForm.get('refNumber');
    }

    get memoType() {
        return this.memoComposeForm.get('memoType');
    }
    get sentBy() {
        return this.memoComposeForm.get('sentBy');
    }

    get sentTo() {
        return this.memoComposeForm.get('sentTo');
    }

    get content() {
        return this.memoComposeForm.get('content');
    }

}
