import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef} from '@nebular/theme';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {AdditionalDocument} from '../../../../../model/AdditionalDocument';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../../@core/utils';

@Component({
    selector: 'app-add-additional-document',
    templateUrl: './add-additional-document.component.html',
    styleUrls: ['./add-additional-document.component.scss']
})
export class AddAdditionalDocumentComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() additionalDocument: AdditionalDocument;
    addDocForm: FormGroup;
    spinner = false;
    uploadFile;

    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<AddAdditionalDocumentComponent>,
                private service: CreditAdministrationService) {
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.addDocForm = this.formBuilder.group({
            id: [ObjectUtil.isEmpty(this.additionalDocument) ? undefined : this.additionalDocument.id],
            docName: [ObjectUtil.isEmpty(this.additionalDocument) ? undefined : this.additionalDocument.docName, [Validators.required]],
            docPath: [ObjectUtil.isEmpty(this.additionalDocument) ? undefined : this.additionalDocument.docPath],
            uploadOn: [ObjectUtil.isEmpty(this.additionalDocument) ? undefined : this.additionalDocument.uploadOn],
            remarks: [ObjectUtil.isEmpty(this.additionalDocument) ? undefined : this.additionalDocument.remarks],
            version: [ObjectUtil.isEmpty(this.additionalDocument) ? undefined : this.additionalDocument.version]
        });
    }

    addDocInput(event) {
        this.uploadFile = event.target.files[0];

    }

    submit() {
        this.spinner = true;
        const name = this.addDocForm.get('docName').value;
        if (!ObjectUtil.isEmpty(this.additionalDocument)) {
            const index = this.cadData.additionalDocumentList.indexOf(this.additionalDocument, 0);
            if (index > -1) {
                this.cadData.additionalDocumentList.splice(index, 1);
            }
        } else {
            const duplicateChk = this.cadData.additionalDocumentList.filter(f => f.docName.trim() === name.toString().trim());
            if (duplicateChk.length > 0) {
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.INFO, 'Document Name  already exists!!!'));
                return;
            }
        }
        if (!ObjectUtil.isEmpty(this.uploadFile)) {
            if (ObjectUtil.isEmpty(name)) {
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.INFO, 'Document Name  cannot be empty!!!'));
                return;

            }
            const formData: FormData = new FormData();

            formData.append('file', this.uploadFile);
            formData.append('cadId', this.cadData.id.toString());
            formData.append('documentName', name.toString());
            formData.append('customerInfoId', this.cadData.loanHolder.id.toString());
            formData.append('branchId', this.cadData.loanHolder.branch.id.toString());
            this.service.uploadAdditionalDocument(formData).subscribe((res: any) => {
                this.addDocForm.patchValue({
                    docPath: res.detail,
                    uploadOn: new Date()
                });
                this.save();
            });

        } else {
            this.save();
        }


    }

    onClose() {
        this.dialogRef.close();
    }

    save() {
        this.cadData.additionalDocumentList.push(this.addDocForm.value);
        this.service.saveCadDocumentBulk(this.cadData).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved  data!!!'));
            this.spinner = false;
            this.dialogRef.close(res.detail);
        }, error => {
            const index = this.cadData.additionalDocumentList.indexOf(this.addDocForm.value, 0);
            if (index > -1) {
                this.cadData.additionalDocumentList.splice(index, 1);
            }
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            this.spinner = false;
            this.dialogRef.close();

        });
    }
}
