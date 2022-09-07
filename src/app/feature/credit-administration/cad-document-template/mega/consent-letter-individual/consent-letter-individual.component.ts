import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
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
    selector: 'app-consent-letter-individual',
    templateUrl: './consent-letter-individual.component.html',
    styleUrls: ['./consent-letter-individual.component.scss']
})
export class ConsentLetterIndividualComponent implements OnInit {


    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    consentLetterIndividual: FormGroup;
    nepData;
    initialInfo;

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    this.consentLetterIndividual.patchValue(JSON.parse(singleCadFile.initialInformation));
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        console.log(this.nepData);
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.consentLetterIndividual.patchValue(this.initialInfo);
        } else {
            this.fillForm();
        }
    }

    buildForm() {
        this.consentLetterIndividual = this.formBuilder.group({
            branchOffice: [undefined],
            companyAct: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            husbandName: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipality: [undefined],
            permanentWard: [undefined],
            permanentTole: [undefined],
            temporaryProvince: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipality: [undefined],
            temporaryWard: [undefined],
            borrowerAge: [undefined],
            borrowerName: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            FACOwnerName: [undefined],
            landOwnerName: [undefined],
            landOwnerDistrict: [undefined],
            landOwnerMunicipality: [undefined],
            landOwnerWard: [undefined],
            landOwnerTole: [undefined],
            landOwnerKittaNo: [undefined],
            landArea: [undefined],
            fullYear: [undefined],
            monthOfYear: [undefined],
            dayOfMonth: [undefined],
            timeOfDay: [undefined],
            witnessOne: [undefined],
            witnessTwo: [undefined],
            agreementPerson1: [undefined],
            relationWithBorrower: [undefined],
            agreementPerson2: [undefined],
            relationWithBorrower1: [undefined],
            agreementPerson3: [undefined],
            relationWithBorrower2: [undefined],
            agreementPerson4: [undefined],
            relationWithBorrower3: [undefined],
        });
    }

    fillForm() {
        this.consentLetterIndividual.patchValue({
                branchOffice: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
                grandFatherName: [!ObjectUtil.isEmpty(this.nepData.grandFatherName) ? this.nepData.grandFatherName : ''],
                fatherName: [!ObjectUtil.isEmpty(this.nepData.fatherName) ? this.nepData.fatherName : ''],
                husbandName: [!ObjectUtil.isEmpty(this.nepData.husbandName) ? this.nepData.husbandName : ''],
                permanentDistrict: [!ObjectUtil.isEmpty
                (this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.district : ''],
                permanentMunicipality: [!ObjectUtil.isEmpty
                (this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.municipality : ''],
                permanentWard: [!ObjectUtil.isEmpty
                (this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.wardNo : ''],
                permanentTole: [!ObjectUtil.isEmpty
                (this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.tole : ''],
                temporaryDistrict: [!ObjectUtil.isEmpty
                (this.nepData.customerTemporaryAddress) ? this.nepData.customerTemporaryAddress.district : ''],
                temporaryMunicipality: [!ObjectUtil.isEmpty
                (this.nepData.customerTemporaryAddress) ? this.nepData.customerTemporaryAddress.municipality : ''],
                temporaryWard: [!ObjectUtil.isEmpty
                (this.nepData.customerTemporaryAddress) ? this.nepData.customerTemporaryAddress.wardNo : ''],
                borrowerName: [!ObjectUtil.isEmpty
                (this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
                amount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
                amountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
                FACOwnerName: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0]) ? this.nepData.collateralDetails[0].nameInNepali : ''],
                landOwnerName: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0]) ? this.nepData.collateralDetails[0].nameInNepali : ''],
                landOwnerDistrict: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                    ? this.nepData.collateralDetails[0].landAndBuildingDetail.district : ''],
                landOwnerMunicipality: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                    ? this.nepData.collateralDetails[0].landAndBuildingDetail.municipality : ''],
                landOwnerWard: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.wardNo : ''],
                landOwnerTole: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.tole : ''],
                landOwnerKittaNo: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.plotNo : ''],
                landArea: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.area : ''],
            }
        );
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.consentLetterIndividual.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.consentLetterIndividual.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.consentLetterIndividual.value);
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

    changeToNepAmount(event: any, target, from) {
        this.consentLetterIndividual.get([target]).patchValue(event.nepVal);
        this.consentLetterIndividual.get([from]).patchValue(event.val);
    }

    patchFunction(target) {
        const patchValue1 = this.consentLetterIndividual.get([target]).value;
        return patchValue1;
    }
}
