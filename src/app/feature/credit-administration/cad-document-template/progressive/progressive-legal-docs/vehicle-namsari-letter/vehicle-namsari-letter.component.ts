import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-vehicle-namsari-letter',
  templateUrl: './vehicle-namsari-letter.component.html',
  styleUrls: ['./vehicle-namsari-letter.component.scss']
})
export class VehicleNamsariLetterComponent implements OnInit {
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
  primaryCollaterals = new Array<any>();

  constructor(private dialogRef: NbDialogRef<VehicleNamsariLetterComponent>,
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

  fillForm() {
    this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
         /* if (!ObjectUtil.isEmpty(initialInfo.vehicleDetails)) {
            this.setVehicleDetails(initialInfo.vehicleDetails);
          }*/
          this.form.patchValue(this.initialInfoPrint);
        }
      });

      (this.nepaliData.collateralDetails).forEach(value => {
        if (value.securityDetails === 'HP') {
          this.primaryCollaterals.push(value);
        }
      });
      this.setVehicleDetails(this.primaryCollaterals);
    }

    this.form.patchValue({
      branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
      customerName: this.nepaliData.name ? this.nepaliData.name : '',
      customerPermanentDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict.nepaliName : '',
      customerPermanentVdc: this.nepaliData.permanentVdc ? this.nepaliData.permanentVdc : '',
      customerPermanentVdcWard: this.nepaliData.permanentVdcWard ? this.nepaliData.permanentVdcWard : '',
      customerTemporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict.nepaliName : '',
      customerTemporaryVdcMun: this.nepaliData.temporaryMunicipalities ? this.nepaliData.temporaryMunicipalities.nepaliName : '',
      customerTemporaryWard: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
      citizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
      citizenshipIssueAddress: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
      debtorName: this.isIndividual ? this.nepaliData.name : this.nepaliData.companyName,
      isIndividual : this.isIndividual,
      companyDistrict: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
      companyVdcMun: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
      companyWardNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
      companyName: this.nepaliData.companyName ? this.nepaliData.companyName : '',
      panNo: this.nepaliData.panNo ? this.nepaliData.panNo : ''
    });

    this.nepaliData.collateralDetails.forEach(value => {
      if (value.securityDetails === 'HP') {
        this.form.patchValue({
          vehicleName: [!ObjectUtil.isEmpty(value.vehicleType) ? value.vehicleType : ''],
        });
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
      date: [undefined],
      patraNum: [undefined],
      patraNum2: [undefined],
      province: [undefined],
      district: [undefined],
      municipality: [undefined],
      customerName: [undefined],
      citizenshipIssueAddress: [undefined],
      vehicleName: [undefined],
      debtorName: [undefined],
      officer: [undefined],
      karmachariName: [undefined],
      postName: [undefined],
      karmachariName2: [undefined],
      postName2: [undefined],
      vehicleDetails: this.formBuilder.array([]),
      branchName: [undefined],
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
      panNo: [undefined],
      isIndividual: [undefined]

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
    const formArray = this.form.get('vehicleDetails') as FormArray;
    if (data.length === 0) {
      this.addMoreVehicleDetail();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        vehicleSpecification: [value.vehicleType],
        upakaran : [value.vehicleModelNum],
        engineNo: [value.engineNumber],
        chassisNo: [value.chassisNumber],
        registeredNo: [value.vehicleNumber],
      }));
    });
  }

  addMoreVehicleDetail(): void {
    const formArray = this.form.get('vehicleDetails') as FormArray;
    formArray.push(this.vehicleFormGroup());
  }

  removeVehicleDetail(index: number): void {
    const formArray = this.form.get('vehicleDetails') as FormArray;
    formArray.removeAt(index);
  }
}
