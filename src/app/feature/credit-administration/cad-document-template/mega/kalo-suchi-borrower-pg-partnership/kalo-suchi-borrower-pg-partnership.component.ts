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
    selector: 'app-kalo-suchi-borrower-pg-partnership',
    templateUrl: './kalo-suchi-borrower-pg-partnership.component.html',
    styleUrls: ['./kalo-suchi-borrower-pg-partnership.component.scss']
})
export class KaloSuchiBorrowerPgPartnershipComponent implements OnInit {


    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    kaloSuchiBorrowerPgPartnership: FormGroup;
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
                    this.kaloSuchiBorrowerPgPartnership.patchValue(JSON.parse(singleCadFile.initialInformation));
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.kaloSuchiBorrowerPgPartnership.patchValue(this.initialInfo);
        } else {
            this.fillForm();
        }
    }

    buildForm() {
        this.kaloSuchiBorrowerPgPartnership = this.formBuilder.group({
            borrowerName: [undefined],
            institutionRegDistrict: [undefined],
            institutionRegMunicipality: [undefined],
            institutionRegWard: [undefined],
            institutionRegTole: [undefined],
            loanFacilityTypeNepali: [undefined],
            guarantorName: [undefined],
            guarantorFatherName: [undefined],
            guarantorFatherInLawName: [undefined],
            guarantorHusbandName: [undefined],
            guarantorCitizenshipNum: [undefined],
            gurantorCitizenshipIssuedDate: [undefined],
            gurantorCitizenshipIssuingOffice: [undefined],
            guarantorDistrictPermanent: [undefined],
            guarantorMunicipalityPermanent: [undefined],
            guarantorWardPermanent: [undefined],
            guarantorTolePermanent: [undefined],
            guarantorCurProvince: [undefined],
            guarantorCurDistrict: [undefined],
            guarantorCurMunicipality: [undefined],
            guarantorCurWard: [undefined],
            date: [undefined],
        });
    }

    fillForm() {
        this.kaloSuchiBorrowerPgPartnership.patchValue({
            borrowerName: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
            institutionRegDistrict: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
                this.nepData.institutionRegisteredAddress.district : '',
            institutionRegMunicipality: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
                this.nepData.institutionRegisteredAddress.municipality : '',
            institutionRegWard: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
                this.nepData.institutionRegisteredAddress.wardNo : '',
            institutionRegTole: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.tole) ?
                this.nepData.institutionRegisteredAddress.tole : '',
            loanFacilityTypeNepali: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                this.nepData.miscellaneousDetail.loanFacilityTypeInNep : '',
            guarantorName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].name : '',
            guarantorFatherName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].fatherName : '',
            guarantorFatherInLawName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].fatherInLawName : '',
            guarantorHusbandName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].husbandName : '',
            guarantorCitizenshipNum: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].citizenshipNo : '',
            gurantorCitizenshipIssuedDate: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].citizenshipIssueDate : '',
            gurantorCitizenshipIssuingOffice: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
                this.nepData.guarantorDetails[0].citizenshipIssueDistrict : '',
            guarantorDistrictPermanent: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
                this.nepData.guarantorDetails[0].guarantorPermanentAddress.district : '',
            guarantorMunicipalityPermanent: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
                this.nepData.guarantorDetails[0].guarantorPermanentAddress : '',
            guarantorWardPermanent: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
                this.nepData.guarantorDetails[0].guarantorPermanentAddress : '',
            guarantorTolePermanent: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
                this.nepData.guarantorDetails[0].guarantorPermanentAddress : '',
            guarantorCurProvince: undefined,
            guarantorCurDistrict: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
                this.nepData.guarantorDetails[0].guarantorTemporaryAddress : '',
            guarantorCurMunicipality: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
                this.nepData.guarantorDetails[0].guarantorTemporaryAddress : '',
            guarantorCurWard: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
                this.nepData.guarantorDetails[0].guarantorTemporaryAddress : '',
            date: undefined,
        });
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerPgPartnership.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerPgPartnership.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerPgPartnership.value);
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

}
