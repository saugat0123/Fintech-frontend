import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
    selector: 'app-loan-deed-company',
    templateUrl: './loan-deed-company.component.html',
    styleUrls: ['./loan-deed-company.component.scss']
})
export class LoanDeedCompanyComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    loanDeedCompany: FormGroup;
    nepData;
    initialInfo;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit(): void {
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
            this.setTableData(this.initialInfo.loanData);
            this.loanDeedCompany.patchValue(this.initialInfo);
        } else {
            this.addTableData();
            this.fillForm();
        }
    }

    buildForm() {
        this.loanDeedCompany = this.formBuilder.group({
            loanData: this.formBuilder.array([]),
            branch: [undefined],
            act: [undefined],
            registrationOffice: [undefined],
            registrationIssuedDate: [undefined],
            registrationNo: [undefined],
            registrationOfficeDistrict: [undefined],
            registrationOfficeMunicipalityVDC: [undefined],
            registrationOfficeWardNo: [undefined],
            borrowerName: [undefined],
            authorizedPersonName: [undefined],
            offerLetterIssuedDate: [undefined],
            signature: [undefined],
            totalAmount: [undefined],
            totalAmountInWords: [undefined],
            FACOwnerName: [undefined],
            FACOwnerDistrict: [undefined],
            FACOwnerMunicipalityVDC: [undefined],
            FACOwnerWardNo: [undefined],
            nakshaSeatNo: [undefined],
            plotNo: [undefined],
            area: [undefined],
            year: [undefined],
            month: [undefined],
            day: [undefined],
            time: [undefined],
            nameMa: [undefined],
            jariGareko: [undefined],
            freeText: [undefined],
            freeText2: [undefined],
        });

    }

    fillForm() {
        this.loanDeedCompany.patchValue({
            branch: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
            registrationOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
            registrationIssuedDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
            registrationNo: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
            registrationOfficeDistrict: [!ObjectUtil.isEmpty
            (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
            registrationOfficeMunicipalityVDC: [!ObjectUtil.isEmpty
            (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
            registrationOfficeWardNo: [!ObjectUtil.isEmpty
            (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.wardNo : ''],
            borrowerName: [!ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
            authorizedPersonName: [!ObjectUtil.isEmpty
            (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
            offerLetterIssuedDate: [!ObjectUtil.isEmpty
            (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
            loanFacilityType: [!ObjectUtil.isEmpty
            (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanFacilityTypeInNep : ''],
            amount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
            amountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
            loanFacilityType2: [!ObjectUtil.isEmpty
            (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanFacilityTypeInNep : ''],
            amount2: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
            amountInWords2: [!ObjectUtil.isEmpty
            (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
            FACOwnerName: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0]) ? this.nepData.collateralDetails[0].nameInNepali : ''],
            FACOwnerDistrict: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                ? this.nepData.collateralDetails[0].landAndBuildingDetail.district : ''],
            FACOwnerMunicipalityVDC: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                ? this.nepData.collateralDetails[0].landAndBuildingDetail.municipality : ''],
            FACOwnerWardNo: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                ? this.nepData.collateralDetails[0].landAndBuildingDetail.wardNo : ''],
            nakshaSeatNo: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                ? this.nepData.collateralDetails[0].landAndBuildingDetail.nakshaSeatNo : ''],
            plotNo: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
                ? this.nepData.collateralDetails[0].landAndBuildingDetail.plotNo : ''],
            area: [!ObjectUtil.isEmpty
            (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.area : ''],
        });
        this.loanDeedCompany.get
        (['loanData', 0, 'loanFacilityType']).patchValue(this.nepData.miscellaneousDetail.loanFacilityTypeInNep);
        this.loanDeedCompany.get(['loanData', 0, 'amount2']).patchValue(this.nepData.miscellaneousDetail.loanAmountInFig);
        this.loanDeedCompany.get(['loanData', 0, 'amountInWords2']).patchValue(this.nepData.miscellaneousDetail.loanAmountInWord);
    }
    addTableData() {
        (this.loanDeedCompany.get('loanData') as FormArray).push(
            this.formBuilder.group({
                loanFacilityType: [undefined],
                amount2: [undefined],
                amountInWords2: [undefined],
            })
        );
    }

    setTableData(data) {
        const formArray = this.loanDeedCompany.get('loanData') as FormArray;
        if (data.length === 0) {
            this.addTableData();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                loanFacilityType: [value.loanFacilityType],
                amount2: [value.amount2],
                amountInWords2: [value.amountInWords2],
            }));
        });
    }

    removeLoanDetail(index) {
        (this.loanDeedCompany.get('loanData') as FormArray).removeAt(index);
    }


    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
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
        this.loanDeedCompany.get([target]).patchValue(event.nepVal);
        this.loanDeedCompany.get([from]).patchValue(event.val);
    }

    patchFunction(target) {
        const patchValue1 = this.loanDeedCompany.get([target]).value;
        return patchValue1;
    }

    changeToNepAmount1(event: any, i, formArrayName) {
        this.loanDeedCompany.get([formArrayName, i, 'amountInWords2']).patchValue(event.nepVal);
        this.loanDeedCompany.get([formArrayName, i, 'amount2']).patchValue(event.val);
    }

    patchFunction1(formArrayName, i, formControlName) {
        const patchValue1 = this.loanDeedCompany.get([formArrayName, i, formControlName]).value;
        return patchValue1;
    }
}
