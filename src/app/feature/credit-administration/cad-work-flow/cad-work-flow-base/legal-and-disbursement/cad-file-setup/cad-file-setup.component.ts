import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {DocumentService} from '../../../../../admin/component/document/document.service';
import {Status} from '../../../../../../@core/Status';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../@core/utils';
import {Document} from '../../../../../admin/modal/document';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-cad-file-setup',
    templateUrl: './cad-file-setup.component.html',
    styleUrls: ['./cad-file-setup.component.scss']
})
export class CadFileSetupComponent implements OnInit {

    @Input()
    cadData: CustomerApprovedLoanCadDocumentation;
    @Input() files;
    @Input() securityFiles;
    @Output() legalFile = new EventEmitter<any>();
    responseDocList: Array<Document>;
    documentList = [];
    spinner = false;

    form: FormGroup;

    constructor(private documentService: DocumentService,
                private toastService: ToastService,
                private formBuilder: FormBuilder,
                private routerService: RouterUtilsService,
                private service: CreditAdministrationService,
                protected dialogRef: NgbModal
    ) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            if (ObjectUtil.isEmpty(this.cadData.requiredDocument)) {
                this.cadData.requiredDocument = [];
            }
        }
        this.buildForm();
        this.initial();

    }

    initial() {
        this.spinner = true;
        this.documentService.getByLoanCycleAndStatus(12, Status.ACTIVE).subscribe(res => {
            this.responseDocList = res.detail;
            if (this.responseDocList.length > 0) {
                this.responseDocList.forEach(d => {
                    const dataDoc = {
                        document: null,
                        checked: null
                    };
                    dataDoc.document = d;
                    dataDoc.checked = false;

                    if (!this.securityFiles) {
                        this.cadData.requiredDocument.forEach(e => {
                            if (d.id === e.id) {
                                dataDoc.checked = true;
                            }
                        });
                    } else {
                        if (!ObjectUtil.isEmpty(this.files)) {
                            this.files.forEach(e => {
                                if (d.id === e.id) {
                                    dataDoc.checked = true;
                                }
                            });
                        }
                    }
                    this.documentList.push(dataDoc);

                    this.spinner = false;

                });
            } else {
                this.spinner = false;
            }
            const array = (this.form.get('documents') as FormArray);
            this.documentList.forEach(d => {
                array.push(this.formBuilder.group({
                    document: d,
                    checked: d.checked,
                }));
            });

        }, error => {
            console.log(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load document '));

        });
    }


    buildForm() {
        this.form = this.formBuilder.group({
            documents: this.formBuilder.array([]),
        });

    }


    save() {
        const finalDocTemp = this.form.get('documents').value;
        const finalCadDocReq = [];
        finalDocTemp.forEach(f => {
            if (f.checked) {
                const temp = f.document.document;
                finalCadDocReq.push(temp);
            }
        });
        if (!this.securityFiles) {
            this.spinner = true;
            this.cadData.requiredDocument = finalCadDocReq;
            this.service.saveCadDocumentBulk(this.cadData).subscribe(() => {
                    this.routerService.reloadCadProfileRoute(this.cadData.id);
                    this.spinner = false;
                    this.closeModal();
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved data'));


                }, error => {
                    this.toastService.show(new Alert(AlertType.ERROR, 'Error Saving'));
                    console.log(error);
                    this.spinner = false;
                }
            );
        } else {
            this.legalFile.emit(finalCadDocReq);
        }
    }

    closeModal() {
        this.dialogRef.dismissAll();
    }

}
