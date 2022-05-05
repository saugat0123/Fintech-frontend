import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
    selector: 'app-letter-vehicle-individual',
    templateUrl: './letter-vehicle-individual.component.html',
    styleUrls: ['./letter-vehicle-individual.component.scss']
})
export class LetterVehicleIndividualComponent implements OnInit {
    letterVehicleIndividual: FormGroup;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    individualData;
    initialInfoPrint;
    offerLetterConst = NabilDocumentChecklist;
    nepaliNumber = new NepaliNumberAndWords();
    nepData;
    clientType;
    customerType = CustomerType;
    customerSubType = CustomerSubType;
    selectiveArr = [];
    offerLetterDocument;
    educationalTemplateData;
    supportedInfo;
    initialInfo;
    sanctionDate;

    constructor(
        private formBuilder: FormBuilder,
        private administrationService: CreditAdministrationService,
        private toastService: ToastService,
        private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
        private routerUtilsService: RouterUtilsService,
        public datePipe: DatePipe,
        private englishNepaliDatePipe: EngNepDatePipe
    ) {
    }

    async ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData) && (!ObjectUtil.isEmpty(this.cadData.cadFileList))) {
            this.cadData.cadFileList.forEach(individualCadFile => {
                if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
                    this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        console.log('individual data:::: ', this.supportedInfo);
        console.log('cad data:::: ', this.cadData);
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0])) {
            this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
        }
        this.setIssuedDate();
        this.fillform();
    }

    buildForm() {
        this.letterVehicleIndividual = this.formBuilder.group({
            nameOfBranchLocated: [undefined],
            date: [undefined],
            nameOfGrandFather: [undefined],
            fatherName: [undefined],
            district: [undefined],
            vdcMuncipality: [undefined],
            wardNo: [undefined],
            nameOfBorrower: [undefined],
            sanctionLetterIssuedDate: [undefined],
            modelTypeOfVehicle: [undefined],
            vehicleRegistrationNumber: [undefined],
            engineNumber: [undefined],
            chasisNumber: [undefined],
        });
    }

    fillform() {
        let fatherName;
        let grandName;
        if (this.individualData.gender.en === 'MALE' ||
            (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '1')) {
            fatherName = !ObjectUtil.isEmpty(this.individualData.fatherName) ? this.individualData.fatherName.ct : '';
            grandName = !ObjectUtil.isEmpty(this.individualData.grandFatherName) ? this.individualData.grandFatherName.ct : '';
        }
        if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '0') {
            grandName = !ObjectUtil.isEmpty(this.individualData.fatherInLawName) ? this.individualData.fatherInLawName.ct : '';
            fatherName = !ObjectUtil.isEmpty(this.individualData.husbandName) ? this.individualData.husbandName.ct : '';
        }

        this.letterVehicleIndividual.patchValue({
                nameOfBranchLocated: !ObjectUtil.isEmpty(this.individualData.branch) ? this.individualData.branch.ct : '',
                date: !ObjectUtil.isEmpty(this.supportedInfo) ? this.supportedInfo.date : '',
                nameOfGrandFather: !ObjectUtil.isEmpty(grandName) ? grandName : '',
                fatherName: !ObjectUtil.isEmpty(fatherName) ? fatherName : '',
                district: !ObjectUtil.isEmpty(this.individualData.permanentDistrict) ? this.individualData.permanentDistrict.ct : '',
                // tslint:disable-next-line:max-line-length
                vdcMuncipality: !ObjectUtil.isEmpty(this.individualData.permanentMunicipality) ? this.individualData.permanentMunicipality.ct : '',
                wardNo: !ObjectUtil.isEmpty(this.individualData.permanentWard) ? this.individualData.permanentWard.ct : '',
                nameOfBorrower: !ObjectUtil.isEmpty(this.individualData.name) ? this.individualData.name.ct : '',
                sanctionLetterIssuedDate: !ObjectUtil.isEmpty(this.sanctionDate) ? this.sanctionDate : '',
                modelTypeOfVehicle: !ObjectUtil.isEmpty(this.supportedInfo) ? this.supportedInfo.modelTypeOfVehicle : '',
                vehicleRegistrationNumber: !ObjectUtil.isEmpty(this.supportedInfo) ? this.supportedInfo.vehicleRegistrationNumber : '',
                engineNumber: !ObjectUtil.isEmpty(this.supportedInfo) ? this.supportedInfo.engineNumber : '',
                chasisNumber: !ObjectUtil.isEmpty(this.supportedInfo) ? this.supportedInfo.chasisNumber : ''
            }
        );
    }

    setIssuedDate() {
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
            const dateOfApprovalType = this.initialInfo.retailGlobalForm.sanctionLetterDateType ?
                this.initialInfo.retailGlobalForm.sanctionLetterDateType : '';
            if (dateOfApprovalType === 'AD') {
                const templateDateApproval = this.initialInfo.retailGlobalForm.sanctionLetterDate ?
                    this.initialInfo.retailGlobalForm.sanctionLetterDateCT : '';
                this.sanctionDate = templateDateApproval;
            } else {
                const templateDateApproval = this.initialInfo.retailGlobalForm.sanctionLetterDateNepali ?
                    this.initialInfo.retailGlobalForm.sanctionLetterDateNepaliCT : '';
                this.sanctionDate = templateDateApproval ? templateDateApproval : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Educational Loan') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal Loan') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal Overdraft') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal loan and personal overdraft') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateofApprovalNepali.en ? this.initialInfo.dateofApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Home Loan') {
            const dateOfApprovalType = this.initialInfo.loan ? this.initialInfo.loan.dateType : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.loan.dateOfApproval ? this.initialInfo.loan.dateOfApproval : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.loan.nepaliDateOfApproval ? this.initialInfo.loan.nepaliDateOfApproval.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Mortage Loan') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
            const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
            if (dateOfApproval === 'AD') {
                this.sanctionDate = this.initialInfo.sanctionLetterDate ? this.initialInfo.sanctionLetterDate.ct : '';
            } else {
                this.sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const templateDateApproval = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.ct : '';
                this.sanctionDate = templateDateApproval;
            } else {
                const templateDateApproval = this.initialInfo.dateOfApprovalNepali ? this.initialInfo.dateOfApprovalNepali.en : '';
                this.sanctionDate = templateDateApproval ? templateDateApproval.nDate : '';
            }
        }
    }

    setFreeText() {
        const free1 = {
            date: this.letterVehicleIndividual.get('date') ? this.letterVehicleIndividual.get('date').value : '',
            modelTypeOfVehicle: this.letterVehicleIndividual.get('modelTypeOfVehicle') ? this.letterVehicleIndividual.get('modelTypeOfVehicle').value : '',
            vehicleRegistrationNumber: this.letterVehicleIndividual.get('vehicleRegistrationNumber') ?
                this.letterVehicleIndividual.get('vehicleRegistrationNumber').value : '',
            engineNumber: this.letterVehicleIndividual.get('engineNumber') ? this.letterVehicleIndividual.get('engineNumber').value : '',
            chasisNumber: this.letterVehicleIndividual.get('chasisNumber') ? this.letterVehicleIndividual.get('chasisNumber').value : ''
        };
        return JSON.stringify(free1);
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.supportedInformation = this.setFreeText();
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.supportedInformation = this.setFreeText();
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.letterVehicleIndividual.value);
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
}
