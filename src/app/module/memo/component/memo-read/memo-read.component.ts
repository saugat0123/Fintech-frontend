import {Component, DoCheck, OnInit, TemplateRef} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Memo} from '../../model/memo';
import {ActivatedRoute, Router} from '@angular/router';
import {MemoService} from '../../service/memo.service';
import {MemoDataService} from '../../service/memo-data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../../../modal/user';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';

declare var $;

@Component({
    selector: 'app-memo-read',
    templateUrl: './memo-read.component.html',
    styleUrls: ['./memo-read.component.css']
})
export class MemoReadComponent implements OnInit, DoCheck {

    title = 'Memo - Read';
    memoApi: string;
    memo: Memo;
    modalRef: BsModalRef;
    globalMsg: string;
    currentUrl: string;
    memoForwardForm: FormGroup;
    memoBackwardForm: FormGroup;
    roles$: any;
    users$: Array<User>;
    search = new Object();

    constructor(
        private dataService: CommonDataService,
        private router: Router,
        private memoService: MemoService,
        private memoDataService: MemoDataService,
        private modalService: BsModalService,
        private activatedRoute: ActivatedRoute,
        private commonService: CommonService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoApi = this.memoDataService.getMemoApi();
        const memoId = +this.activatedRoute.snapshot.paramMap.get('id');
        this.memoService.getById(this.memoApi, memoId).subscribe((response: any) => {
            this.memo = response.detail;
        });

        this.roles$ = ['CEO', 'BDO', 'PDO'];
        this.commonService.getByPostAllPageable('v1/user/get', this.search, 1, 20).subscribe((response: any) => {
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
        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
            this.router.navigate([`home/memo/compose/${id}`]));
    }

    deleteMemo() {
        this.memoService.deleteById(this.memoDataService.getMemoApi(), this.memo.id).subscribe(result => {

                this.globalMsg = 'SUCCESSFULLY DELETED MEMO';
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');

                $('.alert-custom').slideDown();

                this.reloadPage();

            }, error => {
                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');
                $('.alert-custom').slideDown();

            }
        );
    }

    reloadPage() {
        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
            if (e) {
                this.router.navigate([this.currentUrl]);
                this.modalRef.hide();
            }
        });
    }


    showDeleteMemo(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    showForwardMemo(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    showBackwardMemo(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    backwardMemo() {
    }

    forwardMemo() {
    }

}
