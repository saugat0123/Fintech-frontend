import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {LoanType} from '../../../../../loan/model/loanType';
import {SubLoanType} from '../../../../../loan/model/subLoanType';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LaxmiPurpose} from '../../../../../loan/model/laxmi-purpose';

@Component({
  selector: 'app-offer-letter-laxmi',
  templateUrl: './offer-letter-laxmi.component.html',
  styleUrls: ['./offer-letter-laxmi.component.scss']
})
export class OfferLetterLaxmiComponent implements OnInit {

  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  @ViewChild('select', {static: true}) modal: TemplateRef<any>;
  offerLetterForm: FormGroup;
  spinner = false;
  initialInfoPrint;
  cadCheckListEnum = CadCheckListTemplateEnum;
  nepaliData;
  proposedAmount;
  customerInfo;
  loanType;
  loanName;
  loanTypes = LoanType;
  subloanTypes;
  subloanType;
  subloanTypeEnum = SubLoanType;
  hasSubLoanType = false;
  purpose = LaxmiPurpose.enumObject();

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private modalService: NgbModal,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private nepaliToEnglishPipe: NepaliToEngNumberPipe,
              private nepaliNumber: NepaliNumberPipe) { }

  ngOnInit() {
    console.log('purpose', this.purpose);
    console.log('cadData', this.cadData);
    // if (!ObjectUtil.isEmpty(this.cadData)) {
    //   if (this.cadData.assignedLoan.length > 1) {
    //     const loanNameArray = [];
    //     this.cadData.assignedLoan.forEach((a) => {
    //       loanNameArray.push(a.loan.name);
    //     });
    //     this.loanName = loanNameArray;
    //   } else {
    //     this.loanName = this.cadData.assignedLoan[0].loan.name;
    //   }
    // }
    this.loanName = this.cadData.assignedLoan[0].loan.name;
    console.log('loanName', this.loanName);
    this.subloanTypes = SubLoanType.value(this.loanName);
    this.loanType = this.cadData.assignedLoan[0].loanType;
    console.log('loanType', this.loanType);
    this.checkSubLoanType();
    this.buildForm();
    if (this.hasSubLoanType) {
      this.modalService.open(this.modal);
    }
    this.addFixedAssetsCollateral();
  }

  buildForm() {
    this.offerLetterForm = this.formBuilder.group({
      signature1: [undefined],
      empoweredName: [undefined],
      signature2: [undefined],
      signature3: [undefined],
      designation2: [undefined],
      designation3: [undefined],
      name2: [undefined],
      name3: [undefined],
      contactNumber: [undefined],
      address: [undefined],
      borrowerName: [undefined],
      branchName: [undefined],
      telephoneNumber: [undefined],
      faxNumber: [undefined],
      subLoanType: [undefined],

      // new/enhance Security
      fixedAssetsCollateral: this.formBuilder.array([]),
      // landOwnerName: [undefined],
      // securityDistrict: [undefined],
      // securityVdc: [undefined],
      // securityWard: [undefined],
      // securityKitta: [undefined],
      // securityArea: [undefined],

      landOwnerName1: [undefined],
      securityDistrict1: [undefined],
      securityVdc1: [undefined],
      securityWard1: [undefined],
      securityKitta1: [undefined],
      securityArea1: [undefined],

      vehicleDetails: [undefined],
      engineNo: [undefined],
      chasisNo: [undefined],
      vehicleNo: [undefined],

      shareOwnerName: [undefined],
      shareCompanyName: [undefined],
      shareUnit: [undefined],
      shareType: [undefined],

      personalName: [undefined],
      personalAmount: [undefined],
      personalAmountWord: [undefined],

      corporateName: [undefined],
      corporateAmount: [undefined],
      corporateAmountWord: [undefined],

      letterCM: [undefined],
      guarnateeCM: [undefined],

      accountName: [undefined],
      accountNo: [undefined],
      accountAmount: [undefined],
      accountAmountWord: [undefined],

      loanAmount: [undefined],
      loanAmountWord: [undefined],
      promiseAmount: [undefined],
      promiseAmountWord: [undefined],

      ligLoan: [undefined],
      landLoanAmount: [undefined],
      loanBorrower: [undefined],
      consumptionAmount: [undefined],
      totalConsumptionAmount: [undefined],
      totalConsumptionAmountWord: [undefined],

      // renew
      landOwnerName2: [undefined],
      securityDistrict2: [undefined],
      securityVdc2: [undefined],
      securityWard2: [undefined],
      securityKitta2: [undefined],
      securityArea2: [undefined],

      landOwnerName3: [undefined],
      securityDistrict3: [undefined],
      securityVdc3: [undefined],
      securityWard3: [undefined],
      securityKitta3: [undefined],
      securityArea3: [undefined],

      vehicleDetails1: [undefined],
      engineNo1: [undefined],
      chasisNo1: [undefined],
      vehicleNo1: [undefined],

      shareOwnerName1: [undefined],
      shareCompanyName1: [undefined],
      shareUnit1: [undefined],
      shareType1: [undefined],

      personalName1: [undefined],
      personalAmount1: [undefined],
      personalAmountWord1: [undefined],

      corporateName1: [undefined],
      corporateAmount1: [undefined],
      corporateAmountWord1: [undefined],

      letterCM1: [undefined],
      guarnateeCM1: [undefined],

      accountName1: [undefined],
      accountNo1: [undefined],
      accountAmount1: [undefined],
      accountAmountWord1: [undefined],

      loanAmount1: [undefined],
      loanAmountWord1: [undefined],
      promiseAmount1: [undefined],
      promiseAmountWord1: [undefined],

      ligLoan1: [undefined],
      landLoanAmount1: [undefined],
      loanBorrower1: [undefined],
      consumptionAmount1: [undefined],
      totalConsumptionAmount1: [undefined],
      totalConsumptionAmountWord1: [undefined],

      date1: [undefined],
      amount1: [undefined],
      date2: [undefined],
      amount2: [undefined],
      date3: [undefined],
      amount3: [undefined],
      date4: [undefined],
      date5: [undefined],
      date6: [undefined],
      date7: [undefined],
      date8: [undefined],
      date9: [undefined],
      date10: [undefined],

      // subLoantype
      samjhautapatra: [undefined],
      samjhautapatra1: [undefined],
      samjhautapatra2: [undefined],
      date: [undefined],
      borrowerName1: [undefined],
      address1: [undefined],
      phoneNo: [undefined],
      attention: [undefined],
      workingRate: [undefined],
      workingLandBuildingRate: [undefined],
      month: [undefined],
      goldRate: [undefined],
      homeRate: [undefined],
      homeAmount: [undefined],
      homeAmountWord: [undefined],
      capitalRate: [undefined],
      vehicleRate: [undefined],
      refPurpose: [undefined],
      creditPurpose: [undefined],
      creditRate: [undefined],
      creditAmount: [undefined],
      creditMaturityDate: [undefined],
      creditTelexAmount: [undefined],
      loanAgainstRate: [undefined],
      ttRate: [undefined],
      buildingDis: [undefined],
      buildingVdc: [undefined],
      buildingKitta: [undefined],
      buildingArea: [undefined],
      buildingLand: [undefined],
      purchaseRate: [undefined],
      conBuildingDis: [undefined],
      conBuildingVdc: [undefined],
      conBuildingKitta: [undefined],
      conBuildingArea: [undefined],
      conBuildingLand: [undefined],
      totalEstimateRate: [undefined],
      totalEstBuildingLandRate: [undefined],
      totalConRate: [undefined],
      totalConBuildingLandRate: [undefined],
      moratariumRate: [undefined],
      hirePersonalUse: [undefined],
      hireModel: [undefined],
      hireRate: [undefined],
      autoRate: [undefined],
      autoModel: [undefined],
      autoDrawRate: [undefined],
      bidRate: [undefined],
      performanceRate: [undefined],
      advanceRate: [undefined],
      educationalRate: [undefined],
      educationalRate1: [undefined],
      agmiRate: [undefined],
      agmiRate1: [undefined],

      // other Clauses
      reviewDate: [undefined],
      premiumRate: [undefined],
      monthlyRate: [undefined],
      quaterlyRate: [undefined],
      anurupRate: [undefined],
      interestMonth: [undefined],
      interestPremiumRate: [undefined],
      interestRate: [undefined],
      repaymentAmount: [undefined],
      repaymentAmountWord: [undefined],
      repaymentMonthly: [undefined],
      repaymentMonthlyRate: [undefined],
      repaymentMonth: [undefined],
      repaymentAmount1: [undefined],
      repaymentAmountWord1: [undefined],
      totalBorrowerAmount: [undefined],
      borrowerAmount: [undefined],
      borrowerAmount1: [undefined],
      borrowerAmount2: [undefined],
      administrationRate: [undefined],
      administrationAmount: [undefined],
      reviewRate: [undefined],
      reviewAmount: [undefined],
    });
  }

  submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }
    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
  log(data) {
   this.subloanType = data;
   this.modalService.dismissAll();
  }
  close() {
    this.modalService.dismissAll();
  }

  checkSubLoanType() {
    if (this.loanName.toLowerCase() === 'demand loan' ||
        this.loanName.toLowerCase() === 'term loan' ||
        this.loanName.toLowerCase() === 'home loan' ||
        this.loanName.toLowerCase() === 'sana byawasai karja' ||
        this.loanName.toLowerCase() === 'sana byawasai karja - lite' ||
        this.loanName.toLowerCase() === 'bank guarantee' ||
        this.loanName.toLowerCase() === 'trust receipt loan') {
      this.hasSubLoanType = true;
    }
  }

  addFixedAssetsCollateral() {
    const data = this.offerLetterForm.get('fixedAssetsCollateral') as FormArray;
    data.push(
        this.formBuilder.group({
          landOwnerName: [undefined],
          securityDistrict: [undefined],
          securityVdc: [undefined],
          securityWard: [undefined],
          securityKitta: [undefined],
          securityArea: [undefined],
        })
    );
  }

  removeFixedAssetsCollateral(i) {
    (<FormArray>this.offerLetterForm.get('fixedAssetsCollateral')).removeAt(i);
  }
}
