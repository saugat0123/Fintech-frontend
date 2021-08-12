import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-letter-of-set-off',
  templateUrl: './letter-of-set-off.component.html',
  styleUrls: ['./letter-of-set-off.component.scss']
})
export class LetterOfSetOffComponent implements OnInit {
  // @Input() offerLetterType;
  // @Input() cadOfferLetterApprovedDoc;

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  letterOfSetOff: FormGroup;
  offerLetterConst = LegalDocumentCheckListEnum;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  spinner: boolean;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<LetterOfSetOffComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  checkOfferLetter() {
    // this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
    //     === this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_SET_OFF).toString())[0];
    // if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
    //   this.offerLetterDocument = new OfferDocument();
    //   this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_SET_OFF);
    //   this.fillForm();
    // } else {
    //   const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
    //   this.initialInfoPrint = initialInfo;
    //   this.existingOfferLetter = true;
    //   if (!ObjectUtil.isEmpty(initialInfo)) {}
    //   this.letterOfSetOff.patchValue(this.initialInfoPrint);
    // }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.letterOfSetOff.patchValue(this.initialInfoPrint);
        }
      });
    }
  }

  // fillForm() {
  //   this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
  //   this.letterOfSetOff.patchValue({
  //     date: this.nepData.date ? this.nepData.date : '',
  //     address: this.nepData.address ? this.nepData.address : '',
  //   });
  // }

  buildForm() {
    this.letterOfSetOff = this.formBuilder.group({
      date: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      name: [undefined],
      accountNo: [undefined],
      name2: [undefined],
      accountNo2: [undefined],
      name3: [undefined],
      accountNo3: [undefined],
      name4: [undefined],
      accountNo4: [undefined],
      name5: [undefined],
      accountNo5: [undefined],
      name6: [undefined],
      accountNo6: [undefined],
      name7: [undefined],
      name8: [undefined],
      witness: [undefined],
      witness2: [undefined],
      amount2: [undefined],
      amountInWords2: [undefined]
    });
  }

  onSubmit(): void {
    this.spinner = true;
    let flag = true;
    // this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;
    //
    // if (this.existingOfferLetter) {
    //   this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
    //     if (offerLetterPath.docName.toString() ===
    //         this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_SET_OFF).toString()) {
    //       offerLetterPath.initialInformation = JSON.stringify(this.letterOfSetOff.value);
    //     }
    //   });
    // } else {
    //   const offerDocument = new OfferDocument();
    //   offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_SET_OFF);
    //   offerDocument.initialInformation = JSON.stringify(this.letterOfSetOff.value);
    //   this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    // }

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
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

  setName(name) {
    const tempArray = ['name4', 'name5', 'name6', 'name7', 'name8'];
    const tempName = this.letterOfSetOff.get(name).value;
    tempArray.forEach(value => {
      this.letterOfSetOff.get(value).patchValue(tempName);
    });
  }

  setAcNo(accountNumber) {
    const tempAcArray = ['accountNo3', 'accountNo4', 'accountNo5', 'accountNo6'];
    const tempAcNo = this.letterOfSetOff.get(accountNumber).value;
    tempAcArray.forEach(value => {
      this.letterOfSetOff.get(value).patchValue(tempAcNo);
    });
  }


}
