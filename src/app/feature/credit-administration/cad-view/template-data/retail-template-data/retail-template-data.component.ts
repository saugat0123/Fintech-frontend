import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {
  SmeGlobalContentComponent
} from '../nabil-sme-template-data/sme-template-data/sme-master-template/global-template/sme-global-content/sme-global-content.component';
import {
  IrrevocableLetterOfCreditFacilityComponent
} from '../nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/irrevocable-letter-of-credit-facility/irrevocable-letter-of-credit-facility.component';
import {
  RequiredLegalDocumentSectionComponent
} from '../nabil-sme-template-data/sme-template-data/sme-master-template/required-legal-document-section/required-legal-document-section.component';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CombinedOfferLetterComponent
} from '../../../cad-document-template/nabil/nabil-sme/combined-offer-letter/combined-offer-letter.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanNameConstant} from '../nabil-sme-template-data/sme-costant/loan-name-constant';
import {OfferDocument} from '../../../model/OfferDocument';
import {PersonalLoanTemplateDataComponent} from '../personal-loan-template-data/personal-loan-template-data.component';
import {RetailGlobalContentComponent} from './retail-global-content/retail-global-content.component';

@Component({
  selector: 'app-retail-template-data',
  templateUrl: './retail-template-data.component.html',
  styleUrls: ['./retail-template-data.component.scss']
})
export class RetailTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() isEdit = false;
  @ViewChild('retailGlobalContent', {static: false}) retailGlobalContent: RetailGlobalContentComponent;
  @ViewChild('personalLoanTemplate', {static: false})
  personalLoanTemplate: PersonalLoanTemplateDataComponent;

  requiredLegalDocumentSectionComponent: RequiredLegalDocumentSectionComponent;

  offerLetterConst = NabilOfferLetterConst;

  spinner = false;
  disableBtn = false;
  dialogRef: NbDialogRef<any>;
  loanData = [];
  loanExtraDetails = [];
  offerLetterDocument: OfferDocument;
  existingOfferLetter = false;
  attributes;
  tdValues: any = {};
  isPersonalLoan = false;
  isPersonalOverdraftLoan = false;
  isMortgageLoan = false;
  isHomeLoan = false;
  isEducationLoan = false;
  isPersonalAndPersonalOverdraft = false;
  constructor(private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private nbDialogueService: NbDialogService,
              private modalService: NgbModal,
              private modalDialogRef: NbDialogRef<RetailTemplateDataComponent>,
              public nbDialogRef: NbDialogRef<RetailTemplateDataComponent>) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.getLoanName();
      this.checkLoanName();
    }
  }

  getLoanName() {
    const tempTotalLimit = {name: 'TOTAL LIMIT', loanAmount: 0};
    this.loanExtraDetails.push(tempTotalLimit);
    console.log('to verify:', this.customerApprovedDoc);
    this.customerApprovedDoc.assignedLoan.forEach(val => {
      const loanName = val.loan.name;
      this.loanData.push(loanName);
      const tempStructure = {
        name: loanName,
        loanAmount: val.proposal.proposedLimit,
      };
      this.loanExtraDetails.push(tempStructure);
    });
  }

  private checkLoanName(): void {
    if (this.loanData.length > 0) {
      this.loanData.forEach(v => {
        if (v === 'PERSONAL LOAN') {
          this.isPersonalLoan = true;
        }
        if (v === 'PERSONAL OVERDRAFT') {
          this.isPersonalOverdraftLoan = true;
        }
        if (v === 'PERSONAL LOAN AND PERSONAL OVERDRAFT') {
          this.isPersonalAndPersonalOverdraft = true;
        }
        if (v === 'EDUCATIONAL LOAN') {
          this.isEducationLoan = true;
        }
        if (v === 'MORTAGE LOAN') {
          this.isMortgageLoan = true;
        }
        if (v === 'HOME LOAN') {
          this.isHomeLoan = true;
        }
      });
    }
  }

  public openCombinedOfferLetter() {
    this.dialogRef = this.nbDialogueService.open(CombinedOfferLetterComponent, {
      hasScroll: true,
      dialogClass: 'model-full',
      context: {
        customerApprovedDoc: this.customerApprovedDoc
      }
    });
  }

  dismiss(template) {
    this.modalService.dismissAll();
  }

  openCloseTemplate(template) {
    this.modalService.open(template);
  }

  decline(template) {
    this.modalService.dismissAll();
  }

  accept() {
    this.modalService.dismissAll();
    this.modalDialogRef.close();
  }

}
