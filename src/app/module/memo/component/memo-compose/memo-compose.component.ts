import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {MemoType} from '../../model/memoType';
import {MemoService} from '../../service/memo.service';
import {Observable} from 'rxjs';
import {Memo} from '../../model/memo';
import {User} from '../../../../modal/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {ActivatedRoute, Router} from '@angular/router';
import {MemoDataService} from '../../service/memo-data.service';

@Component({
    selector: 'app-memo-compose',
    templateUrl: './memo-compose.component.html',
    styleUrls: ['./memo-compose.component.css']
})
export class MemoComposeComponent implements OnInit {

    isNewMemo: boolean;
    title = 'Memo - Compose';
    memoTask: string;
    memoTypes$: Observable<MemoType[]>;
    memoApi: string;
    memoTypeApi: string;
    users$: Observable<User[]>;
    memo: Memo = new Memo();
    memoId: any;
    memoComposeForm: FormGroup;
    search = {};

    constructor(
        private dataService: CommonDataService,
        private memoService: MemoService,
        private memoDataService: MemoDataService,
        private formBuilder: FormBuilder,
        private commonService: CommonService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoApi = this.memoDataService.getMemoApi();
        this.memoTypeApi = this.memoDataService.getMemoTypeApi();
        this.memoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (this.memoId === null || this.memoId === 0 || this.memoId === undefined) {
            this.isNewMemo = true;
            this.memoTask = 'Compose New';
            this.memo = new Memo();
        } else {
            this.isNewMemo = false;
            this.memoTask = 'Edit';
            this.memoService.getById(this.memoApi, Number(this.memoId)).subscribe((response: any) => {
                this.buildMemoForm(response.detail);
            }, error => console.error(error));
        }
        this.memoService.getAll(this.memoTypeApi).subscribe((response: any) => {
            this.memoTypes$ = response.content;
        }, error => console.error(error));
        this.commonService.getByPostAllPageable('v1/user/get', this.search, 1, 10).subscribe((response: any) => {
            this.users$ = response.detail.content;
        }, error => console.error(error));

        this.buildMemoForm(this.memo);
    }

    buildMemoForm(memo: Memo) {
        this.memoComposeForm = this.formBuilder.group(
            {
                id: [memo.id],
                subject: [memo.subject],
                referenceNo: [memo.referenceNo],
                memoType: [memo.type],
                sentBy: [memo.sentBy],
                sentTo: [memo.sentTo],
                cc: [memo.cc],
                bcc: [memo.bcc],
                content: [memo.content]
            }
        );
    }

    onSubmit() {
        this.memo.id = this.memoComposeForm.get('id').value;
        this.memo.subject = this.memoComposeForm.get('subject').value;
        this.memo.referenceNo = this.memoComposeForm.get('referenceNo').value;
        this.memo.type = this.memoComposeForm.get('memoType').value;
        this.memo.sentBy = this.memoComposeForm.get('sentBy').value;
        this.memo.sentTo = this.memoComposeForm.get('sentTo').value;
        this.memo.cc = this.memoComposeForm.get('cc').value;
        this.memo.bcc = this.memoComposeForm.get('bcc').value;
        this.memo.content = this.memoComposeForm.get('content').value;

        if (this.isNewMemo) {
            this.memoService.save(this.memoApi, this.memo).subscribe((response: any) => {
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/memo/underReview']));
            }, error => {
                console.error(error);
            });
        } else {
            this.memoService.edit(this.memoApi, this.memo, this.memo.id).subscribe((response: any) => {
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/memo/underReview']));
            }, error => {
                console.error(error);
            });
        }
    }

}
