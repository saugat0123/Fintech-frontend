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

@Component({
  selector: 'app-letter-vehicle-thirdparty-company',
  templateUrl: './letter-vehicle-thirdparty-company.component.html',
  styleUrls: ['./letter-vehicle-thirdparty-company.component.scss']
})
export class LetterVehicleThirdpartyCompanyComponent implements OnInit {
  letterVehicleThirdpartyCompany: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  nepaliNumber = new NepaliNumberAndWords();
  educationInterestRate: any;
  form: FormGroup;
  nepData;
  clientType;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  selectiveArr = [];
  offerLetterDocument;
  educationalTemplateData;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      public datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.letterVehicleThirdpartyCompany.patchValue(initialInfo);
        }
      });
    }
  }
  buildForm() {
    this.letterVehicleThirdpartyCompany = this.formBuilder.group({
      date: [undefined],
      nameOfBranchLocated: [undefined],
      actYearInFigure: [undefined],
      nameOfDepartment: [undefined],
      dateOfRegistration: [undefined],
      registrationNo: [undefined],
      nameOfBorrower: [undefined],
      sanctionLetterIssuedDate: [undefined],
      modelTypeOfVehicle: [undefined],
      vehicleRegistrationNumber: [undefined],
      engineNumber: [undefined],
      chasisNumber: [undefined],
    });
  }
  fillform() {
    this.letterVehicleThirdpartyCompany.patchValue(
        {
          date: this.individualData.date.ct ?
              this.individualData.date.ct : '',
          nameOfBranchLocated: this.individualData.nameOfBranchLocated.ct ?
              this.individualData.nameOfBranchLocated.ct : '',
          actYearInFigure: this.individualData.actYearInFigure.ct ?
              this.individualData.actYearInFigure.ct : '',
          nameOfDepartment: this.individualData.nameOfDepartment.ct ?
              this.individualData.nameOfDepartment.ct : '',
          dateOfRegistration: this.individualData.dateOfRegistration.ct ?
              this.individualData.dateOfRegistration.ct : '',
          registrationNo: this.individualData.registrationNo.ct ?
              this.individualData.registrationNo.ct : '',
          nameOfBorrower: this.individualData.nameOfBorrower.ct ?
              this.individualData.nameOfBorrower.ct : '',
          sanctionLetterIssuedDate: this.individualData.sanctionLetterIssuedDate.ct ?
              this.individualData.sanctionLetterIssuedDate.ct : '',
          modelTypeOfVehicle: this.individualData.modelTypeOfVehicle.ct ?
              this.individualData.modelTypeOfVehicle.ct : '',
          vehicleRegistrationNumber: this.individualData.vehicleRegistrationNumber.ct ?
              this.individualData.vehicleRegistrationNumber.ct : '',
          engineNumber: this.individualData.engineNumber.ct ?
              this.individualData.engineNumber.ct : '',
          chasisNumber: this.individualData.chasisNumber.ct ?
              this.individualData.chasisNumber.ct : '',
        }
    );
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterVehicleThirdpartyCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterVehicleThirdpartyCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterVehicleThirdpartyCompany.value);
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
