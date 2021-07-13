import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-letter-of-continuity',
  templateUrl: './letter-of-continuity.component.html',
  styleUrls: ['./letter-of-continuity.component.scss']
})
export class LetterOfContinuityComponent implements OnInit {
  // @Input() offerLetterType;
  // @Input() cadOfferLetterApprovedDoc;

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  letterOfContinuity: FormGroup;
  // offerLetterConst = IcfcOfferLetterConst;
  offerLetterConst = LegalDocumentCheckListEnum;
  // customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  // existingOfferLetter = false;
  // offerLetterDocument: OfferDocument;
  spinner: boolean;
  // nepData;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<LetterOfContinuityComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  checkOfferLetter() {
    // this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
    //     === this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_CONTINUITY).toString())[0];
    // if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
    //   this.offerLetterDocument = new OfferDocument();
    //   this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_CONTINUITY);
    //   this.fillForm();
    // } else {
    //   const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
    //   this.initialInfoPrint = initialInfo;
    //   this.existingOfferLetter = true;
    //   if (!ObjectUtil.isEmpty(initialInfo)) {}
    //   this.letterOfContinuity.patchValue(this.initialInfoPrint);
    // }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.letterOfContinuity.patchValue(this.initialInfoPrint);
        }
      });
    }
  }

  // fillForm() {
  //   this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
  //   this.letterOfContinuity.patchValue({
  //     date: this.nepData.date ? this.nepData.date : '',
  //     address: this.nepData.address ? this.nepData.address : '',
  //   });
  // }

  buildForm() {
    this.letterOfContinuity = this.formBuilder.group({
      date: [undefined],
      branchAddress: [undefined],
      witness: [undefined],
      witness2: [undefined]
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
    //         this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_CONTINUITY).toString()) {
    //       offerLetterPath.initialInformation = JSON.stringify(this.letterOfContinuity.value);
    //     }
    //   });
    // } else {
    //   const offerDocument = new OfferDocument();
    //   offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_CONTINUITY);
    //   offerDocument.initialInformation = JSON.stringify(this.letterOfContinuity.value);
    //   this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    // }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterOfContinuity.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        console.log('JSON STRINGIFY : ', JSON.stringify(this.letterOfContinuity.value));
        cadFile.initialInformation = JSON.stringify(this.letterOfContinuity.value);
        document.id = this.documentId;
        console.log('Value of the document ! : ', document);
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      console.log('JSON STRINGIFY : ', JSON.stringify(this.letterOfContinuity.value));
      cadFile.initialInformation = JSON.stringify(this.letterOfContinuity.value);
      document.id = this.documentId;
      console.log('Value of the document ! : ', document);
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

}
