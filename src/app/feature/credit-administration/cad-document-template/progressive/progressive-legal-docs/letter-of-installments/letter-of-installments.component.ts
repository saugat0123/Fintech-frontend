import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';

@Component({
  selector: 'app-letter-of-installments',
  templateUrl: './letter-of-installments.component.html',
  styleUrls: ['./letter-of-installments.component.scss']
})
export class LetterOfInstallmentsComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  spinner;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: Document;
  nepaliData;
  nepDataPersonal: any;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<LetterOfInstallmentsComponent>) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.nepDataPersonal)) {
      this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
    }
    this.fillForm();
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          //this.setGuarantorDetails(initialInfo.guarantorData);
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        branchName : this.nepaliData.branchName ? this.nepaliData.branchName : '',
        karjaAmount : loanAmount.numberNepali ? loanAmount.numberNepali : '',
        timePeriod : this.nepDataPersonal.tenureOfLoanInMonths ? this.nepDataPersonal.tenureOfLoanInMonths : '',
        kistaAmount : this.nepDataPersonal.installmentAmount ? this.nepDataPersonal.installmentAmount : '',
        guarantorName: !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails) ? this.nepaliData.guarantorDetails[0].guarantorName : '',
        guarantorDistrict: !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails) ? this.nepaliData.guarantorDetails[0].guarantorPermanentDistrict.nepaliName : '',
        guarantorMunVdc: !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails) ? this.nepaliData.guarantorDetails[0].guarantorPermanentMunicipality.nepaliName : '',
        guarantorWardNo: this.nepaliData.guarantorDetails[0].guarantorPermanentWard ? this.nepaliData.guarantorDetails[0].guarantorPermanentWard : '',
        guarantorPermanentMunType: this.nepaliData.guarantorDetails[0].guarantorPermanentMunType ? this.nepaliData.guarantorDetails[0].guarantorPermanentMunType : '',
        guarantorPermanentVdc: this.nepaliData.guarantorDetails[0].guarantorPermanentVdc ? this.nepaliData.guarantorDetails[0].guarantorPermanentVdc : '',
      });
    }
  }

  onSumbit(): void {
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
      branchName: [undefined],
      customerName: [undefined],
      karjaAmount: [undefined],
      timePeriod: [undefined],
      kistaAmount: [undefined],
      mahina: [undefined],
      kista: [undefined],
      debtorSign: [undefined],
      debtorName: [undefined],
      guarantorName: [undefined],
      guarantorAddress: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunVdc: [undefined],
      guarantorWardNo: [undefined],
      //guarantorData: this.formBuilder.array([]),
      witnessName: [undefined],
      witnessCitizenshipNo: [undefined],
      witnessCitizenshipIssueDate: [undefined],
      witnessCDOoffice: [undefined],
      witnessIssuedPlace: [undefined],
      witnessMunicipality: [undefined],
      witnessWardNo: [undefined],
      witnessName1: [undefined],
      witnessCitizenshipNo1: [undefined],
      witnessCitizenshipIssueDate1: [undefined],
      witnessCDOoffice1: [undefined],
      witnessIssuedPlace1: [undefined],
      witnessMunicipality1: [undefined],
      witnessWardNo1: [undefined],
     installmentAmount: [undefined],
      guarantorPermanentMunType: [undefined],
      guarantorPermanentVdc: [undefined],

  });
  }
  /*addGuarantor(): void {
    const formArray = this.form.get('guarantorData') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorData') as FormArray;
    formArray.removeAt(index);
  }

  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      guarantorName: [undefined],
      guarantorAddress: [undefined],
    });
  }
  setGuarantorDetails(data) {
    const formArray = this.form.get('guarantorData') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        guarantorName: [value.guarantorName],
        guarantorAddress: [value.guarantorAddress],
      }));
    });
  }*/

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
}

