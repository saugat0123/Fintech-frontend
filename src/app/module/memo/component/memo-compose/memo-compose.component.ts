import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {MemoType} from '../../model/memoType';
import {MemoService} from '../../memo.service';
import {Observable} from 'rxjs';
import {Memo} from '../../model/memo';
import {User} from '../../../../modal/user';
import {FormBuilder, FormGroup} from '@angular/forms';

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
    ccUsers: Array<User>;
    bccUsers: Array<User>;
    selectedUser: User;
    memoComposeForm: FormGroup;

    constructor(
        private dataService: CommonDataService,
        private memoService: MemoService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoService.getAll('v1/memos/types', 1, 20, null).subscribe((response: any) => {
            this.memoTypes$ = response.content;
        });

        this.memoComposeForm = this.formBuilder.group(
            {
                subject: [''],
                referenceNo: [''],
                memoType: [undefined],
                sentTo: [''],
                cc: [''],
                bcc: [''],
                content: ['']
            }
        );
    }

    onSubmit() {

    }

}
