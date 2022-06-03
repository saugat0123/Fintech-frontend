import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerType} from '../../../../../customer/model/customerType';
import {CustomerInfoData} from '../../../../../loan/model/customerInfoData';

@Component({
    selector: 'app-consent-letter-individual',
    templateUrl: './consent-letter-individual.component.html',
    styleUrls: ['./consent-letter-individual.component.scss']
})
export class ConsentLetterIndividualComponent implements OnInit {
    @Input() customerInfo: CustomerInfoData;
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
    isIndividual = false;

    constructor(
        private dialogRef: NbDialogRef<ConsentLetterIndividualComponent>,
        private formBuilder: FormBuilder,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private administrationService: CreditAdministrationService,
        private toastService: ToastService,
        private routerUtilsService: RouterUtilsService,
    ) {
    }

    ngOnInit() {
        this.bindForm();
        this.fillForm();
        if (!ObjectUtil.isEmpty(this.cadData)) {
            if (this.cadData.assignedLoan[0].loanHolder.customerType.toString() === 'INDIVIDUAL') {
                this.isIndividual = true;
            } else {
                this.isIndividual = false;
            }
        }
    }

    fillForm(): void {
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    const initialInfo = JSON.parse(singleCadFile.initialInformation);
                    this.initialInfoPrint = initialInfo;
                    if (!ObjectUtil.isEmpty(initialInfo.sahamati)) {
                        this.setSahamati(initialInfo.sahamati);
                    }
                    if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
                        this.setGuarantorDetails(initialInfo.guarantorDetails);
                    }
                    this.form.patchValue(this.initialInfoPrint);
                }
            });
        }


        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
            let allCollateral = '';
            if (!ObjectUtil.isEmpty(this.nepaliData)) {
                (this.nepaliData.collateralDetails).forEach(collateral => {
                    allCollateral = allCollateral + collateral.collateralName + ', ';
                });
                allCollateral = allCollateral.slice(0, -2);
                allCollateral = allCollateral.replace(/,(?=[^,]*$)/, ' /');
            }
            this.form.patchValue({
                customerName: this.nepaliData.name ? this.nepaliData.name : '',
                branch: this.nepaliData.branchName ? this.nepaliData.branchName : '',
                name: this.isIndividual ? this.nepaliData.name : this.nepaliData.companyName,
                fname: allCollateral ? allCollateral : ''
            });
            this.setJayejethaBibaran(this.nepaliData.collateralDetails);
        }
    }

    submit(): void {
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

    bindForm(): void {
        this.form = this.formBuilder.group({
            branch: [undefined],
            name: [undefined],
            fname: [undefined],
            gharName: [undefined],
            district: [undefined],
            wadNo: [undefined],
            kiNo: [undefined],
            bargaMeter: [undefined],
            sitNo: [undefined],
            itisambatYear: [undefined],
            itisambatMonth: [undefined],
            itisambatDay: [undefined],
            itisambatTime: [undefined],
            itisambatRojSubham: [undefined],
            sahamati: this.formBuilder.array([this.Sahamati()]),
            guarantorDetails: this.formBuilder.array([]),
            jayejethaBibaran: this.formBuilder.array([]),
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
            parentName: [undefined],
            grandParentName: [undefined]
        });
    }

    addSahamati() {
        const formArray = this.form.get('sahamati') as FormArray;
        formArray.push(this.Sahamati());
    }

    removeSahamati(i) {
        const formGroup = this.form.get('sahamati') as FormArray;
        formGroup.removeAt(i);
    }

    Sahamati(): FormGroup {
        return this.formBuilder.group({
            sahamatiName: [undefined],
            relationship: [undefined],
            signature: [undefined]
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

    guarantorFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined],
            citizenNumber: [undefined],
            issuedYear: [undefined],
            guarantorCDOoffice: [undefined],
            guarantorDistrict: [undefined],
            guarantorMunicipality: [undefined],
            guarantorWadNo: [undefined]
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
                name: [value.name],
                citizenNumber: [value.citizenNumber],
                issuedYear: [value.issuedYear],
                guarantorCDOoffice: [value.guarantorCDOoffice],
                guarantorDistrict: [value.guarantorDistrict],
                guarantorMunicipality: [value.guarantorMunicipality],
                guarantorWadNo: [value.guarantorWadNo]
            }));
        });
    }

    addJayejethaBibaran(): void {
        const formArray = this.form.get('jayejethaBibaran') as FormArray;
        formArray.push(this.guarantorFormGroup());
    }

    removeJayejethaBibaran(index: number): void {
        const formArray = this.form.get('jayejethaBibaran') as FormArray;
        formArray.removeAt(index);
    }

    jayejethaBibaranFormGroup(): FormGroup {
        return this.formBuilder.group({
            gharName: [undefined],
            parentName: [undefined],
            grandParentName: [undefined],
            district: [undefined],
            munVdc: [undefined],
            wadNo: [undefined],
            kiNo: [undefined],
            bargaMeter: [undefined],
            sitNo: [undefined],
        });
    }


    setJayejethaBibaran(data) {
        const formArray = this.form.get('jayejethaBibaran') as FormArray;
        if (data.length === 0) {
            this.addJayejethaBibaran();
            return;
        }
        data.forEach((value) => {
            formArray.push(this.formBuilder.group({
                gharName: [value.collateralName],
                parentName: [value.collateralFatherName],
                grandParentName: [value.collateralGrandFatherName],
                district: [value.collateralDistrict],
                munVdc: [value.collateralMunVdcOriginal],
                wadNo: [value.collateralWardNoOld],
                kiNo: [value.plotNo],
                bargaMeter: [value.areaOfCollateral],
                sitNo: [value.seatNo],
            }));
        });
    }

    setSahamati(data) {
        const formArray = this.form.get('sahamati') as FormArray;
        (this.form.get('sahamati') as FormArray).clear();
        if (data.length === 0) {
            this.addSahamati();
            return;
        }
        data.forEach((e) => {
            formArray.push(this.formBuilder.group({
                sahamatiName: [undefined],
                relationship: [undefined],
                signature: [undefined]
            }));
        });
    }
}
