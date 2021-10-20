import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HomeLoanType} from '../../cad-constant/home-loan-type';
import {ConstructionLoanComponent} from '../home-loan-type/construction-loan/construction-loan.component';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OfferDocument} from '../../../model/OfferDocument';
import {ToastService} from '../../../../../@core/utils';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {HomeLandAndBuildingComponent} from '../home-loan-type/home-land-and-building/home-land-and-building.component';
import {RetailMortgageLoanComponent} from "../../../mega-offer-letter-template/mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan.component";
import {HomeLoanComponent} from "../../../cad-document-template/mega/home-loan/home-loan.component";
import {NbDialogService} from "@nebular/theme";

@Component({
  selector: 'app-home-loan-template-data',
  templateUrl: './home-loan-template-data.component.html',
  styleUrls: ['./home-loan-template-data.component.scss']
})
export class HomeLoanTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  homeLoanForm: FormGroup;
  homeLoanType: Array<String> = new Array<String>();
  offerLetterConst = NabilOfferLetterConst;
  isConstructionLoan = false;
  isPurchaseLoan = false;
  isTakeOverLoan = false;
  submitted = false;
  spinner = false;
  btnDisable = false;
  existingOfferLetter = false;
  previewBtn = true;

  @ViewChild('constructionLoan', {static: false}) constructionLoan: ConstructionLoanComponent;
  @ViewChild('landAndBuilding', {static: false}) landAndBuilding: HomeLandAndBuildingComponent;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getHomeLoanType();
    if (this.isConstructionLoan) {
      this.landAndBuilding.landBuildingForm.clearValidators();
      this.landAndBuilding.landBuildingForm.updateValueAndValidity();
    }
    if (this.isPurchaseLoan || this.isTakeOverLoan) {
      this.constructionLoan.constructionLoanForm.clearValidators();
      this.constructionLoan.constructionLoanForm.updateValueAndValidity();
    }
  }

  private getHomeLoanType(): void {
    HomeLoanType.enumObject().forEach(element => {
      this.homeLoanType.push(element);
    });
  }

  private buildForm(): FormGroup {
    return this.homeLoanForm = this.formBuilder.group({
      homeLoanType: [undefined],
    });
  }

  public typeOfHomeLoan(value): void {
    this.isConstructionLoan = value === HomeLoanType.CONSTRUCTION.valueOf();
    this.isPurchaseLoan = value === HomeLoanType.PURCHASE.valueOf();
    this.isTakeOverLoan = value === HomeLoanType.TAKE_OVER.valueOf();
  }

  public emitValue(event) {
    this.btnDisable = event;
  }

  openModel() {
    this.dialogService.open(HomeLoanComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    let homeLoan;
    if (this.isConstructionLoan) {
      homeLoan = this.constructionLoan.constructionLoanForm;
    }
    if (this.isPurchaseLoan || this.isTakeOverLoan) {
      homeLoan = this.landAndBuilding.landBuildingForm;
    }
    if (homeLoan.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
      this.spinner = false;
      return;
    }
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    const offerDocument = new OfferDocument();
    offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN);
    offerDocument.initialInformation = JSON.stringify({loan: homeLoan.value, loanType: this.homeLoanForm.get('homeLoanType').value});
    this.customerApprovedDoc.offerDocumentList.push(offerDocument);

    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.previewBtn = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.btnDisable = true;
      this.previewBtn = false;
    });
  }

}
