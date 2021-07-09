import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-corporate-guarantee',
  templateUrl: './corporate-guarantee.component.html',
  styleUrls: ['./corporate-guarantee.component.scss']
})
export class CorporateGuaranteeComponent implements OnInit {
  // @Input() offerLetterType;
  // @Input() cadOfferLetterApprovedDoc;

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  corporateGuarantee: FormGroup;
  spinner: boolean;
  offerLetterConst = LegalDocumentCheckListEnum;
  existingOfferLetter = false;
  initialInfoPrint;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<CorporateGuaranteeComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  checkOfferLetter() {
    // this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
    //     === this.offerLetterConst.value(this.offerLetterConst.CORPORATE_GUARANTEE).toString())[0];
    // if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
    //   this.offerLetterDocument = new OfferDocument();
    //   this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CORPORATE_GUARANTEE);
    //   this.fillForm();
    // } else {
    //   const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
    //   this.initialInfoPrint = initialInfo;
    //   this.existingOfferLetter = true;
    //   if (!ObjectUtil.isEmpty(initialInfo)) {}
    //   this.corporateGuarantee.patchValue(this.initialInfoPrint);
    // }

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.corporateGuarantee.patchValue(this.initialInfoPrint);
        }
      });
    }
  }

  // fillForm() {
  //   this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
  //   this.corporateGuarantee.patchValue({
  //     date: this.nepData.date ? this.nepData.date : '',
  //     address: this.nepData.address ? this.nepData.address : '',
  //   });
  // }

  onSubmit() {
    this.spinner = true;
    let flag = true;
    // if (this.existingOfferLetter) {
    //   this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
    //     if (offerLetterPath.docName.toString() ===
    //         this.offerLetterConst.value(this.offerLetterConst.CORPORATE_GUARANTEE).toString()) {
    //       offerLetterPath.initialInformation = JSON.stringify(this.corporateGuarantee.value);
    //     }
    //   });
    // } else {
    //   const offerDocument = new OfferDocument();
    //   offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CORPORATE_GUARANTEE);
    //   offerDocument.initialInformation = JSON.stringify(this.corporateGuarantee.value);
    //   this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    //   console.log('This is cad offer letter : ', this.cadOfferLetterApprovedDoc);
    // }

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.corporateGuarantee.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.corporateGuarantee.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.corporateGuarantee.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadData.id);
    });
  }

  buildForm() {
    this.corporateGuarantee = this.formBuilder.group({
      name: [undefined],
      date: [undefined],
      guarantorName: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      address: [undefined],
      authorizedPerson: [undefined],
      telNo: [undefined],
    });
  }
}
