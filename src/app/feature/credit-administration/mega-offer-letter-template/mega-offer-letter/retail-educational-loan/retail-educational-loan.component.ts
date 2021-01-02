import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OfferLetter} from '../../../../admin/modal/offerLetter';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {DocStatus} from '../../../../loan/model/docStatus';
import {CustomerOfferLetterPath} from '../../../../loan/model/customer-offer-letter-path';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';

@Component({
  selector: 'app-retail-educational-loan',
  templateUrl: './retail-educational-loan.component.html',
  styleUrls: ['./retail-educational-loan.component.scss']
})
export class RetailEducationalLoanComponent implements OnInit {
  form: FormGroup;
  // todo replace enum constant string compare
   spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;

  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) {
  }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetterData();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      refNo: [undefined],
      customerName: [undefined],
      permanentAddress: [undefined],
      currentAddress: [undefined],
      mobileNo: [undefined],
      subject: [undefined],
      loanName: [undefined],
      loanAmount: [undefined],
      loanNameInWord: [undefined],

      companyLocation: [undefined],
      companyName: [undefined],
      course: [undefined],
      loanTenure: [undefined],
      moratoriumPeriod: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyLoanRate: [undefined],
      emiPeriod: [undefined],
      emiAmount: [undefined],
      emiAmountInWord: [undefined],
      fmvPercent: [undefined],
      serviceChargePercent: [undefined],
      draftAmount: [undefined],
      currency: [undefined],
      securityPersonName: [undefined],
      motherDistrict: [undefined],
      motherWardNo: [undefined],
      securityDistrict: [undefined],
      securityWardNo: [undefined],
      securityLandId: [undefined],
      loanManagingDirectorName: [undefined],
      loanManagerName: [undefined],
      guarantors: [undefined]
    });
  }


  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.
      filter(value => value.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL).toString())[0];
      console.log(this.offerLetterDocument , "jj");
      if (ObjectUtil.isEmpty(this.offerLetterDocument.id)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL);
      } else  {
        const  initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        console.log(initialInfo);
        this.initialInfoPrint = initialInfo;
        console.log(this.offerLetterDocument);
        this.existingOfferLetter = true;
        this.form.patchValue(initialInfo, {emitEvent: false});
        this.initialInfoPrint = initialInfo;
      }
    }
  }


  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe( () => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Retail Educational Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
    } ,  error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Retail Educational Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
    });

  }

}
