import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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

      landOwnerName: [undefined],
      securityDistrict: [undefined],
      securityVdc: [undefined],
      securityWard: [undefined],
      securityKitta: [undefined],
      securityArea: [undefined],

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


      samjhautapatra: [undefined],
      samjhautapatra1: [undefined],
      samjhautapatra2: [undefined],
      date: [undefined],
      borrowerName1: [undefined],
      address1: [undefined],
      phoneNo: [undefined],
      attention: [undefined],
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

}
