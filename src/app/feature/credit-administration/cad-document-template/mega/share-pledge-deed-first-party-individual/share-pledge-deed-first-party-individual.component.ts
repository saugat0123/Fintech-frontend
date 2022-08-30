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
  selector: 'app-share-pledge-deed-first-party-individual',
  templateUrl: './share-pledge-deed-first-party-individual.component.html',
  styleUrls: ['./share-pledge-deed-first-party-individual.component.scss']
})
export class SharePledgeDeedFirstPartyIndividualComponent implements OnInit {

  form: FormGroup;
  cadFile = CadFile;
  singleData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.singleData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      loanData: this.formBuilder.array([]),
      tableShow: true,
      branch: [undefined],
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
      individualName: [undefined],
      offerLetterIssuedDate: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      amount2: [undefined],
      amountInWords2: [undefined],
      facOwnerName: [undefined],
      witnessName: [undefined],
      witnessName2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      snNo: [undefined],
      shareholderNameAndCitizenshipNo: [undefined],
      clientId: [undefined],
      shareKitta: [undefined],
      shareIssuingCompany: [undefined],
      kaifiyat: [undefined]
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
  removeLoanDetail(index) {
    (this.form.get('loanData') as FormArray).removeAt(index);
  }

  addTableData() {
    (this.form.get('loanData') as FormArray).push(
        this.formBuilder.group({
          loanFacilityType: [undefined],
          amountInWords1: [undefined],
          amount1: [undefined],
        })
    );
  }
  setTableData(data) {
    const formArray = this.form.get('loanData') as FormArray;
    if (ObjectUtil.isEmpty(data)) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        loanFacilityType: [value.loanFacilityType],
        amountInWords1: [value.amountInWords1],
        amount1: [value],
      }));
    });
  }
  changeToNepAmount(event: any, target, from) {
    this.form.get([target]).patchValue(event.nepVal);
    this.form.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.form.get([target]).value;
    return patchValue1;
  }
  changeToNepAmount1(event: any, i , formArrayName) {
    this.form.get([formArrayName, i, 'amountInWords1']).patchValue(event.nepVal);
    this.form.get([formArrayName, i, 'amount1']).patchValue(event.val);
  }

  patchFunction1(formArrayName, i, formControlName) {
    const patchValue1 = this.form.get([formArrayName, i, formControlName]).value;
    return patchValue1;
  }
}
