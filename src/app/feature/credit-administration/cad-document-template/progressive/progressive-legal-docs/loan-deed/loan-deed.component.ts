import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
import {NepDataPersonal} from '../../../../model/nepDataPersonal';


@Component({
    selector: 'app-loan-deed',
    templateUrl: './loan-deed.component.html',
    styleUrls: ['./loan-deed.component.scss']
})
export class LoanDeedComponent implements OnInit {
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
    nepDataPersonal = new NepDataPersonal();
    securityLength;

    constructor(private dialogRef: NbDialogRef<LoanDeedComponent>,
                private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit() {
        this.buildForm();
        this.fillForm();
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    const initialInfo = JSON.parse(singleCadFile.initialInformation);
                    this.initialInfoPrint = initialInfo;

                    if (!ObjectUtil.isEmpty(initialInfo.swikritiBibaran)) {
                        this.setSwikriti(initialInfo.swikritiBibaran);
                    }

                    /*if (ObjectUtil.isEmpty(this.nepaliData.collateralDetails)) {
                        initialInfo.security.forEach(i => {
                                this.removeSecurity(i);
                        });
                    } else {*/
                    /*if (!ObjectUtil.isEmpty(initialInfo.security)) {
                        this.setSecurity(initialInfo.security);
                    }*/
                //}
                    this.form.patchValue(this.initialInfoPrint);
                    //this.setGuarantors(initialInfo.guarantorDetails);
                }
            });
        }

        const loanAmount = JSON.parse(this.cadData.nepData);
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
            this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
            this.form.patchValue({
                branchDistrict: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
                branchMunicipality: this.nepaliData.branchMunVdc ? this.nepaliData.branchMunVdc : '',
                branchWardNo: this.nepaliData.branchWardNo ? this.nepaliData.branchWardNo : '',
                branchName : this.nepaliData.branchName ? this.nepaliData.branchName : '',
                grandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
                parentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
                husbandWifeName: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
                customerName: this.nepaliData.name ? this.nepaliData.name : '',
                age: this.nepaliData.age ? this.nepaliData.age : '',
                likhitDistrict: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ? this.nepaliData.permanentDistrict.nepaliName : '',
                likhitMunicipality: !ObjectUtil.isEmpty(this.nepaliData.permanentMunicipalities) ? this.nepaliData.permanentMunicipalities.nepaliName : '',
                likhitWardNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
                tempVDC: !ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ? this.nepaliData.temporaryMunicipalities.nepaliName : '',
                staDistrict: !ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ? this.nepaliData.temporaryDistrict.nepaliName : '',
                tempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
                citizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
                date: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
                cdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
                gender: this.nepaliData.gender ? this.nepaliData.gender : '',
                sabikVDC: this.nepaliData.permanentVdc ? this.nepaliData.permanentVdc : '',
                sabikWardNo: this.nepaliData.permanentVdcWard ? this.nepaliData.permanentVdcWard : ''
            });
        }
        this.form.get(['swikritiBibaran', 0, 'loanType']).patchValue(this.nepDataPersonal.loanType);
        this.form.get(['swikritiBibaran', 0, 'loanAmountInWords']).patchValue(loanAmount.nepaliWords);
        this.form.get(['swikritiBibaran', 0, 'interestRate']).patchValue(this.nepDataPersonal.interestRate);
        this.form.get(['swikritiBibaran', 0, 'serviceFeePercent']).patchValue(this.nepDataPersonal.serviceFeePercent);
        this.form.get(['swikritiBibaran', 0, 'tenureOfLoanInYears']).patchValue(this.nepDataPersonal.tenureOfLoanInYears);

        this.setSecurity(this.nepaliData.collateralDetails);

       /* this.nepaliData.collateralDetails.forEach((value, i) => {
            try {
                this.setSecurityDetails(value, i);
            } catch (error) {
                this.addSecurity();
                this.setSecurityDetails(value, i);
            }
        });*/

    }

    /*setSecurityDetails(value, i) {
        this.form.get(['security', i, 'SecuritiesOwnerName']).patchValue(value.collateralName);
        this.form.get(['security', i, 'SecuritiesDistrict']).patchValue(value.collateralDistrict);
        this.form.get(['security', i, 'SecuritiesMunicipality']).patchValue(value.collateralMunVdcOriginal);
        this.form.get(['security', i, 'SecuritiesWardNo']).patchValue(value.collateralWardNoOld);
        this.form.get(['security', i, 'SecuritiesKeyNo']).patchValue(value.plotNo);
        this.form.get(['security', i, 'SecuritiesArea']).patchValue(value.areaOfCollateral);
    }

    setSecurityDetailsNull(value, i) {
        this.form.get(['security', i, 'SecuritiesSNBibaran']).patchValue(null);
        this.form.get(['security', i, 'SecuritiesOwnerName']).patchValue(null);
        this.form.get(['security', i, 'SecuritiesDistrict']).patchValue(null);
        this.form.get(['security', i, 'SecuritiesMunicipality']).patchValue(null);
        this.form.get(['security', i, 'SecuritiesWardNo']).patchValue(null);
        this.form.get(['security', i, 'SecuritiesKeyNo']).patchValue(null);
        this.form.get(['security', i, 'SecuritiesArea']).patchValue(null);
        this.form.get(['security', i, 'SecuritiesRegNo']).patchValue(null);
    }*/

    setSwikriti(data) {
        const formArray = this.form.get('swikritiBibaran') as FormArray;
        (this.form.get('swikritiBibaran') as FormArray).clear();
        if (data.length === 0) {
            this.addSwikriti();
            return;
        }
        data.forEach((value) => {
            formArray.push(this.formBuilder.group({
                loanType: [value.loanType],
                loanAmountInWords: [value.loanAmountInWords],
                interestRate: [value.interestRate],
                serviceFeePercent: [value.serviceFeePercent],
                tenureOfLoanInYears: [value.tenureOfLoanInYears]
            }));
        });
    }

    setSecurity(data) {
        const formArray = this.form.get('security') as FormArray;
        if (data.length === 0) {
            this.addSecurity();
            return;
        }
        data.forEach((value) => {
            if (value.securityDetails === 'Land_And_Building') {
                formArray.push(this.formBuilder.group({
                    SecuritiesSNBibaran: [value.dhitoBibaran],
                    SecuritiesDistrict: [value.collateralDistrict],
                    SecuritiesMunicipality: [value.collateralMunVdcOriginal],
                    SecuritiesWardNo: [value.collateralWardNoOld],
                    SecuritiesKeyNo: [value.plotNo],
                    SecuritiesArea: [value.areaOfCollateral],
                    SecuritiesRegNo: [value.regNo],
                    SecuritiesOwnerName: [value.collateralName],
                }));
            }
        });
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
            financeWardNo: [undefined],
            branchDistrict: [undefined],
            branchMunicipality: [undefined],
            branchWardNo: [undefined],
            branchName: [undefined],
            grandParentName: [undefined],
            parentName: [undefined],
            husbandWifeName: [undefined],
            gender: [undefined],
            likhitDistrict: [undefined],
            likhitMunicipality: [undefined],
            likhitWardNo: [undefined],
            sabikVDC: [undefined],
            sabikWardNo: [undefined],
            tempVDC: [undefined],
            tempWardNo: [undefined],
            age: [undefined],
            customerName: [undefined],
            citizenshipNo: [undefined],
            date: [undefined],
            loanApprovedDate: [undefined],
            cdoOffice: [undefined],
            mantralayaName: [undefined],
            biBhag: [undefined],
            regOffice: [undefined],
            act: [undefined],
            underName: [undefined],
            underDate: [undefined],
            praliNo: [undefined],
            sewaKaryalaya: [undefined],
            lekhaNumDate: [undefined],
            certficateNo: [undefined],
            certifiedDistrict: [undefined],
            certifiedMunicipality: [undefined],
            certifiedWardNo: [undefined],
            certifiedRegOffice: [undefined],
            certifiedGrandParentName: [undefined],
            certifiedParentName: [undefined],
            certifiedHusbandWifeName: [undefined],
            certifiedPersonDistrict: [undefined],
            certifiedPersonMunicipality: [undefined],
            certifiedPersonWardNo: [undefined],
            certifiedPersonTempDistrict: [undefined],
            certifiedPersonTempVDC: [undefined],
            certifiedPersonTempWardNo: [undefined],
            certifiedPersonAge: [undefined],
            certifiedPersonName: [undefined],
            certifiedPersonCitizenshipNo: [undefined],
            certifiedDate: [undefined],
            certifiedCdoOffice: [undefined],
            namjariDate: [undefined],
            itiSambatYear: [undefined],
            itiSambatMonth: [undefined],
            itiSambatDate: [undefined],
            itiSambatTime: [undefined],
            itiSambatRoj: [undefined],
            sthit: [undefined],
            staDistrict: [undefined],
            guarantorDetails: this.formBuilder.array([]),
            swikritiBibaran: this.formBuilder.array([this.swikritiFormGroup()]),
            security: this.formBuilder.array([]),
            witnessName: [undefined],
            witnessCitizenshipNo: [undefined],
            witnessCitizenshipIssueDate: [undefined],
            witnessCDOoffice: [undefined],
            witnessIssuedPlace: [undefined],
            witnessMunicipality: [undefined],
            witnessWardNo: [undefined],
            witnessName1: [undefined],
            witnessCitizenshipNo1: [undefined],
            witnessCitizenshipIssueDate1: [undefined],
            witnessCDOoffice1: [undefined],
            witnessIssuedPlace1: [undefined],
            witnessMunicipality1: [undefined],
            witnessWardNo1: [undefined],
            likhat: [undefined]
        });
    }

    addSecurity(): void {
        const formArray = this.form.get('security') as FormArray;
        formArray.push(this.securityFormGroup());

    }

    removeSecurity(index): void {
        const formArray = this.form.get('security') as FormArray;
        formArray.removeAt(index);
    }

    securityFormGroup(): FormGroup {
        return this.formBuilder.group({
            SecuritiesSNBibaran: [undefined],
            SecuritiesDistrict: [undefined],
            SecuritiesMunicipality: [undefined],
            SecuritiesWardNo: [undefined],
            SecuritiesKeyNo: [undefined],
            SecuritiesArea: [undefined],
            SecuritiesRegNo: [undefined],
            SecuritiesOwnerName: [undefined],
        });

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

    addGuarantor(): void {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.push(this.guarantorFormGroup());
    }

    removeGuarantor(index: number): void {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.removeAt(index);
    }

    setGuarantors(data) {
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


    }

    addSwikriti(): void {
        const formArray = this.form.get('swikritiBibaran') as FormArray;
        formArray.push(this.swikritiFormGroup());
    }


    removeSwikriti(index: number): void {
        const formArray = this.form.get('swikritiBibaran') as FormArray;
        formArray.removeAt(index);
    }

    swikritiFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanType: [undefined],
            loanAmountInWords: [undefined],
            interestRate: [undefined],
            serviceFeePercent: [undefined],
            tenureOfLoanInYears: [undefined]
        });
    }

}
