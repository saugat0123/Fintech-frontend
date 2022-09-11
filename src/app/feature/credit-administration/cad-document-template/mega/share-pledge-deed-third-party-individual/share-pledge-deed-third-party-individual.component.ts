import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {CadFile} from '../../../model/CadFile';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Document} from '../../../../admin/modal/document';

@Component({
    selector: 'app-share-pledge-deed-third-party-individual',
    templateUrl: './share-pledge-deed-third-party-individual.component.html',
    styleUrls: ['./share-pledge-deed-third-party-individual.component.scss']
})
export class SharePledgeDeedThirdPartyIndividualComponent implements OnInit {
    form: FormGroup;
    cadFile: CadFile;
    nepData;
    initialInfo;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;

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
                    this.initialInfo = JSON.parse(singleCadFile.initialInformation);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.form.patchValue(this.initialInfo);
            this.setTableData(this.initialInfo.loanData);
        } else {
            this.addTableData();
            this.fillForm();
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            loanData: this.formBuilder.array([]),
            personData: this.formBuilder.array([]),
            tableShow: true,
            branch: [undefined],
            grandFatherName1: [undefined],
            fatherName1: [undefined],
            husbandName1: [undefined],
            permanentDistrict1: [undefined],
            permanentMunicipalityVDC1: [undefined],
            permanentWardNo1: [undefined],
            permanentTole1: [undefined],
            temporaryProvince1: [undefined],
            temporaryDistrict1: [undefined],
            temporaryMunicipalityVDC1: [undefined],
            temporaryWardNo1: [undefined],
            age1: [undefined],
            individualName1: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            husbandName: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipalityVDC: [undefined],
            permanentWardNo: [undefined],
            permanentTole: [undefined],
            temporaryProvince: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipalityVDC: [undefined],
            temporaryWardNo: [undefined],
            age: [undefined],
            individualName: [undefined],
            freeText: [undefined],
            offerLetterIssuedDate: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            amount2: [undefined],
            amountInWords2: [undefined],
            facOwnerName: [undefined],
            witnessName: [undefined],
            witnessName2: [undefined],
            year: [undefined],
            month: [undefined],
            day: [undefined],
            time: [undefined],
            snNo: [undefined],
            shareholderNameAndCitizenshipNo: [undefined],
            clientId: [undefined],
            shareKitta: [undefined],
            shareIssuingCompany: [undefined],
            kaifiyat: [undefined],

        });
    }

    fillForm() {
        this.form.patchValue({
            branch: !ObjectUtil.isEmpty(this.nepData.branchDetail) ?
                this.nepData.branchDetail.branchName : '',
            grandFatherName1: undefined,
            fatherName1: undefined,
            husbandName1: undefined,
            permanentDistrict1: undefined,
            permanentMunicipalityVDC1: undefined,
            permanentWardNo1: undefined,
            permanentTole1: undefined,
            temporaryProvince1: undefined,
            temporaryDistrict1: undefined,
            temporaryMunicipalityVDC1: undefined,
            temporaryWardNo1: undefined,
            age1: undefined,
            individualName1: undefined,
            grandFatherName: !ObjectUtil.isEmpty(this.nepData.grandFatherName) ? this.nepData.grandFatherName : '',
            fatherName: !ObjectUtil.isEmpty(this.nepData.fatherName) ? this.nepData.fatherName : '',
            husbandName: !ObjectUtil.isEmpty(this.nepData.husbandName) ? this.nepData.husbandName : '',
            permanentDistrict: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.district : '',
            permanentMunicipalityVDC: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.municipality : '',
            permanentWardNo: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.wardNo : '',
            permanentTole: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.tole : '',
            temporaryProvince: undefined,
            temporaryDistrict: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.district : '',
            temporaryMunicipalityVDC: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.municipality : '',
            temporaryWardNo: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.wardNo : '',
            age: undefined,
            individualName: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
            freeText: undefined,
            offerLetterIssuedDate: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                this.nepData.miscellaneousDetail.offerIssueDate : '',
            amount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                this.nepData.miscellaneousDetail.loanAmountInFig : '',
            amountInWords: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                this.nepData.miscellaneousDetail.loanAmountInWord : '',
            amount2: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                this.nepData.miscellaneousDetail.loanAmountInFig : '',
            amountInWords2: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                this.nepData.miscellaneousDetail.loanAmountInWord : '',
            shareholderName: undefined,
            witnessName: undefined,
            witnessName2: undefined,
            year: undefined,
            month: undefined,
            day: undefined,
            time: undefined,
            snNo: undefined,
            shareholderNameAndCitizenshipNo: undefined,
            clientId: undefined,
            shareKitta: undefined,
            shareIssuingCompany: undefined,
            kaifiyat: undefined,
        });
        if (!ObjectUtil.isEmpty(this.nepData)) {
            if (!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail)) {
                this.form.get(['loanData', 0, 'loanFacilityType']).patchValue(this.nepData.miscellaneousDetail.loanFacilityTypeInNep);
                this.form.get(['loanData', 0, 'amountInWords1']).patchValue(this.nepData.miscellaneousDetail.loanAmountInWord);
                this.form.get(['loanData', 0, 'amount1']).patchValue(this.nepData.miscellaneousDetail.loanAmountInFig);
            }
        }
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.form.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.form.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.form.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
            this.dialogRef.close();
        });
    }

    removeLoanDetail(index) {
        (this.form.get('loanData') as FormArray).removeAt(index);
    }

    addTableData() {
        (this.form.get('loanData') as FormArray).push(
            this.formBuilder.group({
                loanFacilityType: [undefined],
                amountInWords1: [undefined],
                amount1: [undefined],
            })
        );
    }

    setTableData(data) {
        const formArray = this.form.get('loanData') as FormArray;
        if (data.length === 0) {
            this.addTableData();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                loanFacilityType: [value.loanFacilityType],
                amountInWords1: [value.amountInWords1],
                amount1: [value.amount1],
            }));
        });
    }

    changeToNepAmount(event: any, target, from) {
        this.form.get([target]).patchValue(event.nepVal);
        this.form.get([from]).patchValue(event.val);
    }

    patchFunction(target) {
        const patchValue1 = this.form.get([target]).value;
        return patchValue1;
    }

    changeToNepAmount1(event: any, i, formArrayName) {
        this.form.get([formArrayName, i, 'amountInWords1']).patchValue(event.nepVal);
        this.form.get([formArrayName, i, 'amount1']).patchValue(event.val);
    }

    patchFunction1(formArrayName, i, formControlName) {
        const patchValue1 = this.form.get([formArrayName, i, formControlName]).value;
        return patchValue1;
    }
}
