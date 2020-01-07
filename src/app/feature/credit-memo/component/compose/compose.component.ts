import {Component, OnInit} from '@angular/core';
import {User} from '../../../admin/modal/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreditMemo} from '../../model/CreditMemo';
import {CreditMemoType} from '../../model/CreditMemoType';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {UserService} from '../../../admin/component/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../@core/utils';
import {CustomValidator} from '../../../../@core/validator/custom-validator';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Status} from '../../../../@core/Status';

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

    isNewMemo: boolean;
    memoTask: string;
    memoTypes: CreditMemoType[] = [];
    users: User[] = [];
    forwardUsers: User[] = [];
    memo: CreditMemo = new CreditMemo();
    memoId: number;
    memoComposeForm: FormGroup;
    searchMemo: string;
    search: any = {};

    sendForwardUserList: User[] = [];

    editor = ClassicEditor;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService
    ) {
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

    ngOnInit() {
        this.memoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (this.memoId === null || this.memoId === 0 || this.memoId === undefined) {
            this.isNewMemo = true;
            this.memoTask = 'Compose New';
            this.memo = new CreditMemo();
        } else {
            this.isNewMemo = false;
            this.memoTask = 'Edit';
            // TODO: add respective services--
            /*this.memoService.detail(Number(this.memoId)).subscribe((response: any) => {
              this.memo = response.detail;
              if (this.memo.stage === 'BACKWARD') {
                this.memo.sentTo = this.memo.sentBy;
              }
              this.buildMemoForm(this.memo);
            }, error => console.error(error));*/
        }
        this.buildMemoForm(this.memo);
    }

    buildMemoForm(memo: CreditMemo) {
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

  send() {
  }

  saveAsDraft() {
  }
}
