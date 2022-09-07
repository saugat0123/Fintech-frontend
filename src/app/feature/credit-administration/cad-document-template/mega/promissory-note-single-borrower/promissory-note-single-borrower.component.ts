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

    promissoryNoteSingleBorrower: FormGroup;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    @Input() nepaliAmount: NepaliNumberAndWords;
    nepData;
    initialInfo;
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
                    this.initialInfo = JSON.parse(singleCadFile.initialInformation);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.promissoryNoteSingleBorrower.patchValue(this.initialInfo);
        } else {
            this.fillForm();
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        }
    }

    buildForm() {
        this.promissoryNoteSingleBorrower = this.formBuilder.group({
            date: [undefined],
            amount: [undefined],
            amountInWord: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            husbandName: [undefined],
            perDistrict: [undefined],
            perMunicipalityOrVdc: [undefined],
            perWardNo: [undefined],
            perTole: [undefined],
            tempDistrict: [undefined],
            tempMunicipalityOrVdc: [undefined],
            tempWardNo: [undefined],
            tempTole: [undefined],
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
            district: [undefined],
            province: [undefined],
            date1: [undefined],
            name: [undefined],
            name1: [undefined],
            year: [undefined],
            month: [undefined],
            day: [undefined],
            time: [undefined],
        });
    }
    fillForm() {
        this.promissoryNoteSingleBorrower.patchValue({
            amount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : '',
            amountInWord: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : '',
            grandFatherName: !ObjectUtil.isEmpty(this.nepData.grandFatherName) ? this.nepData.grandFatherName : '',
            perDistrict: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.district : '',
            perMunicipalityOrVdc: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.municipality : '',
            perWardNo: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.wardNo : '',
            perTole: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.tole : '',
            tempDistrict: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.district : '',
            tempMunicipalityOrVdc: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.municipality : '',
            tempWardNo: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.wardNo : '',
            tempTole: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.tole : '',
            borrowerName: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
            fatherName: !ObjectUtil.isEmpty(this.nepData.fatherName) ? this.nepData.fatherName : '',
            husbandName: !ObjectUtil.isEmpty(this.nepData.husbandName) ? this.nepData.husbandName : '',
        });
    }
    changeToNepAmount(event: any, target, from) {
        this.promissoryNoteSingleBorrower.get([target]).patchValue(event.nepVal);
        this.promissoryNoteSingleBorrower.get([from]).patchValue(event.val);
    }
    patchFunction(target) {
        const patchValue1 = this.promissoryNoteSingleBorrower.get([target]).value;
        return patchValue1;
    }
    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.promissoryNoteSingleBorrower.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.promissoryNoteSingleBorrower.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.promissoryNoteSingleBorrower.value);
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
    }

}
