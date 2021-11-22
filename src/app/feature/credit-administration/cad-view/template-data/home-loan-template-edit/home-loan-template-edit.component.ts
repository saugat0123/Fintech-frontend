import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {OfferDocument} from '../../../model/OfferDocument';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {HomeLoanType} from '../../cad-constant/home-loan-type';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ConstructionLoanEditComponent} from './construction-loan-edit/construction-loan-edit.component';
import {HomeLandAndBuildingLoanEditComponent} from './home-land-and-building-loan-edit/home-land-and-building-loan-edit.component';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {HomeLoanComponent} from '../../../cad-document-template/mega/home-loan/home-loan.component';

@Component({
  selector: 'app-home-loan-template-edit',
  templateUrl: './home-loan-template-edit.component.html',
  styleUrls: ['./home-loan-template-edit.component.scss']
})
export class HomeLoanTemplateEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;
  @Input() offerLetterId: number;
  @Input() hideArrow = false;
  homeLoanForm: FormGroup;
  isConstructionLoan = false;
  isPurchaseLoan = false;
  isTakeOverLoan = false;
  homeLoanType: Array<String> = new Array<String>();
  submitted = false;
  offerLetterConst = NabilOfferLetterConst;
  spinner = false;
  btnDisable = false;
  existingOfferLetter = false;
  isPreviewBtnDisabled = true;
  @ViewChild('constructionLoan', {static: false}) constructionLoan: ConstructionLoanEditComponent;
  @ViewChild('landAndBuilding', {static: false}) landAndBuilding: HomeLandAndBuildingLoanEditComponent;

  constructor(
      private formBuilder: FormBuilder,
      public nbDialogRef: NbDialogRef<HomeLoanTemplateEditComponent>,
      private toastService: ToastService,
      private administrationService: CreditAdministrationService,
      private dialogService: NbDialogService,
  ) { }

  get form() {
    return this.homeLoanForm.controls;
  }

  ngOnInit() {
    this.buildForm();
    if (this.isConstructionLoan) {
      this.landAndBuilding.landBuildingForm.clearValidators();
      this.landAndBuilding.landBuildingForm.updateValueAndValidity();
    }
    if (this.isPurchaseLoan || this.isTakeOverLoan) {
      this.constructionLoan.constructionLoanForm.clearValidators();
      this.constructionLoan.constructionLoanForm.updateValueAndValidity();
    }
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.getHomeLoanType();
      this.setLoanType();
    }
  }

  private getHomeLoanType(): void {
      this.homeLoanType.push(this.initialInformation.loanType);
  }

  private buildForm(): FormGroup {
    return this.homeLoanForm = this.formBuilder.group({
      homeLoanType: [undefined],
    });
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
      },
      dialogClass: 'model-full',
    });
  }

  onSubmit() {
    this.spinner = true;
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
    const securityDetails = [{
      securities: homeLoan.get('securities').value,
    }];
    homeLoan.value['securityDetails'] = securityDetails;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
      if (offerLetterPath.docName.toString() ===
          this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN).toString()) {
        offerLetterPath.initialInformation = JSON.stringify({loan: homeLoan.value, loanType: this.homeLoanForm.get('homeLoanType').value});
      }
    });
    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully update Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.isPreviewBtnDisabled = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to update Offer Letter'));
      this.spinner = false;
      this.btnDisable = true;
      this.isPreviewBtnDisabled = true;
    });
  }

  private setLoanType(): void {
    this.homeLoanForm.get('homeLoanType').patchValue(this.initialInformation.loanType);
    const loanType = this.initialInformation.loanType;
    this.isConstructionLoan = loanType === HomeLoanType.CONSTRUCTION.valueOf();
    this.isPurchaseLoan = loanType === HomeLoanType.PURCHASE.valueOf();
    this.isTakeOverLoan = loanType === HomeLoanType.TAKE_OVER.valueOf();
  }

}
