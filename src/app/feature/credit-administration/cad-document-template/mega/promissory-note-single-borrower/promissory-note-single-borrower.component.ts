import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';

@Component({
    selector: 'app-promissory-note-single-borrower',
    templateUrl: './promissory-note-single-borrower.component.html',
    styleUrls: ['./promissory-note-single-borrower.component.scss']
})
export class PromissoryNoteSingleBorrowerComponent implements OnInit {

    promissorySingleNote: FormGroup;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    @Input() nepaliAmount: NepaliNumberAndWords;
    nepData;

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit(): void {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    this.promissorySingleNote.patchValue(JSON.parse(singleCadFile.initialInformation));
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        }
    }

    buildForm() {
        this.promissorySingleNote = this.formBuilder.group({
            date: [undefined],
            amount: [undefined],
            amountInWord: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            perDistrict: [undefined],
            perMunicipalityOrVdc: [undefined],
            perWardNo: [undefined],
            currentDistrict: [undefined],
            CurrentMunicipalityOrVdc: [undefined],
            CurrentWardNo: [undefined],
            borrowerAge: [undefined],
            borrowerName: [undefined],
            citizenshipNo: [undefined],
            citizenshipIssuedDate: [undefined],
            districtOffice: [undefined],
            bankBranch: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanInterest: [undefined],
            docWrittenName: [undefined],
            witnessName: [undefined],
            witnessAddress: [undefined],
            witnessName1: [undefined],
            witnessAddress1: [undefined],
        });
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.promissorySingleNote.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.promissorySingleNote.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.promissorySingleNote.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.dialogRef.close();
        });
        console.log(this.promissorySingleNote.value);
    }

}
