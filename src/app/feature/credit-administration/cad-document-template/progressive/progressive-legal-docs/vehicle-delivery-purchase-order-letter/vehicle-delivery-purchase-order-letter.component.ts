import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NbDialogRef} from '@nebular/theme';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';

@Component({
    selector: 'app-vehicle-delivery-purchase-order-letter',
    templateUrl: './vehicle-delivery-purchase-order-letter.component.html',
    styleUrls: ['./vehicle-delivery-purchase-order-letter.component.scss']
})
export class VehicleDeliveryPurchaseOrderLetterComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    offerLetterConst = ProgressiveLegalDocConst;
    vehicleDeliveryForm: FormGroup;
    isIndividual = false;
    nepaliData;
    initialInfoPrint: any;
    nepData: any;
    primaryCollaterals = new Array<any>();

    constructor(private dialogRef: NbDialogRef<VehicleDeliveryPurchaseOrderLetterComponent>,
                private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData)) {
            if (this.cadData.assignedLoan[0].loanHolder.customerType.toString() === 'INDIVIDUAL') {
                this.isIndividual = true;
            } else {
                this.isIndividual = false;
            }
        }
        this.fillForm();
    }

    buildForm() {
        this.vehicleDeliveryForm = this.formBuilder.group({
            date: [undefined],
            patraNumber: [undefined],
            bisaya: [undefined],
            vehicleDetails: this.formBuilder.array([]),
            karmachariName: [undefined],
            postName: [undefined],
            karmachariName2: [undefined],
            postName2: [undefined],
            branchName: [undefined],
            branchDistrict: [undefined],
            customerPermanentDistrict: [undefined],
            customerPermanentVdc: [undefined],
            customerPermanentVdcWard: [undefined],
            customerTemporaryDistrict: [undefined],
            customerTemporaryVdcMun: [undefined],
            customerTemporaryWard: [undefined],
            citizenshipNo: [undefined],
            companyName: [undefined],
            companyDistrict: [undefined],
            companyVdcMun: [undefined],
            companyWardNo: [undefined],
            panNumber: [undefined],
            customerName: [undefined],
            citizenshipIssueAddress: [undefined],
            patraNumberTwo: [undefined],
            patraNumberThree: [undefined],
            patraNumberFour: [undefined],
            dateTwo: [undefined],
            thanOne: [undefined],
            thanTwo: [undefined],
            thanThree: [undefined],
            vehiclePrice: [undefined],
            noteOne: [undefined],
            noteTwo: [undefined],
            proprietor: [undefined],
            loanAmount: [undefined],
            loanAmountInWords: [undefined]
        });
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.nepData = JSON.parse(this.cadData.nepData);
        }
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    const initialInfo = JSON.parse(singleCadFile.initialInformation);
                    this.initialInfoPrint = initialInfo;
                    /* if (!ObjectUtil.isEmpty(initialInfo.vehicleDetails)) {
                       this.setVehicleDetails(initialInfo.vehicleDetails);
                     }*/
                    this.vehicleDeliveryForm.patchValue(this.initialInfoPrint);
                }
            });
            (this.nepaliData.collateralDetails).forEach(value => {
                if (value.securityDetails === 'HP') {
                    this.primaryCollaterals.push(value);
                }
            });
            this.setVehicleDetails(this.primaryCollaterals);
        }
        this.vehicleDeliveryForm.patchValue({
            branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
            branchDistrict: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
            customerName: this.nepaliData.name ? this.nepaliData.name : '',
            customerPermanentDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict.nepaliName : '',
            customerPermanentVdc: this.nepaliData.permanentVdc ? this.nepaliData.permanentVdc : '',
            customerPermanentVdcWard: this.nepaliData.permanentVdcWard ? this.nepaliData.permanentVdcWard : '',
            customerTemporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict.nepaliName : '',
            customerTemporaryVdcMun: this.nepaliData.temporaryMunicipalities ? this.nepaliData.temporaryMunicipalities.nepaliName : '',
            customerTemporaryWard: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
            citizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
            citizenshipIssueAddress: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
            companyDistrict: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
            companyVdcMun: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
            companyWardNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
            companyName: this.nepaliData.companyName ? this.nepaliData.companyName : '',
            panNumber: this.nepaliData.panNo ? this.nepaliData.panNo : '',
            loanAmount: this.nepData ? this.nepData.numberNepali : '',
            loanAmountInWords: this.nepData ? this.nepData.nepaliWords : '',
            proprietor: this.nepaliData.representativeName ? this.nepaliData.representativeName : ''
        });

        this.nepaliData.collateralDetails.forEach(value => {
            if (value.securityDetails === 'HP') {
                this.vehicleDeliveryForm.patchValue({
                    bisaya: [!ObjectUtil.isEmpty(value.vehicleType) ? value.vehicleType : ''],
                    vehiclePrice: [!ObjectUtil.isEmpty(value.vehicleQuotationPrice) ? value.vehicleQuotationPrice : '']
                });
            }
        });
    }

    vehicleFormGroup(): FormGroup {
        return this.formBuilder.group({
            vehicleSpecification: [undefined],
            upakaran: [undefined],
            engineNo: [undefined],
            chassisNo: [undefined],
            registeredNo: [undefined],
        });
    }

    setVehicleDetails(data) {
        const formArray = this.vehicleDeliveryForm.get('vehicleDetails') as FormArray;
        if (data.length === 0) {
            this.addMoreVehicleDetail();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                vehicleSpecification: [value.vehicleType],
                upakaran: [value.vehicleModelNum],
                engineNo: [value.engineNumber],
                chassisNo: [value.chassisNumber],
                registeredNo: [value.vehicleNumber],
            }));
        });
    }

    addMoreVehicleDetail(): void {
        const formArray = this.vehicleDeliveryForm.get('vehicleDetails') as FormArray;
        formArray.push(this.vehicleFormGroup());
    }

    removeVehicleDetail(index: number): void {
        const formArray = this.vehicleDeliveryForm.get('vehicleDetails') as FormArray;
        formArray.removeAt(index);
    }

    onSubmit(): void {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.vehicleDeliveryForm.value);
                    this.initialInfoPrint = singleCadFile.initialInformation;
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.vehicleDeliveryForm.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.vehicleDeliveryForm.value);

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
