import {Component, Input, OnInit} from '@angular/core';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Action} from '../../../../../@core/Action';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Status} from '../../../../../@core/Status';
import {CustomValidator} from '../../../../../@core/validator/custom-validator';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CreditMemoTypeService} from '../../../service/credit-memo-type';
import {Violation} from '../../../../../@core/utils/modal/Violation';
import {MemoType} from '../../../../memo/model/memoType';
import {DocumentService} from '../../../../admin/component/document/document.service';
import {Document} from '../../../../admin/modal/document';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-credit-memo-type-form',
    templateUrl: './credit-memo-type-form.component.html'
})
export class CreditMemoTypeFormComponent implements OnInit {
    @Input()
    model: MemoType;
    @Input()
    action: Action = Action.ADD;
    errors: Array<Violation>;
    modelForm: FormGroup;
    finalInitialDocument = Array<Document>();
    documents;
    @Input()
    memoId: number;

    constructor(
        private formBuilder: FormBuilder,
        private service: CreditMemoTypeService,
        private modalRef: NgbActiveModal,
        private toast: ToastService,
        private docService: DocumentService
    ) {
    }

    get name() {
        return this.modelForm.get('name');
    }

    get status() {
        return this.modelForm.get('status');
    }

    ngOnInit() {
        this.buildForm();
        this.setDocuments();
    }

    buildForm() {
        this.modelForm = this.formBuilder.group(
            {
                documents: [undefined],
                id: [this.model.id === undefined ? '' : this.model.id],
                name: [this.model.name === undefined ? '' : this.model.name, [Validators.required, CustomValidator.notEmpty]],
                status: [this.model.status === undefined ? Status.ACTIVE : this.model.status,
                    (this.action === Action.UPDATE) ? [Validators.required] : []]

            }
        );
    }

    save() {

        switch (this.action) {
            case Action.ADD:


                if (!ObjectUtil.isEmpty(this.finalInitialDocument)) {
                    const doc = this.modelForm.value;
                    doc.documents = this.finalInitialDocument;
                }
                this.service.save(this.modelForm.value).subscribe(
                    () => {


                        this.modalRef.close(ModalResponse.SUCCESS);

                        const alert = new Alert(AlertType.SUCCESS, 'Successfully Saved Memo Type');
                        this.toast.show(alert);

                    }, (err) => {

                        if (err.error.errors) {
                            this.errors = err.error.errors;
                        }

                        const alert = new Alert(AlertType.ERROR, 'Failed to create Memo Type');
                        this.toast.show(alert);
                    }
                );
                break;
            case Action.UPDATE:
                if (!ObjectUtil.isEmpty(this.finalInitialDocument)) {
                    this.model.documents = this.finalInitialDocument;
                }
                this.model.name = this.modelForm.get('name').value;
                this.model.status = this.modelForm.get('status').value;

                this.service.save(this.model)
                    .subscribe(
                        () => {
                            this.toast.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Memo Type'));

                            this.modalRef.close(ModalResponse.SUCCESS);

                        }, (err) => {

                            console.log(err);

                            if (err.error.errors) {
                                this.errors = err.error.errors;
                                console.log(this.errors);
                            }

                            this.toast.show(new Alert(AlertType.ERROR, 'Failed to Update Memo Type'));
                        }
                    );
                break;
            default:
                console.log(`Invalid Action ${this.action}`);
        }
    }

    setDocuments(): void {
        this.docService.getAllLoanCycle().subscribe(reponse => {
            reponse.detail.forEach(data => {
                if (data.cycle === 'Credit Diary Note') {
                    this.getActiveDocuments(data.id);
                }
            });
        });
    }


    getActiveDocuments(id: number): void {
        this.docService.getByLoanCycleAndStatus(id, 'ACTIVE').subscribe(response => {
            this.documents = response.detail;
            this.checkDocument(this.memoId);
        });
    }


    nbUpdateCheckBoxInitial($event, checkAll) {
        this.finalInitialDocument = [];
        this.documents.forEach((d) => {
            if (checkAll) {
                this.finalInitialDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                Object.assign(d, {checked: false});
                this.finalInitialDocument = [];
            }
        });

    }

    updateDocument(events, document: Document, documentArray: Document[]) {
        const dindex: number = this.documents.indexOf(document);
        if (events.target.checked === true) {
            this.documents[dindex].checked = true;
            this.finalInitialDocument.push(document);
        } else {
            const index: number = this.finalInitialDocument.indexOf(document);
            if (index !== -1) {
                this.documents[dindex].checked = false;
                this.finalInitialDocument.splice(index, 1);
            }
        }
    }

    checkDocument(id: number) {
        this.service.getAll().subscribe(res => {
            res.detail.forEach(data => {
                if (data.id === id) {
                    data.documents.forEach(doc => {
                        this.documents.forEach(resp => {
                            if (resp.id === doc.id) {
                                resp.checked = true;
                                this.finalInitialDocument.push(resp);
                            }
                        });
                    });
                }
            });
        });
    }

    close() {
        this.modalRef.dismiss();
    }
}
