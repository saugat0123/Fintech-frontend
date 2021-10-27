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
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';


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


    constructor(private dialogRef: NbDialogRef<LoanDeedComponent>,
                private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService,
                private customerOfferLetterService: CustomerOfferLetterService) {
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
                    if (!ObjectUtil.isEmpty(initialInfo.security)) {
                        this.setSecurity(initialInfo.security);
                    }
                    this.form.patchValue(this.initialInfoPrint);
                    this.setGuarantors(initialInfo.guarantorDetails);
                }
            });
        }


        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

            this.form.patchValue({
                grandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
                parentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
                customerName: this.nepaliData.name ? this.nepaliData.name : '',
                age: this.nepaliData.age ? this.nepaliData.age : '',
                likhitDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
                likhitMunicipalty: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
                likhitWadNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
                tempVDC: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
                staDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
                tempWadNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
                citizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
                date: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
                cdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
            });
        }
    }

    setSwikriti(data) {
        const formArray = this.form.get('swikritiBibaran') as FormArray;
        (this.form.get('swikritiBibaran') as FormArray).clear();
        if (data.length === 0) {
            this.addSwikriti();
            return;
        }
        data.forEach((value) => {
            formArray.push(this.formBuilder.group({
                approvedSubidhakisim: [value.approvedSubidhakisim],
                approvedAmount: [value.approvedAmount],
                approvedCommision: [value.approvedCommision],
                approvedLoanTime: [value.approvedLoanTime],
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
            formArray.push(this.formBuilder.group({
                SecuritiesSN: [undefined],
                SecuritiesSNBibaran: [undefined],
                SecuritiesDistrict: [undefined],
                SecuritiesMunicipality: [undefined],
                SecuritiesWadNo: [undefined],
                SecuritiesKeyNo: [undefined],
                SecuritiesArea: [undefined],
                SecuritiesRegNo: [undefined],
                SecuritiesOwnerName: [undefined],
            }));
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
            district: [undefined],
            municipality: [undefined],
            wadNo: [undefined],
            branchName: [undefined],
            grandParentName: [undefined],
            parentName: [undefined],
            husbandWifeName: [undefined],
            likhitDistrict: [undefined],
            likhitMunicipalty: [undefined],
            likhitWadNo: [undefined],
            sabikVDC: [undefined],
            sabikWadNo: [undefined],
            tempVDC: [undefined],
            tempWadNo: [undefined],
            age: [undefined],
            customerName: [undefined],
            citizenshipNo: [undefined],
            date: [undefined],
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
            certifiedWadNo: [undefined],
            certifiedRegOffice: [undefined],
            certifiedGrandParentName: [undefined],
            certifiedParentName: [undefined],
            certifiedHusbandWifeName: [undefined],
            certifiedPersonDistrict: [undefined],
            certifiedPersonMunicipality: [undefined],
            certifiedPersonWadNo: [undefined],
            certifiedPersonTempDistrict: [undefined],
            certifiedPersonTempVDC: [undefined],
            certifiedPersonTempWadNo: [undefined],
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
            SecuritiesSN: [undefined],
            sthit: [undefined],
            staDistrict: [undefined],
            guarantorDetails: this.formBuilder.array([]),
            swikritiBibaran: this.formBuilder.array([this.swikritiFormGroup()]),
            security: this.formBuilder.array([])
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
            SecuritiesSN: [undefined],
            SecuritiesSNBibaran: [undefined],
            SecuritiesDistrict: [undefined],
            SecuritiesMunicipality: [undefined],
            SecuritiesWadNo: [undefined],
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
            approvedSubidhakisim: [undefined],
            approvedAmount: [undefined],
            approvedCommision: [undefined],
            approvedLoanTime: [undefined],
        });
    }

}
