import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {CustomerType} from '../../../../../customer/model/customerType';


@Component({
    selector: 'app-indemnity-deed',
    templateUrl: './indemnity-deed.component.html',
    styleUrls: ['./indemnity-deed.component.scss']
})
export class IndemnityDeedComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    spinner;
    form: FormGroup;
    offerLetterConst = ProgressiveLegalDocConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;
    loanData;
    loanCategory;

    constructor(private dialogRef: NbDialogRef<IndemnityDeedComponent>,
                private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
            this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
        }
        this.loanData = this.cadData.loanHolder;
        this.buildForm();
        this.fillForm();
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    const initialInfo = JSON.parse(singleCadFile.initialInformation);
                    this.initialInfoPrint = initialInfo;
                    // this.setGuarantorDetails(initialInfo.guarantorDetails);
                    this.form.patchValue(initialInfo);
                }
            });
        }

        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            const loanAmount = JSON.parse(this.cadData.nepData);
            const customerType = this.cadData.loanHolder.customerType;
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
            if (customerType === CustomerType.INDIVIDUAL) {
                this.form.patchValue({
                    customerName: this.nepaliData.name ? this.nepaliData.name : '',
                    signatureName: this.nepaliData.name ? this.nepaliData.name : '',
                    sincerlyCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
                    sincerlyDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
                    sincerlyCdOoffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
                    sincerlyPermanentDistrict: this.nepaliData.permanentDistrict.nepaliName ? this.nepaliData.permanentDistrict.nepaliName : '',
                    sincerlyPermanentMunicipality: this.nepaliData.permanentMunicipalities.nepaliName ? this.nepaliData.permanentMunicipalities.nepaliName : '',
                    sincerlyPermanentWardNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
                    sinserlyTempDistrict: this.nepaliData.temporaryDistrict.nepaliName ? this.nepaliData.temporaryDistrict.nepaliName : '',
                    sinserlyTempMunicipality: this.nepaliData.temporaryMunicipalities.nepaliName ? this.nepaliData.temporaryMunicipalities.nepaliName : '',
                    sinserlyTempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
                    parentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
                    grandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
                    husbandWifeName: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
                    branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
                    chaltiKhata: this.nepaliData.accountNo ? this.nepaliData.accountNo : '',
                    sabikVDC: this.nepaliData.permanentVdc ? this.nepaliData.permanentVdc : '',
                    sabikWardNo: this.nepaliData.permanentVdcWard ? this.nepaliData.permanentVdcWard : ''
                });
            } else {
                this.form.patchValue({
                    branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
                    customerName: this.nepaliData.companyName ? this.nepaliData.companyName : '',
                    signatureName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
                    sincerlyCitizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
                    sincerlyDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
                    // tslint:disable-next-line:max-line-length
                    sincerlyCdOoffice: this.nepaliData.representativeCitizenshipIssuingAuthority ? this.nepaliData.representativeCitizenshipIssuingAuthority : '',
                    sincerlyPermanentDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
                    sincerlyPermanentMunicipality: this.nepaliData.representativePermanentMunicipality ? this.nepaliData.representativePermanentMunicipality : '',
                    sincerlyPermanentWardNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
                    sinserlyTempDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
                    sinserlyTempMunicipality: this.nepaliData.representativeTemporaryMunicipality ? this.nepaliData.representativeTemporaryMunicipality : '',
                    sinserlyTempWardNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
                    parentName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
                    grandParentName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
                    husbandWifeName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
                    sabikVDC: this.nepaliData.representativePermanentVdc ? this.nepaliData.representativePermanentVdc : '',
                    sabikWardNo: this.nepaliData.representativePermanentVdcWard ? this.nepaliData.representativePermanentVdcWard : ''
                });
            }
            this.form.get('amount').patchValue(loanAmount.numberNepali);
            this.form.get('amountInWord').patchValue(loanAmount.nepaliWords);
        }
    }

    onSubmit(): void {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.form.value);
                    this.initialInfoPrint = singleCadFile.initialInformation;
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

    buildForm() {
        this.form = this.formBuilder.group({
            date: [undefined],
            branchName: [undefined],
            customerName: [undefined],
            chaltiKhata: [undefined],
            amount: [undefined],
            amountInWord: [undefined],
            sincerlyName: [undefined],
            sincerlyDate: [undefined],
            sincerlyPermanentDistrict: [undefined],
            sincerlyPermanentMunicipality: [undefined],
            sincerlyPermanentWardNo: [undefined],
            sabikVDC: [undefined],
            sabikWardNo: [undefined],
            sinserlyTempDistrict: [undefined],
            sinserlyTempMunicipality: [undefined],
            sinserlyTempWardNo: [undefined],
            parentName: [undefined],
            grandParentName: [undefined],
            husbandWifeName: [undefined],
            sanakhatSakxiName: [undefined],
            sanakhatSakxiSymbNo: [undefined],
            itiSambatYear: [undefined],
            itiSambatMonth: [undefined],
            itiSambatDate: [undefined],
            itiSambatTime: [undefined],
            itiSambatRojSubham: [undefined],
            sincerlyCitizenshipNo: [undefined],
            sincerlyCdOoffice: [undefined],
            guarantorDetails: this.formBuilder.array([]),
            SakGuarantorName1: [undefined],
            SakNaPraNaName1: [undefined],
            SakMitiName1: [undefined],
            SakJiPrakaName1: [undefined],
            SakIssuedPlace1: [undefined],
            SakJillaName1: [undefined],
            SakJagaName1: [undefined],
            SakGuarantorName2: [undefined],
            SakNaPraNaName2: [undefined],
            SakMitiName2: [undefined],
            SakJiPrakaName2: [undefined],
            SakIssuedPlace2: [undefined],
            SakJillaName2: [undefined],
            SakJagaName2: [undefined],
            guarantorName: [undefined],
            guarantorCitizenshipNo: [undefined],
            guarantorCitizenshipIssueDate: [undefined],
            guarantorCDOoffice: [undefined],
            guarantorPermanentMunicipality: [undefined],
            guarantorPermanentWardNo: [undefined],
            issuedPlace: [undefined],
            guarantorName1: [undefined],
            guarantorCitizenshipNo1: [undefined],
            guarantorCitizenshipIssueDate1: [undefined],
            guarantorCDOoffice1: [undefined],
            guarantorPermanentMunicipality1: [undefined],
            guarantorPermanentWardNo1: [undefined],
            issuedPlace1: [undefined],
            signatureName: [undefined]
        });
    }

    /*
      addGuarantor(): void {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.push(this.guarantorFormGroup());
      }

      removeGuarantor(index: number): void {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.removeAt(index);
      }


      guarantorFormGroup(): FormGroup {
        return this.formBuilder.group({
          guarantorName: [undefined],
          guarantorCitizenshipNo: [undefined],
          guarantorCitizenshipIssueDate: [undefined],
          guarantorCDOoffice: [undefined],
          guarantorPermanentMunicipality: [undefined],
          guarantorPermanentWardNo: [undefined],
          issuedPlace: [undefined]
        });
      }


      setGuarantorDetails(data) {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        if (data.length === 0) {
          this.addGuarantor();
          return;
        }
        data.forEach((value) => {
          formArray.push(this.formBuilder.group({
            guarantorName: [value.guarantorName],
            guarantorCitizenshipNo: [value.guarantorCitizenshipNo],
            guarantorCitizenshipIssueDate: [value.guarantorCitizenshipIssueDate],
            guarantorCDOoffice: [value.guarantorCDOoffice],
            guarantorPermanentMunicipality: [value.guarantorPermanentMunicipality],
            guarantorPermanentWardNo: [value.guarantorPermanentWardNo],
            issuedPlace: [value.issuedPlace]
          }));
        });
      }*/


    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }
}
