import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {SmeGlobalContentComponent} from './global-template/sme-global-content/sme-global-content.component';
import {IrrevocableLetterOfCreditFacilityComponent} from './sme-loan-type/irrevocable-letter-of-credit-facility/irrevocable-letter-of-credit-facility.component';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../../@core/utils';
import {OfferDocument} from '../../../../../model/OfferDocument';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CombinedOfferLetterComponent} from '../../../../../cad-document-template/nabil/nabil-sme/combined-offer-letter/combined-offer-letter.component';

@Component({
  selector: 'app-sme-master-template',
  templateUrl: './sme-master-template.component.html',
  styleUrls: ['./sme-master-template.component.scss']
})
export class SmeMasterTemplateComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  loanData = [];
  @ViewChild('smeGlobalContent', {static: false}) smeGlobalContent: SmeGlobalContentComponent;
  @ViewChild('irrevocableLetterOfCreditFacility', {static: false})
  irrevocableLetterOfCreditFacility: IrrevocableLetterOfCreditFacilityComponent;
  offerLetterConst = NabilOfferLetterConst;

  spinner = false;
  disableBtn = false;
  dialogRef: NbDialogRef<any>;

  constructor(private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private nbDialogueService: NbDialogService) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.getLoanName();
    }
  }

  getLoanName() {
    this.customerApprovedDoc.assignedLoan.forEach(val => {
      const loanName = val.loan.name;
      this.loanData.push(loanName);
    });
  }

  onSubmit() {
    this.spinner = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    const offerDocument = new OfferDocument();
    offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER);
    // object for loan type
    const smeMasterForm = {
      smeGlobalForm: this.smeGlobalContent.globalForm.value,
      letterOfCreditForm: this.irrevocableLetterOfCreditFacility.letterOfCreditForm.value
    };

    offerDocument.initialInformation = JSON.stringify(smeMasterForm);
    this.customerApprovedDoc.offerDocumentList.push(offerDocument);


    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.disableBtn = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
    });
  }

  public openCombinedOfferLetter() {
    this.dialogRef = this.nbDialogueService.open(CombinedOfferLetterComponent, {
      hasScroll: true,
      dialogClass: 'model-full'
    });
  }

}
