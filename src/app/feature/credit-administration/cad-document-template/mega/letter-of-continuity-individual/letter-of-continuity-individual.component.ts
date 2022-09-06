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
  selector: 'app-letter-of-continuity-individual',
  templateUrl: './letter-of-continuity-individual.component.html',
  styleUrls: ['./letter-of-continuity-individual.component.scss']
})
export class LetterOfContinuityIndividualComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfContinuityIndividual: FormGroup;
  nepData;
  initialData;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialData = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialData)) {
      this.letterOfContinuityIndividual.patchValue(this.initialData);
    } else {
      this.fillForm();
    }
  }
  buildForm() {
    this.letterOfContinuityIndividual = this.formBuilder.group({
      branchNameNepali: [undefined],
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
      borrowerNameNepali: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
    });
  }
  fillForm() {
     this.letterOfContinuityIndividual.get('branchNameNepali').patchValue(this.nepData.branchDetail.branchNameInNepali);
     this.letterOfContinuityIndividual.get('grandFatherName').patchValue(this.nepData.grandFatherName);
     this.letterOfContinuityIndividual.get('fatherName').patchValue(this.nepData.fatherName);
     this.letterOfContinuityIndividual.get('husbandName').patchValue(this.nepData.husbandName);
     this.letterOfContinuityIndividual.get('permanentDistrict').patchValue(this.nepData.customerPermanentAddress.district);
     this.letterOfContinuityIndividual.get('permanentMunicipalityVDC').patchValue(this.nepData.customerPermanentAddress.municipality);
     this.letterOfContinuityIndividual.get('permanentWardNo').patchValue(this.nepData.customerPermanentAddress.wardNo);
     this.letterOfContinuityIndividual.get('permanentTole').patchValue(this.nepData.customerPermanentAddress.tole);
     this.letterOfContinuityIndividual.get('temporaryDistrict').patchValue(this.nepData.customerTemporaryAddress.district);
     this.letterOfContinuityIndividual.get('temporaryMunicipalityVDC').patchValue(this.nepData.customerTemporaryAddress.municipality);
     this.letterOfContinuityIndividual.get('temporaryWardNo').patchValue(this.nepData.customerTemporaryAddress.wardNo);
     this.letterOfContinuityIndividual.get('borrowerNameNepali').patchValue(this.nepData.nepaliName);
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterOfContinuityIndividual.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfContinuityIndividual.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfContinuityIndividual.value);
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
