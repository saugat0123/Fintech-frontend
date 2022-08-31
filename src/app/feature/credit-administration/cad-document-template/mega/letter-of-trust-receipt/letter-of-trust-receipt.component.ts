import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-letter-of-trust-receipt',
    templateUrl: './letter-of-trust-receipt.component.html',
    styleUrls: ['./letter-of-trust-receipt.component.scss']
})
export class LetterOfTrustReceiptComponent implements OnInit {
    @Input() customerInfo: CustomerInfoData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    letterOfTrustReceipt: FormGroup;
    spinner = false;
    nepData;
    isForEdit = false;

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    const data = JSON.parse(singleCadFile.initialInformation);
                    this.letterOfTrustReceipt.patchValue(data);
                    this.setName(data);
                    this.isForEdit = true;
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
            if (!this.isForEdit) {
                this.setFormDataInitial();
            }
        }
        this.addName();

    }

    buildForm() {
        this.letterOfTrustReceipt = this.formBuilder.group({
            date: [undefined],
            branch: [undefined],
            nepaliName: [undefined],
            name: this.formBuilder.array([])
        });
    }

    submit() {
        this.spinner = true;
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.letterOfTrustReceipt.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.letterOfTrustReceipt.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.letterOfTrustReceipt.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved'));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save'));
            this.dialogRef.close();
        });
    }
    setFormDataInitial() {
        if (!ObjectUtil.isEmpty(this.nepData)) {
            this.letterOfTrustReceipt.patchValue({
                branch: [this.nepData.branchDetail.branchNameInNepali ? this.nepData.branchDetail.branchNameInNepali : undefined],
                nepaliName: [this.nepData ? this.nepData.nepaliName : undefined]
            });
        }
    }

    addName() {
        (this.letterOfTrustReceipt.get('name') as FormArray).push(this.formBuilder.group({
            name: [undefined],
            // nepaliName: [this.nepData ? this.nepData.nepaliName : undefined]
        }));
    }

    remove(i) {
        (this.letterOfTrustReceipt.get('name') as FormArray).removeAt(i);
    }

    setName(data) {
        data.name.forEach(d => {
            (this.letterOfTrustReceipt.get('name') as FormArray).push(this.formBuilder.group({
                name: [d ? d.name : undefined],
                // nepaliName: [d ? d.nepaliName : undefined]
            }));
        });
    }
}
