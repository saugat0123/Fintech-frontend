import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-loan-deed-personal-loan-home-loan-icfc',
  templateUrl: './loan-deed-personal-loan-home-loan-icfc.component.html',
  styleUrls: ['./loan-deed-personal-loan-home-loan-icfc.component.scss']
})
export class LoanDeedPersonalLoanHomeLoanIcfcComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  loanDeedPersonalLoanHomeLoan: FormGroup;
  spinner;
  nepData;
  offerLetterConst = LegalDocumentCheckListEnum;
  initialInfoPrint;
  existingOfferLetter = false;
  editor = NepaliEditor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.loanDeedPersonalLoanHomeLoan = this.formBuilder.group({
      branch: [undefined],
      grandParents: [undefined],
      parents: [undefined],
      permanentProvince: [undefined],
      permanentZone: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      temporaryProvince: [undefined],
      temporaryZone: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryAddress: [undefined],
      age: [undefined],
      borrowerName: [undefined],
      citizenshipNo: [undefined],
      issueYear: [undefined],
      issueMonth: [undefined],
      issueDay: [undefined],
      issueDistrict: [undefined],
      year2: [undefined],
      month2: [undefined],
      day2: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      accountNo: [undefined],
      witness: [undefined],
      witness2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      propertyDetailsTable: this.formBuilder.array([]),
      note: [undefined],
      field: [undefined],
    });

  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    this.loanDeedPersonalLoanHomeLoan.patchValue({
      permanentDistrict: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      permanentMunicipalityVDC: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      permanentWardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      grandParents: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      parents: this.nepData.fatherName ? this.nepData.fatherName : '',
      temporaryDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
      temporaryMunicipalityVDC: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
      temporaryWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
      age: this.nepData.age ? this.nepData.age : '',
      relation: this.nepData.name ? this.nepData.name : '',
      citizenshipNo: this.nepData.citizenshipNo ? this.nepData.citizenshipNo : '',
      issueDate: this.nepData.citizenshipIssueDate ? this.nepData.citizenshipIssueDate : '',
      issueDistrict: this.nepData.citizenshipIssueDistrict ? this.nepData.citizenshipIssueDistrict : '',
    });
  }

  checkOfferLetter() {

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            const initialInfo = JSON.parse(singleCadFile.initialInformation);
            this.initialInfoPrint = initialInfo;
            if (!ObjectUtil.isEmpty(initialInfo)) {
              this.setPropertyDetailsTable(initialInfo.propertyDetailsTable);
            }
            this.loanDeedPersonalLoanHomeLoan.patchValue(this.initialInfoPrint);
          } else {
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
    }
  }

  addTableData() {
    (this.loanDeedPersonalLoanHomeLoan.get('propertyDetailsTable') as FormArray).push(
        this.formBuilder.group({
          year3: [undefined],
          month3: [undefined],
          day3: [undefined],
          creditAmount: [undefined],
          interestRate: [undefined],
          serviceCharge: [undefined],
          bankingServiceAndDate: [undefined]
        })
    );
  }

  removeTableData(index) {
    (this.loanDeedPersonalLoanHomeLoan.get('propertyDetailsTable') as FormArray).removeAt(index);
  }

  setPropertyDetailsTable(data) {
    const formArray = this.loanDeedPersonalLoanHomeLoan.get('propertyDetailsTable') as FormArray;
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        year3: [undefined],
        month3: [undefined],
        day3: [undefined],
        creditAmount: [undefined],
        interestRate: [undefined],
        serviceCharge: [undefined],
        bankingServiceAndDate: [undefined]
      }));
    });
  }


  submit() {
    console.log(this.loanDeedPersonalLoanHomeLoan.value);
    this.spinner = true;
    let flag = true;

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.loanDeedPersonalLoanHomeLoan.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.loanDeedPersonalLoanHomeLoan.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.loanDeedPersonalLoanHomeLoan.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanDeedPersonalLoanHomeLoan.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.loanDeedPersonalLoanHomeLoan.get(wordLabel).patchValue(convertedVal);
  }

}
