import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OfferDocument} from '../../../../model/OfferDocument';
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterConfigurationComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-letter-of-agreement-icfc',
  templateUrl: './letter-of-agreement-icfc.component.html',
  styleUrls: ['./letter-of-agreement-icfc.component.scss']
})
export class LetterOfAgreementIcfcComponent implements OnInit {
// @Input() offerLetterType;
  // @Input() cadOfferLetterApprovedDoc;

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  letterOfAgreement: FormGroup;
  spinner;
  offerLetterDocument: OfferDocument;
  // offerLetterConst = IcfcOfferLetterConst;
  offerLetterConst = LegalDocumentCheckListEnum;
  // customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  // existingOfferLetter = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              private dialogRef: NbDialogRef<LetterOfAgreementIcfcComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.letterOfAgreement = this.formBuilder.group({
      offerLetterDate: [undefined],
      letterName: [undefined],
      letterSubject: [undefined],
      bodyContentDate: [undefined],
    });
  }

  checkOfferLetter() {
    // this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
    // === this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_AGREEMENT).toString())[0];
    // if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
    //   this.offerLetterDocument = new OfferDocument();
    //   this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_AGREEMENT);
    // } else {
    //   const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
    //   this.initialInfoPrint = initialInfo;
    //   this.existingOfferLetter = true;
    //   if (!ObjectUtil.isEmpty(initialInfo)) {
    //   }
    //   this.letterOfAgreement.patchValue(this.initialInfoPrint);
    // }

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.letterOfAgreement.patchValue(this.initialInfoPrint);
        }
      });
    }
  }

  submit() {
    console.log(this.letterOfAgreement.value);
    this.spinner = true;
    let flag = true;
    // this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;
    //
    // if (this.existingOfferLetter) {
    //   this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
    //     if (offerLetterPath.docName.toString() ===
    //     this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_AGREEMENT).toString()) {
    //       offerLetterPath.initialInformation = JSON.stringify(this.letterOfAgreement.value);
    //     }
    //   });
    // } else {
    //   const offerDocument = new OfferDocument();
    //   offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_AGREEMENT);
    //   offerDocument.initialInformation = JSON.stringify(this.letterOfAgreement.value);
    //   this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    // }

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterOfAgreement.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfAgreement.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfAgreement.value);
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
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    });
  }

}
