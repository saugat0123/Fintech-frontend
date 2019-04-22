import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {MemoType} from '../../model/memoType';
import {MemoService} from '../../memo.service';
import {Observable} from 'rxjs';
import {Memo} from '../../model/memo';
import {User} from '../../../../modal/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from "../../../../shared-service/baseservice/common-baseservice";
import {Router} from "@angular/router";

@Component({
    selector: 'app-memo-compose',
    templateUrl: './memo-compose.component.html',
    styleUrls: ['./memo-compose.component.css']
})
export class MemoComposeComponent implements OnInit {

    title = 'Memo - Compose';
    memoTypes$: Observable<MemoType[]>;
    users$: Observable<User[]>;
    memo: Memo = new Memo();
    selectedUser: User;
    memoComposeForm: FormGroup;
    search = {};

    constructor(
        private dataService: CommonDataService,
        private memoService: MemoService,
        private formBuilder: FormBuilder,
        private commonService: CommonService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoService.getAll('v1/memos/types', 1, 20, null).subscribe((response: any) => {
            this.memoTypes$ = response.content;
        });
        this.commonService.getByPostAllPageable("v1/user/get", this.search, 1, 10).subscribe((response: any) => {
            this.users$ = response.detail.content;
        });

        this.memoComposeForm = this.formBuilder.group(
            {
                subject: [''],
                referenceNo: [''],
                memoType: [undefined],
                sentBy: [undefined],
                sentTo: [undefined],
                cc: [undefined],
                bcc: [undefined],
                content: ['']
            }
        );
    }

    onSubmit() {
        this.memo.subject = this.memoComposeForm.get('subject').value;
        this.memo.referenceNo = this.memoComposeForm.get('referenceNo').value;
        this.memo.type = this.memoComposeForm.get('memoType').value;
        this.memo.sentBy = this.memoComposeForm.get('sentBy').value;
        this.memo.sentTo = this.memoComposeForm.get('sentTo').value;
        this.memo.cc = this.memoComposeForm.get('cc').value;
        this.memo.bcc = this.memoComposeForm.get('bcc').value;
        this.memo.content = this.memoComposeForm.get('content').value;

        console.log(this.memo);
        this.memoService.save("v1/memos", this.memo).subscribe((response: any) => {
            console.log(response.detail);
            this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
               this.router.navigate(["home/memo/underReview"]));
        }, error => {
            console.log(error);
        });
    }

}
