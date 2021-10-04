import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';

@Component({
  selector: 'app-loan-deed-individual',
  templateUrl: './loan-deed-individual.component.html',
  styleUrls: ['./loan-deed-individual.component.scss']
})
export class LoanDeedIndividualComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService
  ) { }
  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  initialInfoPrint;
  spinner = false;
  form: FormGroup;

  ngOnInit() {
    console.log('cad data', this.cadData);
    console.log('cad data', this.documentId);
    console.log('cad data', this.customerLoanId);
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.form = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      district: [undefined],
      municipality: [undefined],
      wadNo: [undefined],
      branch: [undefined],
      grandParentName: [undefined],
      permanentMunicipality: [undefined],
      fatherName: [undefined],
      husbandWifeName: [undefined],
      permanentDistrict: [undefined],
      temporaryWardNum: [undefined],
      temporaryAddress: [undefined],
      temporaryDistrict: [undefined],
      tempWardNum: [undefined],
      livingYear: [undefined],
      name: [undefined],
      naPraNa: [undefined],
      districtOffice: [undefined],
      issuedYear: [undefined],
      issuedMonth: [undefined],
      issuedDay: [undefined],
      offerYear: [undefined],
      offerMonth: [undefined],
      offerDay: [undefined],
      customerName: [undefined],
      rupees: [undefined],
      amount: [undefined],
      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDay: [undefined],
      roj: [undefined],
      witnessDistrictOne: [undefined],
      witnessMunicipalityOne: [undefined],
      witnessWadNoOne: [undefined],
      witnessDistrictTwo: [undefined],
      witnessMunicipalityTwo: [undefined],
      witnessWadNoTwo: [undefined],
      role: [undefined]
    });
  }


  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
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
}
