import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {OfferLetterConst} from '../../../../../cad-documents/cad-document-core/srdb-offer-letter/offer-letter-const';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
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

@Component({
  selector: 'app-personal-guarantee-institutional',
  templateUrl: './personal-guarantee-institutional.component.html',
  styleUrls: ['./personal-guarantee-institutional.component.scss']
})
export class PersonalGuaranteeInstitutionalComponent implements OnInit {
  @Input() cadData;
  @Input() customerInfo;
  @Input() customerLoanId;
  @Input() documentId;
  initialInfoPrint;
  form: FormGroup;
  spinner = false;
  offerLetterConst = CadCheckListTemplateEnum;
  amount;
  nepaliData;
  personalGuarantorNepDataArray: Array<any> = new Array<any>();
  loanHolderNepData;
  taggedGuarantorsDetailsInLoan = [];
  loanHolderData;
  freeText: Array<any> = new Array<any>();
  totalAsset = 0;
  totalLiabilities = 0;
  isIndividualVisible = false;
  isInstitutionVisible = false;
  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private nepaliNumber: NepaliNumberPipe,
      private nepaliToEngNumberPipe: NepaliToEngNumberPipe,
  ) { }

  ngOnInit() {
    this.amount = this.cadData.assignedLoan[0].proposal.proposedLimit;
    this.customerInfo = this.cadData.assignedLoan[0].customerInfo;
    if (!ObjectUtil.isEmpty(this.cadData)) {
      if (!ObjectUtil.isEmpty(this.cadData.loanHolder) &&
          !ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
        this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
      }
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder)) {
        if (this.cadData.loanHolder.customerType === 'INDIVIDUAL') {
            this.isIndividualVisible = true;
        } else {
            this.isInstitutionVisible = true;
        }
    }
    this.loadPersonalGuarantorData();
    this.buildForm();
    this.fillFreeText();
  }
  loadPersonalGuarantorData() {
    if (!ObjectUtil.isEmpty(this.loanHolderNepData)) {
      this.loanHolderData = this.loanHolderNepData;
      this.loanHolderData.guarantorDetails.forEach((val) => {
        this.taggedGuarantorsDetailsInLoan.push(val);
      });
    }
    this.taggedGuarantorsDetailsInLoan = Array.from(
        new Set(
            this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
        )
    ).map((val) => JSON.parse(val));
  }
  buildForm() {
    this.form = this.formBuilder.group({
        personalGuarantee: this.formBuilder.array([]),
    });
      if (this.taggedGuarantorsDetailsInLoan.length > 0) {
          this.taggedPersonalGuarantorsDetailForm();
      } else {
          this.addGuarantor();
      }
  }
  addGuarantor() {
      (this.form.get('personalGuarantee') as FormArray).push(this.formBuilder.control({
          district: [undefined],
          municipality: [undefined],
          wadNo: [undefined],
          branch: [undefined],
          ageOne: [undefined],
          ageOfDebtorOne: [undefined],
          ageOfDebtorTwo: [undefined],
          age: [undefined],
          witnessDistrict1: [undefined],
          witnessMunicipality1: [undefined],
          witnessWardNum1: [undefined],
          witnessAge1: [undefined],
          witnessName1: [undefined],
          witnessDistrict2: [undefined],
          witnessMunicipality2: [undefined],
          witnessWardNum2: [undefined],
          witnessAge2: [undefined],
          witnessName2: [undefined],
          shanakhatWitnessPosition: [undefined],
          shanakhatWitnessName: [undefined],
          year: [undefined],
          month: [undefined],
          day: [undefined],
          roj: [undefined],
          shuvam: [undefined],
          sopDate: [undefined],
          totalAssetsAmount: [undefined],
          assets: this.formBuilder.array([]),
          liabilities: this.formBuilder.array([]),
          totalLiabilitiesAmount: [undefined],
          netWorth: [undefined]
      }));
  }

  taggedPersonalGuarantorsDetailForm() {
    if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
      this.taggedGuarantorsDetailsInLoan.forEach((val) => {
        if (val.guarantorType === 'Personal_Guarantor') {
          const personalGuarantorData = val;
          this.personalGuarantorNepDataArray.push(personalGuarantorData);
          const FormArrayData = (this.form.get('personalGuarantee') as FormArray);
          FormArrayData.push(this.formBuilder.group({
                district: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchDistrict : ''],
                municipality: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchMunVdc : ''],
                wadNo: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchWardNo : ''],
                branch: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchNameInNepali : ''],
                ageOne: [undefined],
                ageOfDebtorOne: [undefined],
                ageOfDebtorTwo: [undefined],
                age: [undefined],
                witnessDistrict1: [undefined],
                witnessMunicipality1: [undefined],
                witnessWardNum1: [undefined],
                witnessAge1: [undefined],
                witnessName1: [undefined],
                witnessDistrict2: [undefined],
                witnessMunicipality2: [undefined],
                witnessWardNum2: [undefined],
                witnessAge2: [undefined],
                witnessName2: [undefined],
                shanakhatWitnessPosition: [undefined],
                shanakhatWitnessName: [undefined],
                year: [undefined],
                month: [undefined],
                day: [undefined],
                roj: [undefined],
                shuvam: [undefined],
                sopDate: [undefined],
                totalAssetsAmount: [undefined],
                assets: this.formBuilder.array([]),
                liabilities: this.formBuilder.array([]),
                totalLiabilitiesAmount: [undefined],
                netWorth: [undefined]
              })
          );
        }
      });
    }
  }
  fillFreeText() {
    if  (this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach((singleCadFile, i) => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
          }
        });
        const freeText = this.form.value;
        if (this.initialInfoPrint !== null) {
          for (let val = 0; val < freeText.personalGuarantee.length; val++) {
              this.form.get(['personalGuarantee', val, 'ageOne']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].ageOne : '');
              this.form.get(['personalGuarantee', val, 'ageOfDebtorOne']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].ageOfDebtorOne : '');
              this.form.get(['personalGuarantee', val, 'ageOfDebtorTwo']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].ageOfDebtorTwo : '');
              this.form.get(['personalGuarantee', val, 'age']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].age : '');
              this.form.get(['personalGuarantee', val, 'witnessDistrict1']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessDistrict1 : '');
              this.form.get(['personalGuarantee', val, 'witnessMunicipality1']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessMunicipality1 : '');
              this.form.get(['personalGuarantee', val, 'witnessWardNum1']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessWardNum1 : '');
              this.form.get(['personalGuarantee', val, 'witnessAge1']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessAge1 : '');
              this.form.get(['personalGuarantee', val, 'witnessName1']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessName1 : '');
              this.form.get(['personalGuarantee', val, 'witnessDistrict2']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessDistrict2 : '');
              this.form.get(['personalGuarantee', val, 'witnessMunicipality2']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessMunicipality2 : '');
              this.form.get(['personalGuarantee', val, 'witnessWardNum2']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessWardNum2 : '');
              this.form.get(['personalGuarantee', val, 'witnessAge2']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessAge2 : '');
              this.form.get(['personalGuarantee', val, 'witnessName2']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].witnessName2 : '');
              this.form.get(['personalGuarantee', val, 'shanakhatWitnessPosition']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].shanakhatWitnessPosition : '');
              this.form.get(['personalGuarantee', val, 'shanakhatWitnessName']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].shanakhatWitnessName : '');
              this.form.get(['personalGuarantee', val, 'shanakhatWitnessName']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].shanakhatWitnessName : '');
              this.form.get(['personalGuarantee', val, 'year']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].year : '');
              this.form.get(['personalGuarantee', val, 'month']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].month : '');
              this.form.get(['personalGuarantee', val, 'day']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].day : '');
              this.form.get(['personalGuarantee', val, 'roj']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].roj : '');
              this.form.get(['personalGuarantee', val, 'shuvam']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].shuvam : '');
              this.form.get(['personalGuarantee', val, 'sopDate']).patchValue(this.initialInfoPrint ?
                  this.initialInfoPrint[val].sopDate : '');
             if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
                 this.setAssets(val, this.initialInfoPrint[val].assets);
                 this.setLiabilities(val, this.initialInfoPrint[val].liabilities);
                 this.calculateNetAmount(val);
             } else {
                 this.addAssets(val);
                 this.addLiabilities(val);
             }
          }
        }
      }
    }
  }
  setAssets(i, currentData) {
      const controls = this.form.get(['personalGuarantee', i, 'assets']) as FormArray;
      currentData.forEach(singleData => {
          controls.push(
              this.formBuilder.group({
                  assetsType: [singleData.assetsType],
                  assetsDescription: [singleData.assetsDescription],
                  assetsAmount: [singleData.assetsAmount],
              })
          );
      });
      this.calculateTotalAssetsAmount(i, 'assets');
  }
    setLiabilities(i, currentData) {
        const controls = this.form.get(['personalGuarantee', i, 'liabilities']) as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    liabilitiesType: [singleData.liabilitiesType],
                    liabilitiesDescription: [singleData.liabilitiesDescription],
                    liabilitiesAmount: [singleData.liabilitiesAmount],
                })
            );
        });
        this.calculateTotalLiabilitiesAmount(i, 'liabilities');
    }
    setFreeText() {
        const free = this.form.value;
        for (let val = 0; val < free.personalGuarantee.length; val++) {
            const tempFreeText = {
                ageOne: this.form.get(['personalGuarantee', val, 'ageOne']).value ?
                    this.form.get(['personalGuarantee', val, 'ageOne']).value : '',
                ageOfDebtorOne: this.form.get(['personalGuarantee', val, 'ageOfDebtorOne']).value ?
                    this.form.get(['personalGuarantee', val, 'ageOfDebtorOne']).value : '',
                ageOfDebtorTwo: this.form.get(['personalGuarantee', val, 'ageOfDebtorTwo']).value ?
                    this.form.get(['personalGuarantee', val, 'ageOfDebtorTwo']).value : '',
                age: this.form.get(['personalGuarantee', val, 'age']).value ?
                    this.form.get(['personalGuarantee', val, 'age']).value : '',
                witnessDistrict1: this.form.get(['personalGuarantee', val, 'witnessDistrict1']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessDistrict1']).value : '',
                witnessMunicipality1: this.form.get(['personalGuarantee', val, 'witnessMunicipality1']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessMunicipality1']).value : '',
                witnessWardNum1: this.form.get(['personalGuarantee', val, 'witnessWardNum1']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessWardNum1']).value : '',
                witnessAge1: this.form.get(['personalGuarantee', val, 'witnessAge1']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessAge1']).value : '',
                witnessName1: this.form.get(['personalGuarantee', val, 'witnessName1']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessName1']).value : '',
                witnessDistrict2: this.form.get(['personalGuarantee', val, 'witnessDistrict2']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessDistrict2']).value : '',
                witnessMunicipality2: this.form.get(['personalGuarantee', val, 'witnessMunicipality2']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessMunicipality2']).value : '',
                witnessWardNum2: this.form.get(['personalGuarantee', val, 'witnessWardNum2']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessWardNum2']).value : '',
                witnessAge2: this.form.get(['personalGuarantee', val, 'witnessAge2']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessAge2']).value : '',
                witnessName2: this.form.get(['personalGuarantee', val, 'witnessName2']).value ?
                    this.form.get(['personalGuarantee', val, 'witnessName2']).value : '',
                shanakhatWitnessPosition: this.form.get(['personalGuarantee', val, 'shanakhatWitnessPosition']).value ?
                    this.form.get(['personalGuarantee', val, 'shanakhatWitnessPosition']).value : '',
                shanakhatWitnessName: this.form.get(['personalGuarantee', val, 'shanakhatWitnessName']).value ?
                    this.form.get(['personalGuarantee', val, 'shanakhatWitnessName']).value : '',
                year: this.form.get(['personalGuarantee', val, 'year']).value ?
                    this.form.get(['personalGuarantee', val, 'year']).value : '',
                month: this.form.get(['personalGuarantee', val, 'month']).value ?
                    this.form.get(['personalGuarantee', val, 'month']).value : '',
                day: this.form.get(['personalGuarantee', val, 'day']).value ?
                    this.form.get(['personalGuarantee', val, 'day']).value : '',
                roj: this.form.get(['personalGuarantee', val, 'roj']).value ?
                    this.form.get(['personalGuarantee', val, 'roj']).value : '',
                shuvam: this.form.get(['personalGuarantee', val, 'shuvam']).value ?
                    this.form.get(['personalGuarantee', val, 'shuvam']).value : '',
                sopDate: this.form.get(['personalGuarantee', val, 'sopDate']).value ?
                    this.form.get(['personalGuarantee', val, 'sopDate']).value : '',
                totalAssetsAmount: this.form.get(['personalGuarantee', val, 'totalAssetsAmount']).value ?
                    this.form.get(['personalGuarantee', val, 'totalAssetsAmount']).value : '',
                totalLiabilitiesAmount: this.form.get(['personalGuarantee', val, 'totalLiabilitiesAmount']).value ?
                    this.form.get(['personalGuarantee', val, 'totalLiabilitiesAmount']).value : '',
                netWorth: this.form.get(['personalGuarantee', val, 'netWorth']).value ?
                    this.form.get(['personalGuarantee', val, 'netWorth']).value : '',
                assets: this.form.get(['personalGuarantee', val, 'assets']).value ?
                    this.form.get(['personalGuarantee', val, 'assets']).value : '',
                liabilities: this.form.get(['personalGuarantee', val, 'liabilities']).value ?
                    this.form.get(['personalGuarantee', val, 'liabilities']).value : '',
            };
            this.freeText.push(tempFreeText);
        }
        return JSON.stringify(this.freeText);
    }
onSubmit() {
  this.spinner = true;
  let flag = true;
  if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
    this.cadData.cadFileList.forEach(singleCadFile => {
      if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
        flag = false;
        singleCadFile.supportedInformation = this.setFreeText();
      }
    });
    if (flag) {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.supportedInformation = this.setFreeText();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }
  } else {
    const cadFile = new CadFile();
    const document = new Document();
    cadFile.supportedInformation = this.setFreeText();
    document.id = this.documentId;
    cadFile.cadDocument = document;
    cadFile.customerLoanId = this.customerLoanId;
    this.cadData.cadFileList.push(cadFile);
  }

  this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
    this.dialogRef.close();
    this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    this.spinner = false;
  }, error => {
    console.error(error);
    this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
    this.dialogRef.close();
    this.spinner = false;
  });
}

    addAssets(i) {
        const assetsData = this.form.get(['personalGuarantee', i, 'assets']) as FormArray;
        assetsData.push(
            this.formBuilder.group({
                assetsType: [undefined],
                assetsDescription: [undefined],
                assetsAmount: [undefined],
            })
        );
    }

    removeAssets(i, j) {
        (<FormArray>this.form.get(['personalGuarantee', i, 'assets'])).removeAt(j);
        this.calculateTotalAssetsAmount(i, 'assets');
    }

    calculateTotalAssetsAmount(i, assetsData) {
        let total = 0;
        (this.form.get(['personalGuarantee', i, assetsData]) as FormArray).controls.forEach(group => {
            total = Number(this.nepaliToEngNumberPipe.transform(group.get('assetsAmount').value))
                + Number(total);
        });
        this.totalAsset = total;
        this.form.get(['personalGuarantee', i, 'totalAssetsAmount']).patchValue(this.engToNepNumberPipe.transform(total.toString()));
        this.calculateNetAmount(i);
    }

    addLiabilities(i) {
        const liabilitiesData = this.form.get(['personalGuarantee', i, 'liabilities']) as FormArray;
        liabilitiesData.push(
            this.formBuilder.group({
                liabilitiesType: [undefined],
                liabilitiesDescription: [undefined],
                liabilitiesAmount: [undefined],
            })
        );
    }

    removeLiabilities(i, ij) {
        (<FormArray>this.form.get(['personalGuarantee', i, 'liabilities'])).removeAt(ij);
        this.calculateTotalLiabilitiesAmount(i, 'liabilities');
    }

    calculateTotalLiabilitiesAmount(i, liabilities) {
        let total = 0;
        (this.form.get(['personalGuarantee', i, liabilities]) as FormArray).controls.forEach(group => {
            total = Number(this.nepaliToEngNumberPipe.transform(group.get('liabilitiesAmount').value))
                + Number(total);
        });
        this.totalLiabilities = total;
        this.form.get(['personalGuarantee', i, 'totalLiabilitiesAmount']).patchValue(this.engToNepNumberPipe.transform(total.toString()));
        this.calculateNetAmount(i);
    }

    calculateNetAmount(i) {
        const finalValue = Number(this.totalAsset) - Number(this.totalLiabilities);
        this.form.get(['personalGuarantee', i, 'netWorth']).patchValue(this.engToNepNumberPipe.transform(finalValue.toString()));
    }
}
