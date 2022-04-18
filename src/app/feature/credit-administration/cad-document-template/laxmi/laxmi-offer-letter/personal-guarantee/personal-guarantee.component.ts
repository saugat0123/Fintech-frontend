import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {LaxmiOfferLetterConst} from '../laxmi-offer-letter-const';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-personal-guarantee',
    templateUrl: './personal-guarantee.component.html',
    styleUrls: ['./personal-guarantee.component.scss']
})
export class PersonalGuaranteeComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    form: FormGroup;
    spinner;
    offerLetterConst = LaxmiOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;
    amount;
    isJoint = false;
    jointInfo;
    constructor(private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepaliNumberPipe: EngToNepaliNumberPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepPercentWordPipe: NepaliPercentWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService,
                private customerOfferLetterService: CustomerOfferLetterService,
                private nepaliNumber: NepaliNumberPipe,
                private dialogRef: NbDialogRef<PersonalGuaranteeComponent>,
                private spinnerService: NgxSpinnerService) {
    }

    ngOnInit() {
        if (this.cadOfferLetterApprovedDoc.assignedLoan[0].customerInfo.jointInfo) {
            this.isJoint = true;
            this.jointInfo = JSON.parse(this.cadOfferLetterApprovedDoc.assignedLoan[0].customerInfo.jointInfo).jointCustomerInfo;
        }
        this.buildForm();
        this.checkOfferLetter();
    }

    fillForm() {
        this.amount = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal.proposedLimit;
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        if (this.nepaliData) {
            this.form.patchValue({
                customerName: this.nepaliData.name ? this.nepaliData.name : '',
                age: this.nepaliData.age ? this.nepaliData.age : '',
                branch: [undefined],
                grandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
                parentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
                spouseName: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
                citizenshipNum: this.nepaliData.age ? this.nepaliData.age : '',
                citizenshipIssuePlace: this.nepaliData.age ? this.nepaliData.age : '',
                citizenshipIssueDate: this.nepaliData.age ? this.nepaliData.age : '',
                permanentMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
                permanentWardNum: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
                permanentDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
                temporaryMunicipality: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
                temporaryWardNum: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
                temporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
                loanAmount: this.nepaliNumber.transform(this.amount, 'preeti'),
                loanAmountInWords: this.nepaliCurrencyWordPipe.transform(this.amount)
            });
            if (!this.jointInfo) {
                this.form.get(['commonData', 0]).patchValue({
                    guarantorName: (this.nepaliData.guarantorDetails.length > 0) ?
                        !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].name) : '' ? this.nepaliData.guarantorDetails[0].name : '',
                    guarantorCitizenshipNum: (this.nepaliData.guarantorDetails.length > 0) ?
                        !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].citizenNumber) : '' ? this.nepaliData.guarantorDetails[0].citizenNumber : '',
                    guarantorCitizenshipIssuePlace: (this.nepaliData.guarantorDetails.length > 0) ?
                        !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].issuedPlace) : '' ? this.nepaliData.guarantorDetails[0].issuedPlace : '',
                    guarantorCitizenshipIssueDate: (this.nepaliData.guarantorDetails.length > 0) ?
                        !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].issuedDate) : '' ? this.nepaliData.guarantorDetails[0].issuedDate : '',

                });
            }
        }
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_GUARANTEE).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_GUARANTEE);
            this.addEmptySakshi();
            if(this.isJoint) {
                this.jointInfo.forEach((d: any) => {
                    this.addCommonData();
                });
            } else {
                this.addCommonData();
            }
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setSakshis(initialInfo.sakshis);
            this.setCommonData();
            this.form.patchValue(this.initialInfoPrint);
        }
    }

    onSubmit(): void {
        this.spinner = true;
        this.spinnerService.show();
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.PERSONAL_GUARANTEE).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_GUARANTEE);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.spinnerService.hide();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.spinnerService.hide();
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }

    setSakshis(data) {
        const formArray = this.form.get('sakshis') as FormArray;
        if (data.length === 0) {
            this.addEmptySakshi();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                district: [value.district],
                municipality: [value.municipality],
                wardNum: [value.wardNum],
                age: [value.age],
                name: [value.name],
            }));
        });
    }

    addEmptySakshi() {
        (this.form.get('sakshis') as FormArray).push(
            this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                wardNum: [undefined],
                age: [undefined],
                name: [undefined],
            }));
    }

    removeSakshi(index) {
        (this.form.get('sakshis') as FormArray).removeAt(index);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            branch: [undefined],
            grandParentName: [undefined],
            parentName: [undefined],
            spouseName: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipality: [undefined],
            permanentWardNum: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipality: [undefined],
            temporaryWardNum: [undefined],
            foreignAddressCountry: [undefined],
            foreignAddressState: [undefined],
            foreignEmployer: [undefined],
            foreignHouseNum: [undefined],
            age: [undefined],
            customerName: [undefined],
            citizenshipNum: [undefined],
            citizenshipIssuePlace: [undefined],
            citizenshipIssueDate: [undefined],
            passportNum: [undefined],
            passportIssueDate: [undefined],
            // guarantorGrandParentName: [undefined],
            // guarantorParentName: [undefined],
            // guarantorSpouseName: [undefined],
            // guarantorPermanentDistrict: [undefined],
            // guarantorPermanentMunicipality: [undefined],
            // guarantorPermanentWardNum: [undefined],
            // guarantorTemporaryDistrict: [undefined],
            // guarantorTemporaryMunicipality: [undefined],
            // guarantorTemporaryWardNum: [undefined],
            // guarantorAge: [undefined],
            // guarantorName: [undefined],
            // guarantorCitizenshipNum: [undefined],
            // guarantorCitizenshipIssuePlace: [undefined],
            // guarantorCitizenshipIssueDate: [undefined],
            loanAmount: [undefined],
            loanAmountInWords: [undefined],
            foreignPlace: [undefined],

            sakshis: this.formBuilder.array([]),

            dateYear: [undefined],
            dateMonth: [undefined],
            dateDay: [undefined],
            dateRoj: [undefined],
            commonData: this.formBuilder.array([])
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }
    addCommonData() {
        const commonData = this.form.get('commonData') as FormArray;
        commonData.push(this.formBuilder.group({
            guarantorGrandParentName: [undefined],
            guarantorParentName: [undefined],
            guarantorSpouseName: [undefined],
            guarantorPermanentDistrict: [undefined],
            guarantorPermanentMunicipality: [undefined],
            guarantorPermanentWardNum: [undefined],
            guarantorTemporaryDistrict: [undefined],
            guarantorTemporaryMunicipality: [undefined],
            guarantorTemporaryWardNum: [undefined],
            guarantorAge: [undefined],
            guarantorName: [undefined],
            guarantorCitizenshipNum: [undefined],
            guarantorCitizenshipIssuePlace: [undefined],
            guarantorCitizenshipIssueDate: [undefined],
        }));
    }

    setCommonData() {
        const commonData = this.form.get('commonData') as FormArray;
        this.initialInfoPrint.commonData.forEach(d => {
            commonData.push(this.formBuilder.group({
                guarantorGrandParentName: [d.guarantorGrandParentName],
                guarantorParentName: [d.guarantorParentName],
                guarantorSpouseName: [d.guarantorSpouseName],
                guarantorPermanentDistrict: [d.guarantorPermanentDistrict],
                guarantorPermanentMunicipality: [d.guarantorPermanentMunicipality],
                guarantorPermanentWardNum: [d.guarantorPermanentWardNum],
                guarantorTemporaryDistrict: [d.guarantorTemporaryDistrict],
                guarantorTemporaryMunicipality: [d.guarantorTemporaryMunicipality],
                guarantorTemporaryWardNum: [d.guarantorTemporaryWardNum],
                guarantorAge: [d.guarantorAge],
                guarantorName: [d.guarantorName],
                guarantorCitizenshipNum: [d.guarantorCitizenshipNum],
                guarantorCitizenshipIssuePlace: [d.guarantorCitizenshipIssuePlace],
                guarantorCitizenshipIssueDate: [d.guarantorCitizenshipIssueDate]
            }));
        });
    }
}
