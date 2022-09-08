import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
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
    selector: 'app-loan-deed-individual',
    templateUrl: './loan-deed-individual.component.html',
    styleUrls: ['./loan-deed-individual.component.scss']
})
export class LoanDeedIndividualComponent implements OnInit {

    loanDeedIndividual: FormGroup;
    singleData;
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
            this.singleData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.loanDeedIndividual.patchValue(this.initialInfo);
        } else {
            this.fillForm();
        }
    }

    buildForm() {
        this.loanDeedIndividual = this.formBuilder.group({
            branch: [undefined],
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
            borrowerName: [undefined],
            offerLetterIssuedDate: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            loanFacilityType: [undefined],
            FACOwnerName: [undefined],
            FACOwnerDistrict: [undefined],
            FACOwnerMunicipalityVDC: [undefined],
            FACOwnerWardNo: [undefined],
            nakshaSeatNo: [undefined],
            plotNo: [undefined],
            area: [undefined],
            witnessName: [undefined],
            witnessName2: [undefined],
            witnessName3: [undefined],
            year: [undefined],
            month: [undefined],
            day: [undefined],
            time: [undefined]
        });
    }

    fillForm() {
        this.loanDeedIndividual.patchValue({
                branch: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
                grandFatherName: [!ObjectUtil.isEmpty(this.nepData.grandFatherName) ? this.nepData.grandFatherName : ''],
                fatherName: [!ObjectUtil.isEmpty(this.nepData.fatherName) ? this.nepData.fatherName : ''],
                husbandName: [!ObjectUtil.isEmpty(this.nepData.husbandName) ? this.nepData.husbandName : ''],
                permanentDistrict: [!ObjectUtil.isEmpty
                (this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.district : ''],
                permanentMunicipalityVDC: [!ObjectUtil.isEmpty
                (this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.municipality : ''],
                permanentWardNo: [!ObjectUtil.isEmpty
                (this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.wardNo : ''],
                permanentTole: [!ObjectUtil.isEmpty
                (this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.tole : ''],
                temporaryDistrict: [!ObjectUtil.isEmpty
                (this.nepData.customerTemporaryAddress) ? this.nepData.customerTemporaryAddress.district : ''],
                temporaryMunicipalityVDC: [!ObjectUtil.isEmpty
                (this.nepData.customerTemporaryAddress) ? this.nepData.customerTemporaryAddress.municipality : ''],
                temporaryWardNo: [!ObjectUtil.isEmpty
                (this.nepData.customerTemporaryAddress) ? this.nepData.customerTemporaryAddress.wardNo : ''],
                borrowerName: [!ObjectUtil.isEmpty
                (this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
                offerLetterIssuedDate: [!ObjectUtil.isEmpty
                (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
                amount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
                amountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
                loanFacilityType: [!ObjectUtil.isEmpty
                (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanFacilityTypeInNep : ''],
                FACOwnerName: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0]) ? this.nepData.collateralDetails[0].nameInNepali : ''],
                FACOwnerDistrict: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                    ? this.nepData.collateralDetails[0].landAndBuildingDetail.district : ''],
                FACOwnerMunicipalityVDC: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                    ? this.nepData.collateralDetails[0].landAndBuildingDetail.municipality : ''],
                FACOwnerWardNo: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.wardNo : ''],
                FACOwnerTole: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.tole : ''],
                nakshaSeatNo: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                    ? this.nepData.collateralDetails[0].landAndBuildingDetail.nakshaSeatNo : ''],
                plotNo: [!ObjectUtil.isEmpty
                (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.plotNo : ''],
                area: [!ObjectUtil.isEmpty
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
                    singleCadFile.initialInformation = JSON.stringify(this.loanDeedIndividual.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.loanDeedIndividual.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.loanDeedIndividual.value);
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

    changeToNepAmount(event: any, target, from) {
        this.loanDeedIndividual.get([target]).patchValue(event.nepVal);
        this.loanDeedIndividual.get([from]).patchValue(event.val);
    }

    patchFunction(target) {
        const patchValue1 = this.loanDeedIndividual.get([target]).value;
        return patchValue1;
    }
}
