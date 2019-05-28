import {Component, DoCheck, OnInit, TemplateRef} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {MemoType} from '../../model/memoType';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemoTypeService} from '../../service/memo-type.service';
import {Action} from '../../../../@core/Action';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomValidator} from '../../../../@core/validator/custom-validator';
import {Status} from '../../../../@core/Status';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../../@core/utils';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';

@Component({
    selector: 'app-memo-type',
    templateUrl: './memo-type.component.html',
    styleUrls: ['./memo-type.component.css']
})
export class MemoTypeComponent implements OnInit, DoCheck {
    static TITLE = 'Memo Type';
    private static DEFAULT_STATUS = Status.ACTIVE;

    page = 1;

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
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private memoTypeService: MemoTypeService,
        private modalService: NgbModal,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) {
    }

    static loadData(other: MemoTypeComponent) {
        other.spinner = true;
        other.memoTypeService.getPaginationWithSearch(other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.content;
                other.pageable = PaginationUtils.getPageable(response);
                other.spinner = false;
            }, error => {
                console.error(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Failed to Load Memo Types'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.breadcrumbService.notify(MemoTypeComponent.TITLE);
        MemoTypeComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;

        MemoTypeComponent.loadData(this);
    }

    ngDoCheck(): void {
        this.currentUrl = this.router.url;
    }

    onSearch() {
        MemoTypeComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = searchValue;

        MemoTypeComponent.loadData(this);
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

    deleteMemoType() {
        this.memoTypeService.delete(this.memoType.id).subscribe(() => {

                this.modalRef.dismiss('Deleted Memo Type');

                const alert = new Alert(AlertType.SUCCESS, 'Successfully Removed Memo Type');
                this.toastService.show(alert);

                MemoTypeComponent.loadData(this);

            }, error => {

                console.log(error);
                const alert = new Alert(AlertType.ERROR, 'Unable to Remove Memo Type');
                this.toastService.show(alert);
            }
        );
    }

    submit() {
        if (this.isNewMemo) {
            this.memoTypeService.save(this.memoTypeForm.value).subscribe(
                () => {

                    this.modalRef.dismiss('Saved Memo Type');

                    const alert = new Alert(AlertType.SUCCESS, 'Successfully Saved Memo Type');
                    this.toastService.show(alert);

                    MemoTypeComponent.loadData(this);

                }, (error) => {

                    console.log(error);

                    const alert = new Alert(AlertType.SUCCESS, 'Failed to create Memo Type');
                    this.toastService.show(alert);
                }
            );
        } else {
            this.memoType.name = this.memoTypeForm.get('name').value;
            this.memoType.status = this.memoTypeForm.get('status').value;
            this.memoTypeService.update(this.memoType.id, this.memoType)
                .subscribe(
                    () => {
                        this.modalRef.dismiss('Updated Memo Type');
                        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Memo Type'));
                        this.memoType = new MemoType();

                        MemoTypeComponent.loadData(this);

                    }, (error) => {
                        console.log(error);

                        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to Update Memo Type'));
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
