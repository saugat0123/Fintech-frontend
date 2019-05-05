import {Component, DoCheck, OnInit, TemplateRef} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {MemoType} from '../../model/memoType';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemoTypeService} from '../../service/memo-type.service';
import {Action} from '../../../../core/Action';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomValidator} from '../../../../core/validator/custom-validator';
import {Status} from '../../../../core/Status';

@Component({
    selector: 'app-memo-type',
    templateUrl: './memo-type.component.html',
    styleUrls: ['./memo-type.component.css']
})
export class MemoTypeComponent implements OnInit, DoCheck {
    static TITLE = 'Memo Type';
    private static DEFAULT_STATUS = Status.ACTIVE;

    search: string;
    spinner = false;
    dataList: any;
    currentUrl: string;
    task: string;
    isNewMemo: boolean;
    pageable: Pageable = new Pageable();
    globalMsg;
    memoType: MemoType;
    memoTypeForm: FormGroup;

    private modalRef: NgbModalRef;

    constructor(
        private dataService: CommonDataService,
        private memoService: MemoTypeService,
        private modalService: NgbModal,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(MemoTypeComponent.TITLE);
        this.getPagination();
    }

    ngDoCheck(): void {
        this.currentUrl = this.router.url;
    }

    onSearch() {
        this.getPagination();
    }

    onSearchChange(searchValue: string) {
        this.search = searchValue;

        this.getPagination();
    }

    buildForm() {
        this.memoTypeForm = this.formBuilder.group(
            {
                id: [this.memoType.id === undefined ? '' : this.memoType.id],
                name: [this.memoType.name === undefined ? '' : this.memoType.name, [Validators.required, CustomValidator.notEmpty]],
                status: [this.memoType.status === undefined ? MemoTypeComponent.DEFAULT_STATUS : this.memoType.status,
                    (this.task === Action.UPDATE) ? [Validators.required] : []]
            }
        );
    }

    addMemoType(template: TemplateRef<any>) {
        this.isNewMemo = true;
        this.task = Action.ADD;
        this.memoType = new MemoType();
        this.buildForm();

        this.modalRef = this.modalService.open(template, {backdrop: 'static'});
    }

    openEdit(memoType: MemoType, template: TemplateRef<any>) {
        this.isNewMemo = false;
        this.task = Action.UPDATE;
        this.memoType = memoType;
        this.buildForm();

        this.modalRef = this.modalService.open(template, {backdrop: 'static'});
    }

    openDelete(memoType: MemoType, template: TemplateRef<any>) {
        this.memoType = memoType;

        this.modalRef = this.modalService.open(template);
    }

    getPagination() {
        this.spinner = true;
        this.memoService.getPagination(this.search).subscribe((response: any) => {
                this.dataList = response.content;
                this.dataService.setDataList(this.dataList);

                this.spinner = false;
            }, error => {
                this.globalMsg = error.error.message;

                if (this.globalMsg == null) {
                    this.globalMsg = 'Please check your network connection';
                }

                this.spinner = false;
                this.dataService.getGlobalMsg(this.globalMsg);
            }
        );

    }

    deleteMemoType() {
        this.memoService.delete(this.memoType.id).subscribe(result => {

                this.globalMsg = 'Successfully Removed Memo Type';
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');

                this.modalRef.dismiss('Deleted Memo Type');

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
            }
        });
    }

    submit() {
        if (this.isNewMemo) {
            this.memoService.save(this.memoTypeForm.value).subscribe(
                () => {
                    this.globalMsg = 'Successfully Saved Memo Type';
                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('true');
                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(['home/memo/type']));

                    this.modalRef.dismiss('Saved Memo Type');

                }, error => {

                    this.globalMsg = error.error.message;
                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('false');

                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(['home/memo/type']));
                }
            );
        } else {
            this.memoType.name = this.memoTypeForm.get('name').value;
            this.memoType.status = this.memoTypeForm.get('status').value;
            this.memoService.update(this.memoType)
                .subscribe(
                    () => {
                        this.globalMsg = 'Successfully Updated Memo Type';

                        this.modalRef.dismiss('Updated Memo Type');

                        this.dataService.getGlobalMsg(this.globalMsg);
                        this.dataService.getAlertMsg('true');
                        this.memoType = new MemoType();
                        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                            this.router.navigate(['home/memo/type']));
                    }, error => {

                        this.globalMsg = error.error.message;
                        this.dataService.getGlobalMsg(this.globalMsg);
                        this.dataService.getAlertMsg('false');

                        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                            this.router.navigate(['home/memo/type']));
                    }
                );
        }
    }

    get name() {
        return this.memoTypeForm.get('name');
    }

    get status() {
        return this.memoTypeForm.get('status');
    }

}
