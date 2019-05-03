import {Component, DoCheck, OnInit, TemplateRef} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {MemoService} from '../../service/memo.service';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {MemoType} from '../../model/memoType';
import {MemoDataService} from '../../service/memo-data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

declare var $;

@Component({
    selector: 'app-memo-type',
    templateUrl: './memo-type.component.html',
    styleUrls: ['./memo-type.component.css']
})
export class MemoTypeComponent implements OnInit, DoCheck {

    title = 'Memo Type';
    search: String;
    spinner = false;
    dataList: any;
    memoTypeApi: string;
    currentUrl: string;
    task: string;
    isNewMemo: boolean;
    pageable: Pageable = new Pageable();
    globalMsg;
    memoType: MemoType;
    modalRef: BsModalRef;
    memoTypeForm: FormGroup;

    constructor(
        private dataService: CommonDataService,
        private memoService: MemoService,
        private memoDataService: MemoDataService,
        private commonPageService: CommonPageService,
        private modalService: BsModalService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.memoTypeApi = this.memoDataService.getMemoTypeApi();
        this.getPagination();
    }

    ngDoCheck(): void {
        this.currentUrl = this.router.url;
    }

    onSearch() {
        this.dataService.setData(this.search);
        this.getPagination();
    }

    onSearchChange(searchValue: string) {
        this.search = searchValue;

        this.dataService.setData(this.search);
        this.getPagination();
    }

    buildForm() {
        this.memoTypeForm = this.formBuilder.group(
            {
                id: [this.memoType.id == null ? '' : this.memoType.id],
                name: [this.memoType.name == null ? '' : this.memoType.name],
                status: [this.memoType.status == null ? 'ACTIVE' : this.memoType.status]
            }
        );
    }

    addMemoType(template: TemplateRef<any>) {
        this.isNewMemo = true;
        this.task = 'Add';
        this.memoType = new MemoType();
        this.buildForm();
        this.modalRef = this.modalService.show(template);
    }

    openEdit(memoType: MemoType, template: TemplateRef<any>) {
        this.isNewMemo = false;
        this.task = 'Edit';
        this.memoType = memoType;
        this.buildForm();
        this.modalRef = this.modalService.show(template);
    }

    openDelete(memoType: MemoType, template: TemplateRef<any>) {
        this.memoType = memoType;
        this.modalRef = this.modalService.show(template);
    }

    getPagination() {
        this.spinner = true;
        this.memoService.getAll(this.memoTypeApi).subscribe((response: any) => {
                this.dataList = response.content;
                this.dataService.setDataList(this.dataList);
                this.commonPageService.setCurrentApi(this.memoTypeApi);
                this.pageable = this.commonPageService.setPageable(response.content);

                this.spinner = false;

            }, error => {
                this.globalMsg = error.error.message;
                if (this.globalMsg == null) {
                    this.globalMsg = 'Please check your network connection';
                }
                this.spinner = false;
                this.dataService.getGlobalMsg(this.globalMsg);
                $('.global-msgModal').modal('show');
            }
        );

    }

    deleteMemoType() {
        this.memoService.deleteById(this.memoDataService.getMemoTypeApi(), this.memoType.id).subscribe(result => {

                this.globalMsg = 'SUCCESSFULLY DELETED MEMO TYPE';
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

    onSubmit() {
        if (this.isNewMemo) {
            this.memoService.save(this.memoTypeApi, this.memoTypeForm.value).subscribe(result => {
                    this.modalRef.hide();
                    this.globalMsg = 'SUCCESSFULLY ADDED MEMO TYPE';
                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('true');
                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(['home/memo/type']));
                    $('.alert-custom').slideDown();

                }, error => {

                    this.modalRef.hide();

                    this.globalMsg = error.error.message;
                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('false');

                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(['home/memo/type']));
                    $('.alert-custom').slideDown();

                }
            );
        } else {

            this.memoType.name = this.memoTypeForm.get('name').value;
            this.memoType.status = this.memoTypeForm.get('status').value;
            this.memoService.edit(this.memoTypeApi, this.memoType, this.memoType.id).subscribe(result => {
                    this.modalRef.hide();
                    this.globalMsg = 'SUCCESSFULLY EDITED MEMO TYPE';

                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('true');
                    this.memoType = new MemoType();
                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(['home/memo/type']));
                    $('.alert-custom').slideDown();


                }, error => {

                    this.modalRef.hide();

                    this.globalMsg = error.error.message;
                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('false');

                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(['home/memo/type']));
                    $('.alert-custom').slideDown();

                }
            );
        }
    }

}
