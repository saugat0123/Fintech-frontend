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
    selector: 'app-kalo-suchi-borrower-pg-individual',
    templateUrl: './kalo-suchi-borrower-pg-individual.component.html',
    styleUrls: ['./kalo-suchi-borrower-pg-individual.component.scss']
})
export class KaloSuchiBorrowerPgIndividualComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    kaloSuchiBorrowerPgIndividual: FormGroup;
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
                    this.initialInfo = JSON.parse(singleCadFile.initialInformation);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.kaloSuchiBorrowerPgIndividual.patchValue(this.initialInfo);
        } else {
            this.fillForm();
        }
    }


    buildForm() {
        this.kaloSuchiBorrowerPgIndividual = this.formBuilder.group({
            borrowerName: [undefined],
            districtPermanent: [undefined],
            municipalityPermanent: [undefined],
            wardNumPermanent: [undefined],
            tolePermanent: [undefined],
            provinceCurrent: [undefined],
            districtCurrent: [undefined],
            municipalityCurrent: [undefined],
            wardCurrent: [undefined],
            toleCurrent: [undefined],
            loanFacilityTypeNepali: [undefined],
            guarantorName: [undefined],
            relationship: [undefined],
            guarantorFatherName: [undefined],
            guarantorFatherInLawName: [undefined],
            guarantorGFatherName: [undefined],
            guarantorHusbandName: [undefined],
            guarantorDistrictPermanent: [undefined],
            guarantorMunicipalityPermanent: [undefined],
            guarantorWardPermanent: [undefined],
            guarantorTolePermanent: [undefined],
            guarantorCurProvince: [undefined],
            guarantorCurDistrict: [undefined],
            guarantorCurMunicipality: [undefined],
            guarantorCurWard: [undefined],
            guarantorCurTole: [undefined],
            guarantorCitizenshipNum: [undefined],
            gurantorCitizenshipIssuedDate: [undefined],
            gurantorCitizenshipIssuingOffice: [undefined],
            date: [undefined],
        });
    }

    fillForm() {
        this.kaloSuchiBorrowerPgIndividual.patchValue({
            borrowerName: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',

            districtPermanent: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.district : '',
            municipalityPermanent: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.municipality : '',
            wardNumPermanent: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ?
                this.nepData.customerPermanentAddress.wardNo : '',
            tolePermanent: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress) ? this.nepData.customerPermanentAddress.tole : '',
            districtCurrent: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.district : '',
            municipalityCurrent: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ?
                this.nepData.customerTemporaryAddress.municipality : '',
            wardCurrent: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ? this.nepData.customerTemporaryAddress.wardNo : '',
            toleCurrent: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress) ? this.nepData.customerTemporaryAddress.tole : '',
            loanFacilityTypeNepali: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                this.nepData.miscellaneousDetail.loanFacilityTypeInNep : '',
            guarantorName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ? this.nepData.guarantorDetails[0].name : '',
            guarantorFatherName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ? this.nepData.guarantorDetails[0].fatherName : '',
            guarantorFatherInLawName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].fatherInLawName : '',
            guarantorGFatherName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].grandFatherName : '',
            guarantorHusbandName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ? this.nepData.guarantorDetails[0].husbandName : '',
            guarantorDistrictPermanent: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
                this.nepData.guarantorDetails[0].guarantorPermanentAddress.district : '',
            guarantorMunicipalityPermanent: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
                this.nepData.guarantorDetails[0].guarantorPermanentAddress.municipality : '',
            guarantorWardPermanent: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
                this.nepData.guarantorDetails[0].guarantorPermanentAddress.wardNo : '',
            guarantorTolePermanent: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
                this.nepData.guarantorDetails[0].guarantorPermanentAddress.tole : '',
            guarantorCurDistrict: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
                this.nepData.guarantorDetails[0].guarantorTemporaryAddress.district : '',
            guarantorCurMunicipality: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
                this.nepData.guarantorDetails[0].guarantorTemporaryAddress.municipality : '',
            guarantorCurWard: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
                this.nepData.guarantorDetails[0].guarantorTemporaryAddress.wardNo : '',
            guarantorCurTole: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
                this.nepData.guarantorDetails[0].guarantorTemporaryAddress.tole : '',
            guarantorCitizenshipNum: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].citizenshipNo : '',
            gurantorCitizenshipIssuedDate: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].citizenshipIssueDate : '',
            gurantorCitizenshipIssuingOffice: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].citizenshipIssueDistrict : '',
        });
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerPgIndividual.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerPgIndividual.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerPgIndividual.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved'));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save'));
            this.dialogRef.close();
        });
    }

}
