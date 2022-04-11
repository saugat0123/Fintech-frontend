import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.cadData);
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
    });
  }

  fillForm() {
    this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    this.setVehicleDetails(this.nepaliData.collateralDetails);
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
        upakaran : [value.vehicleModelNum],
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

}
