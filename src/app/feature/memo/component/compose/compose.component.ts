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
import {MemoStage} from '../../model/MemoStage';
import {MemoFullRoute} from '../../memo-full-routes';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {LoanActionService} from '../../../loan/loan-action/service/loan-action.service';
import {Status} from '../../../../@core/Status';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'app-memo-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.css']
})
export class ComposeComponent implements OnInit {

    static TITLE = `${MemoBaseComponent.TITLE} - Compose`;

    isNewMemo: boolean;
    memoTask: string;
    memoTypes: MemoType[] = [];
    users: User[] = [];
    memo: Memo = new Memo();
    memoId: number;
    memoComposeForm: FormGroup;
    searchMemo: string;
    search: any = {};

    sendForwardUserList: User[] = [];

    editor = ClassicEditor;

    constructor(
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private memoService: MemoService,
        private memoTypeService: MemoTypeService,
        private loanActionService: LoanActionService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(ComposeComponent.TITLE);
        // this.getSendForwardUsers();
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
            this.memoTypes = response.content;
        }, error => console.error(error));
        this.userService.getPaginationWithSearchObject(this.search).subscribe((response: any) => {
            this.users = response.detail.content;
        }, error => console.error(error));

        this.buildMemoForm(this.memo);
    }

    buildMemoForm(memo: Memo) {
        this.memoComposeForm = this.formBuilder.group(
            {
                id: [memo.id, (memo.id === null || memo.id === 0 || memo.id === undefined) ? [] : Validators.required],
                subject: [memo.subject, [Validators.required, CustomValidator.notEmpty]],
                refNumber: [memo.refNumber, [Validators.required, CustomValidator.notEmpty]],
                type: [memo.type, Validators.required],
                stage: [memo.stage],
                stages: [ObjectUtil.isEmpty(memo.stages) ? [] : memo.stages],
                status: [ObjectUtil.isEmpty(memo.stages) ? Status.ACTIVE : memo.status],
                sentBy: [memo.sentBy],
                sentTo: [memo.sentTo, Validators.required],
                cc: [memo.cc],
                bcc: [memo.bcc],
                content: [memo.content, [Validators.required, CustomValidator.notEmpty]],
                version: [memo.version]
            }
        );
    }

    getSendForwardUsers() {
        this.loanActionService.getSendForwardList().subscribe( res => {
            console.log(res, 'list of fordable users');
            this.sendForwardUserList = res.detail;
        });
    }

    getAuthorizedUsers() {

    }

    setMemoValues() {
        this.memo = this.memoComposeForm.value;

        const sentByUser = new User();
        sentByUser.id = Number(LocalStorageUtil.getStorage().userId);
        this.memo.sentBy = sentByUser;
    }

    saveMemo(memo: Memo) {
        this.memoService.save(memo).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, memo.stage === 'DRAFT' ? 'SAVED MEMO AS DRAFT' : 'SUCCESSFULLY SENT MEMO'));
            this.router.navigate(memo.stage === 'DRAFT' ? [MemoFullRoute.DRAFT] : [MemoFullRoute.SENT]);

        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, memo.stage === 'DRAFT' ? 'UNABLE TO SAVE MEMO AS DRAFT' : 'UNABLE TO SEND MEMO'));
        });
    }

    updateMemo(memo: Memo) {
        this.memoService.update(memo.id, memo).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, memo.stage === 'DRAFT' ? 'SUCCESSFULLY UPDATED MEMO' : 'SUCCESSFULLY SENT MEMO'));
            this.router.navigate(memo.stage === 'DRAFT' ? [MemoFullRoute.DRAFT] : [MemoFullRoute.SENT]);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, memo.stage === 'DRAFT' ? 'UNABLE TO UPDATE MEMO AS DRAFT' : 'UNABLE TO SEND MEMO'));
        });
    }

    send() {
        this.setMemoValues();

        if (this.isNewMemo) {

            const stage = new MemoStage();
            stage.sentTo = this.memo.sentTo;
            stage.sentBy = this.memo.sentBy;
            stage.stage = 'FORWARD';
            stage.note = 'Memo Forwarded';

            this.memo.stage = 'FORWARD';

            this.memo.stages = new Array<MemoStage>();
            this.memo.stages.push(stage);
            this.saveMemo(this.memo);

        } else {
            if (this.memo.stage === 'BACKWARD') {
                this.memo.stage = 'FORWARD';
                const stage = new MemoStage();
                stage.sentTo = this.memo.sentTo;
                stage.sentBy = this.memo.sentBy;
                stage.stage = 'FORWARD';
                stage.note = 'Memo Forwarded';

                this.memo.stages.push(stage);

            } else {
                this.memo.stage = 'FORWARD';

                if ((this.memo.stages) && this.memo.stages.length === 1) {
                    const stage = this.memo.stages[0];
                    stage.sentBy = this.memo.sentBy;
                    stage.sentTo = this.memo.sentTo;
                    stage.stage = 'FORWARD';
                    stage.note = 'Memo Forwarded';
                }
            }
            this.updateMemo(this.memo);
        }
    }

    saveAsDraft() {
        this.setMemoValues();
        this.memo.stage = 'DRAFT';
        if (ObjectUtil.isEmpty(this.memo.id)) {
            this.saveMemo(this.memo);
        } else {
            const stage = this.memo.stages[0];
            stage.sentBy = this.memo.sentBy;
            stage.sentTo = this.memo.sentTo;
            stage.stage = 'DRAFT';
            stage.note = 'Updated as draft';
            this.updateMemo(this.memo);
        }
    }

    get subject() {
        return this.memoComposeForm.get('subject');
    }

    get refNumber() {
        return this.memoComposeForm.get('refNumber');
    }

    get type() {
        return this.memoComposeForm.get('type');
    }

    get sentTo() {
        return this.memoComposeForm.get('sentTo');
    }

    get content() {
        return this.memoComposeForm.get('content');
    }
}
