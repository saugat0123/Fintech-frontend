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
  selector: 'app-vehicle-namsari-letter-for-hp-loan',
  templateUrl: './vehicle-namsari-letter-for-hp-loan.component.html',
  styleUrls: ['./vehicle-namsari-letter-for-hp-loan.component.scss']
})
export class VehicleNamsariLetterForHpLoanComponent implements OnInit {
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

  constructor(private dialogRef: NbDialogRef<VehicleNamsariLetterForHpLoanComponent>,
              private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  fillForm() {
    this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          if (!ObjectUtil.isEmpty(initialInfo.vehicleDetails)) {
            this.setVehicleDetails(initialInfo.vehicleDetails);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    this.form.patchValue({
      branchName: this.nepaliData.branchName ? this.nepaliData.branchName : ''
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
      name: [undefined],
      regNo: [undefined],
      vehicleName: [undefined],
      debtorName: [undefined],
      officer: [undefined],
      karmachariName: [undefined],
      postName: [undefined],
      karmachariName2: [undefined],
      postName2: [undefined],
      vehicleDetails: this.formBuilder.array([]),
      branchName: [undefined]
    });
  }

  vehicleFormGroup(): FormGroup {
    return this.formBuilder.group({
      vehicleSpecification: [undefined],
      engineNo: [undefined],
      chassisNo: [undefined],
      registeredNo: [undefined],
      colour: [undefined],
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
        vehicleSpecification: [value.vehicleSpecification],
        engineNo: [value.engineNo],
        chassisNo: [value.chassisNo],
        registeredNo: [value.registeredNo],
        colour: [value.colour],
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
