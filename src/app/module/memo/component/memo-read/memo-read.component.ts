import {Component, DoCheck, OnInit, TemplateRef} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Memo} from '../../model/memo';
import {ActivatedRoute, Router} from '@angular/router';
import {MemoService} from '../../service/memo.service';
import {MemoDataService} from '../../service/memo-data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {User} from '../../../admin/modal/user';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-memo-read',
    templateUrl: './memo-read.component.html',
    styleUrls: ['./memo-read.component.css']
})
export class MemoReadComponent implements OnInit, DoCheck {

    title = 'Memo - Read';
    memoApi: string;
    memo: Memo;
    modalRef: NgbModalRef;
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
        private modalService: NgbModal,
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

                this.globalMsg = 'Successfully Removed Memo';
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.reloadPage();

            }, error => {
                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

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
