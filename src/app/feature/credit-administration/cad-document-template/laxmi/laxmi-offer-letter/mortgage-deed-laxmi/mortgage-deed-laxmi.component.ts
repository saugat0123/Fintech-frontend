import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-mortgage-deed-laxmi',
  templateUrl: './mortgage-deed-laxmi.component.html',
  styleUrls: ['./mortgage-deed-laxmi.component.scss']
})
export class MortgageDeedLaxmiComponent implements OnInit {

  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  mortgageForm: FormGroup;
  spinner = false;
  initialInfoPrint;
  cadCheckListEnum = CadCheckListTemplateEnum;
  nepaliData;
  proposedAmount;
  customerInfo;
  loanCategory;
  loanHolderData;
  loanHolderNepData;
  mortgageDetailsInLoan = [];
  mortgageDeedNepDataArray: Array<any> = new Array<any>();
  freeText: Array<any> = new Array<any>();
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private nepaliToEnglishPipe: NepaliToEngNumberPipe,
              private nepaliNumber: NepaliNumberPipe) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0].loanCategory)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
    this.proposedAmount = this.cadData.assignedLoan[0].proposal.proposedLimit;
    this.customerInfo = this.cadData.assignedLoan[0].customerInfo;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
          if (!ObjectUtil.isEmpty(JSON.parse(singleCadFile.initialInformation).proposedAmount)) {
            this.proposedAmount = JSON.parse(singleCadFile.initialInformation).proposedAmount;
          }
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData)) {
      if (!ObjectUtil.isEmpty(this.cadData.loanHolder) &&
          !ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
        this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
      }
    }
    this.loadMortgageDeedData();
    this.buildForm();
    this.fillFreeText();
  }
  loadMortgageDeedData() {
    if (!ObjectUtil.isEmpty(this.loanHolderNepData)) {
      this.loanHolderData = this.loanHolderNepData;
      this.loanHolderData.collateralDetails.forEach((val) => {
        this.mortgageDetailsInLoan.push(val);
      });
    }
    this.mortgageDetailsInLoan = Array.from(
        new Set(
            this.mortgageDetailsInLoan.map((val) => JSON.stringify(val))
        )
    ).map((val) => JSON.parse(val));
  }

  buildForm() {
    this.mortgageForm = this.formBuilder.group({
      mortgageDeed: this.formBuilder.array([]),
    });
    this.mortgageDeedDetailForm();
  }
  mortgageDeedDetailForm() {
    if (!ObjectUtil.isEmpty(this.mortgageDetailsInLoan)) {
      this.mortgageDetailsInLoan.forEach((val) => {
        if (val.collateralType === 'land_and_building') {
          const mortgageDeedData = val;
          let genderType = '';
          if (val.gender === '0') {
              genderType = 'महिला';
          } else {
              genderType = 'पुरुष';
          }
            let customerGender = '';
            if (val.gender === '0') {
                customerGender = 'महिला';
            } else {
                customerGender = 'पुरुष';
            }
          this.mortgageDeedNepDataArray.push(mortgageDeedData);
          const FormArrayData = (this.mortgageForm.get('mortgageDeed') as FormArray);
          FormArrayData.push(this.formBuilder.group({
                dateRegistration: [undefined],
                registrationDate: [undefined],
                branchDistrict: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchDistrict : ''],
                branchMun: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchMunVdc : ''],
                branchWardNo: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchWardNo : ''],
                branchName: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchNameInNepali : ''],
                lekhidiekoNaam: [val.nameInNepali ? val.nameInNepali : ''],
                borrowerName: [this.loanHolderNepData.nepaliName ? this.loanHolderNepData.nepaliName : ''],
                acceptanceNumber: [this.loanHolderNepData.miscellaneousDetail ? this.loanHolderNepData.miscellaneousDetail.offerReferenceNo : ''],
                date: [this.loanHolderNepData.miscellaneousDetail ? this.loanHolderNepData.miscellaneousDetail.offerIssueDate : ''],
                proposedAmount: [this.loanHolderNepData.miscellaneousDetail ? this.loanHolderNepData.miscellaneousDetail.loanAmountInFig : ''],
                amountInWords: [this.loanHolderNepData.miscellaneousDetail ? this.loanHolderNepData.miscellaneousDetail.loanAmountInWord : ''],
                individualBorrowerNepaliName: [val.nameInNepali ? val.nameInNepali : ''],
                englishName: [val.name ? val.name : ''],
                dateOfBirth: [val.dateOfBirth ? val.dateOfBirth : ''],
                address: [val.facAddress ? val.facAddress : ''],
                gender: [genderType ? genderType : ''],
                citizenshipNumber: [val.citizenshipNo ? val.citizenshipNo : ''],
                issuedDate: [val.citizenshipIssueDate ? val.citizenshipIssueDate : ''],
                issuedPlace: [val.citizenshipIssueDistrict ? val.citizenshipIssueDistrict : ''],
                landLordSignNumber: [this.loanHolderNepData.miscellaneousDetail ? this.loanHolderNepData.miscellaneousDetail.offerReferenceNo : ''],
                mobileNumber: [val.contactNo ? val.contactNo : ''],
                husbandWifeName: [val.husbandName ? val.husbandName : ''],
                fatherName: [val.fatherName ? val.fatherName : ''],
                grandFatherName: [val.grandFatherName ? val.grandFatherName : ''],
                motherName: [undefined],
                grandMotherName: [undefined],
                nepaliNameCompany: [val.nameInNepali ? val.nameInNepali : ''],
                englishNameCompany: [val.name ? val.name : ''],
                addressCompany: [val.facAddress ? val.facAddress : ''],
                citizenshipNumberCompany: [val.citizenshipNo ? val.citizenshipNo : ''],
                companyRegistrationNumber: [val.registrationNo ? val.registrationNo : ''],
                companyRegistrationDate: [val.regIssueDate ? val.regIssueDate : ''],
                issuedPlaceCompany: [val.companyRegOffice ? val.companyRegOffice : ''],
                sthaiNo: [val.panNo ? val.panNo : ''],
                akhtiyarPerson: [val.collateralAuthorizedPersonDetail ? val.collateralAuthorizedPersonDetail.name : ''],
                akhtiyarAddress: [val.collateralAuthorizedPersonDetail ? val.collateralAuthorizedPersonDetail.address : ''],
                authorizedCitizenshipNoCompany: [val.collateralAuthorizedPersonDetail ? val.collateralAuthorizedPersonDetail.citizenshipNo : ''],
                authorizedCitizenshipDateCompany: [val.collateralAuthorizedPersonDetail ? val.collateralAuthorizedPersonDetail.citizenshipIssueDate : ''],
                authorizedCitizenshipOffice: [val.collateralAuthorizedPersonDetail ? val.collateralAuthorizedPersonDetail.citizenshipIssueDistrict : ''],
                nepaliName1: [this.loanHolderNepData.nepaliName ? this.loanHolderNepData.nepaliName : ''],
                englishName1: [this.loanHolderNepData.name ? this.loanHolderNepData.name : ''],
                dateOfBirth1: [this.loanHolderNepData.dateOfBirth ? this.loanHolderNepData.dateOfBirth : ''],
                gender1: [customerGender ? customerGender : ''],
                citizenshipNumber1: [this.loanHolderNepData.citizenshipNo ? this.loanHolderNepData.citizenshipNo : ''],
                issuedDate1: [this.loanHolderNepData.citizenshipIssueDate ? this.loanHolderNepData.citizenshipIssueDate : ''],
                issuedPlace1: [this.loanHolderNepData.citizenshipIssueDistrict ? this.loanHolderNepData.citizenshipIssueDistrict : ''],
                landLordSignNumber1: [this.loanHolderNepData.miscellaneousDetail ? this.loanHolderNepData.miscellaneousDetail.offerReferenceNo : ''],
                mobileNumber1: [this.loanHolderNepData.contactNo ? this.loanHolderNepData.contactNo : ''],
                husbandWifeName1: [this.loanHolderNepData.husbandName ? this.loanHolderNepData.husbandName : ''],
                fatherName1: [this.loanHolderNepData.fatherName ? this.loanHolderNepData.fatherName : ''],
                grandFatherName1: [this.loanHolderNepData.grandFatherName ? this.loanHolderNepData.grandFatherName : ''],
                nepaliNameCompany1: [this.loanHolderNepData.nepaliName ? this.loanHolderNepData.nepaliName : ''],
                englishNameCompany1: [this.loanHolderNepData.name ? this.loanHolderNepData.name : ''],
                citizenshipNumberCompany1: [this.loanHolderNepData.registrationNo ? this.loanHolderNepData.registrationNo : ''],
                issuedDateCompany1: [this.loanHolderNepData.regIssueDate ? this.loanHolderNepData.regIssueDate : ''],
                issuedPlaceCompany1: [this.loanHolderNepData.companyRegOffice ? this.loanHolderNepData.companyRegOffice : ''],
                sthaiNo1: [this.loanHolderNepData.panNo ? this.loanHolderNepData.panNo : ''],
                akhtiyarPerson1: [this.loanHolderNepData.authorizedPersonDetail ? this.loanHolderNepData.authorizedPersonDetail.name : ''],
                citizenshipNoCompany1: [this.loanHolderNepData.authorizedPersonDetail ? this.loanHolderNepData.authorizedPersonDetail.citizenshipNo : ''],
                citizenshipDateCompany1: [this.loanHolderNepData.authorizedPersonDetail ? this.loanHolderNepData.authorizedPersonDetail.citizenshipIssueDate : ''],
                citizenshipOffice1: [this.loanHolderNepData.authorizedPersonDetail ? this.loanHolderNepData.authorizedPersonDetail.citizenshipIssueDistrict : ''],
                branchName1: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchNameInNepali : ''],
                province: [val.landAndBuildingDetail ? val.landAndBuildingDetail.province : ''],
                district: [val.landAndBuildingDetail ? val.landAndBuildingDetail.district : ''],
                landMunicipality: [val.landAndBuildingDetail ? val.landAndBuildingDetail.municipality : ''],
                landWordNo: [val.landAndBuildingDetail ? val.landAndBuildingDetail.wardNo : ''],
                seatNo: [val.landAndBuildingDetail ? val.landAndBuildingDetail.nakshaSeatNo : ''],
                kittaNo: [val.landAndBuildingDetail ? val.landAndBuildingDetail.plotNo : ''],
                area: [val.landAndBuildingDetail ? val.landAndBuildingDetail.area : ''],
                khande: [undefined],
                motherName1: [undefined],
                grandMotherName1: [undefined],
                signature1: [undefined],
                signature2: [undefined],
                guarantorName1: [undefined],
                guarantorName2: [undefined],
                guarantorAddress1: [undefined],
                guarantorAddress2: [undefined],
                guarantorAge1: [undefined],
                guarantorAge2: [undefined],
                guarantorSignature1: [undefined],
                guarantorSignature2: [undefined],
                year: [undefined],
                month: [undefined],
                date1: [undefined],
                roseShumbham: [undefined],
                chalu: [undefined],
                sepharisPatra: [undefined],
                name1: [undefined],
                praDot: [undefined],
                signature3: [undefined],
                borrowerSignature1: [undefined],
                borrowerSignature2: [undefined],
                borrowerSignature3: [undefined],
                borrowerName1: [undefined],
                borrowerName2: [undefined],
                borrowerName3: [undefined],
                borrowerDesignation1: [undefined],
                borrowerDesignation2: [undefined],
                borrowerDesignation3: [undefined],
                borrowerDate1: [undefined],
                borrowerDate2: [undefined],
                borrowerDate3: [undefined],
                kittaNumber: [undefined],
                landAmount: [undefined],
                registrationNumber1: [undefined],
                paritMiti1: [undefined],
                tokenNumber1: [undefined],
                date2: [undefined],
                karobarAmount1: [undefined],
                registrationAmount1: [undefined],
                pujiGatAmount1: [undefined],
                taxAmount1: [undefined],
                billNumber1: [undefined],
                landRevenue: [undefined],
                doorMukam: [undefined],
                signatureDate1: [undefined],
                signatureDate2: [undefined],
                acceptanceName1: [undefined],
                acceptanceName2: [undefined],
                acceptanceDesignation1: [undefined],
                acceptanceDesignation2: [undefined],
                absence: [undefined],
                area1: [undefined],
                mohiName: [undefined],
                toward: [undefined],
                purchasedLand: [undefined],
                purchasedHouse: [undefined],
                soldLand: [undefined],
                soldHouse: [undefined],
                apology: [undefined],
                akhtiyarAddress1: [undefined],
          })
          );
        }
      });
    }
  }
    fillFreeText() {
        if  (this.cadData.cadFileList.length > 0) {
            if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
                this.cadData.cadFileList.forEach(singleCadFile => {
                    if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                        this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
                    }
                });
                const freeText = this.mortgageForm.value;
                if (this.initialInfoPrint !== null) {
                    for (let val = 0; val < freeText.mortgageDeed.length; val++) {
                        this.mortgageForm.get(['mortgageDeed', val, 'dateRegistration']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].dateRegistration : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'registrationDate']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].registrationDate : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'motherName']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].motherName : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'grandMotherName']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].grandMotherName : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'khande']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].khande : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'motherName1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].motherName1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'grandMotherName1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].grandMotherName1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'signature1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].signature1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'signature2']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].signature2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'guarantorName1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].guarantorName1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'guarantorName2']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].guarantorName2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'guarantorAddress1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].guarantorAddress1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'guarantorAddress2']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].guarantorAddress2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'guarantorAge1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].guarantorAge1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'guarantorAge2']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].guarantorAge2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'guarantorSignature1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].guarantorSignature1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'guarantorSignature2']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].guarantorSignature2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'year']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].year : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'month']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].month : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'date1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].date1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'roseShumbham']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].roseShumbham : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'chalu']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].chalu : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'sepharisPatra']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].sepharisPatra : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'name1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].name1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'praDot']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].praDot : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'signature3']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].signature3 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerSignature1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature2']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerSignature2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature3']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerSignature3 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerName1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerName1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerName2']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerName2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerName3']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerName3 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerDesignation1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation2']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerDesignation2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation3']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerDesignation3 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerDate1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate2']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].borrowerDate2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate3']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].borrowerDate3 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'kittaNumber']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].kittaNumber : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'landAmount']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].landAmount : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'registrationNumber1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].registrationNumber1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'paritMiti1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].paritMiti1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'tokenNumber1']).patchValue(this.initialInfoPrint ?
                            this.initialInfoPrint[val].tokenNumber1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'date2']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].date2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'karobarAmount1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].karobarAmount1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'registrationAmount1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].registrationAmount1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'pujiGatAmount1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].pujiGatAmount1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'taxAmount1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].taxAmount1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'billNumber1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].billNumber1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'landRevenue']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].landRevenue : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'doorMukam']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].doorMukam : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'signatureDate1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].signatureDate1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'signatureDate2']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].signatureDate2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'acceptanceName1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].acceptanceName1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'acceptanceName2']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].acceptanceName2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'acceptanceDesignation1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].acceptanceDesignation1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'acceptanceDesignation2']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].acceptanceDesignation2 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'absence']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].absence : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'area1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].area1 : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'mohiName']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].mohiName : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'toward']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].toward : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'purchasedLand']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].purchasedLand : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'purchasedHouse']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].purchasedHouse : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'soldLand']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].soldLand : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'soldHouse']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].soldHouse : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'apology']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].apology : '');
                        this.mortgageForm.get(['mortgageDeed', val, 'akhtiyarAddress1']).patchValue(this.initialInfoPrint ?
                                this.initialInfoPrint[val].akhtiyarAddress1 : '');
                    }
                }
            }
        }
    }
  setFreeText() {
      const free = this.mortgageForm.value;
      for (let val = 0; val < free.mortgageDeed.length; val++) {
          const freeText = {
              dateRegistration: this.mortgageForm.get(['mortgageDeed', val, 'dateRegistration']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'dateRegistration']).value : '',
              registrationDate: this.mortgageForm.get(['mortgageDeed', val, 'registrationDate']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'registrationDate']).value : '',
              motherName: this.mortgageForm.get(['mortgageDeed', val, 'motherName']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'motherName']).value : '',
              grandMotherName: this.mortgageForm.get(['mortgageDeed', val, 'grandMotherName']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'grandMotherName']).value : '',
              khande: this.mortgageForm.get(['mortgageDeed', val, 'khande']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'khande']).value : '',
              motherName1: this.mortgageForm.get(['mortgageDeed', val, 'motherName1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'motherName1']).value : '',
              grandMotherName1: this.mortgageForm.get(['mortgageDeed', val, 'grandMotherName1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'grandMotherName1']).value : '',
              signature1: this.mortgageForm.get(['mortgageDeed', val, 'signature1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'signature1']).value : '',
              signature2: this.mortgageForm.get(['mortgageDeed', val, 'signature2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'signature2']).value : '',
              guarantorName1: this.mortgageForm.get(['mortgageDeed', val, 'guarantorName1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'guarantorName1']).value : '',
              guarantorName2: this.mortgageForm.get(['mortgageDeed', val, 'guarantorName2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'guarantorName2']).value : '',
              guarantorAddress1: this.mortgageForm.get(['mortgageDeed', val, 'guarantorAddress1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'guarantorAddress1']).value : '',
              guarantorAddress2: this.mortgageForm.get(['mortgageDeed', val, 'guarantorAddress2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'guarantorAddress2']).value : '',
              guarantorAge1: this.mortgageForm.get(['mortgageDeed', val, 'guarantorAge1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'guarantorAge1']).value : '',
              guarantorAge2: this.mortgageForm.get(['mortgageDeed', val, 'guarantorAge2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'guarantorAge2']).value : '',
              guarantorSignature1: this.mortgageForm.get(['mortgageDeed', val, 'guarantorSignature1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'guarantorSignature1']).value : '',
              guarantorSignature2: this.mortgageForm.get(['mortgageDeed', val, 'guarantorSignature2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'guarantorSignature2']).value : '',
              year: this.mortgageForm.get(['mortgageDeed', val, 'year']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'year']).value : '',
              month: this.mortgageForm.get(['mortgageDeed', val, 'month']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'month']).value : '',
              date1: this.mortgageForm.get(['mortgageDeed', val, 'date1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'date1']).value : '',
              roseShumbham: this.mortgageForm.get(['mortgageDeed', val, 'roseShumbham']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'roseShumbham']).value : '',
              chalu: this.mortgageForm.get(['mortgageDeed', val, 'chalu']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'chalu']).value : '',
              sepharisPatra: this.mortgageForm.get(['mortgageDeed', val, 'sepharisPatra']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'sepharisPatra']).value : '',
              name1: this.mortgageForm.get(['mortgageDeed', val, 'name1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'name1']).value : '',
              praDot: this.mortgageForm.get(['mortgageDeed', val, 'praDot']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'praDot']).value : '',
              signature3: this.mortgageForm.get(['mortgageDeed', val, 'signature3']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'signature3']).value : '',
              borrowerSignature1: this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature1']).value : '',
              borrowerSignature2: this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature2']).value : '',
              borrowerSignature3: this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature3']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerSignature3']).value : '',
              borrowerName1: this.mortgageForm.get(['mortgageDeed', val, 'borrowerName1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerName1']).value : '',
              borrowerName2: this.mortgageForm.get(['mortgageDeed', val, 'borrowerName2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerName2']).value : '',
              borrowerName3: this.mortgageForm.get(['mortgageDeed', val, 'borrowerName3']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerName3']).value : '',
              borrowerDesignation1: this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation1']).value : '',
              borrowerDesignation2: this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation2']).value : '',
              borrowerDesignation3: this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation3']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerDesignation3']).value : '',
              borrowerDate1: this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate1']).value : '',
              borrowerDate2: this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate2']).value : '',
              borrowerDate3: this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate3']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'borrowerDate3']).value : '',
              kittaNumber: this.mortgageForm.get(['mortgageDeed', val, 'kittaNumber']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'kittaNumber']).value : '',
              landAmount: this.mortgageForm.get(['mortgageDeed', val, 'landAmount']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'landAmount']).value : '',
              registrationNumber1: this.mortgageForm.get(['mortgageDeed', val, 'registrationNumber1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'registrationNumber1']).value : '',
              paritMiti1: this.mortgageForm.get(['mortgageDeed', val, 'paritMiti1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'paritMiti1']).value : '',
              tokenNumber1: this.mortgageForm.get(['mortgageDeed', val, 'tokenNumber1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'tokenNumber1']).value : '',
              date2: this.mortgageForm.get(['mortgageDeed', val, 'date2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'date2']).value : '',
              karobarAmount1: this.mortgageForm.get(['mortgageDeed', val, 'karobarAmount1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'karobarAmount1']).value : '',
              registrationAmount1: this.mortgageForm.get(['mortgageDeed', val, 'registrationAmount1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'registrationAmount1']).value : '',
              pujiGatAmount1: this.mortgageForm.get(['mortgageDeed', val, 'pujiGatAmount1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'pujiGatAmount1']).value : '',
              taxAmount1: this.mortgageForm.get(['mortgageDeed', val, 'taxAmount1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'taxAmount1']).value : '',
              billNumber1: this.mortgageForm.get(['mortgageDeed', val, 'billNumber1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'billNumber1']).value : '',
              landRevenue: this.mortgageForm.get(['mortgageDeed', val, 'landRevenue']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'landRevenue']).value : '',
              doorMukam: this.mortgageForm.get(['mortgageDeed', val, 'doorMukam']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'doorMukam']).value : '',
              signatureDate1: this.mortgageForm.get(['mortgageDeed', val, 'signatureDate1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'signatureDate1']).value : '',
              signatureDate2: this.mortgageForm.get(['mortgageDeed', val, 'signatureDate2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'signatureDate2']).value : '',
              acceptanceName1: this.mortgageForm.get(['mortgageDeed', val, 'acceptanceName1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'acceptanceName1']).value : '',
              acceptanceName2: this.mortgageForm.get(['mortgageDeed', val, 'acceptanceName2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'acceptanceName2']).value : '',
              acceptanceDesignation1: this.mortgageForm.get(['mortgageDeed', val, 'acceptanceDesignation1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'acceptanceDesignation1']).value : '',
              acceptanceDesignation2: this.mortgageForm.get(['mortgageDeed', val, 'acceptanceDesignation2']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'acceptanceDesignation2']).value : '',
              absence: this.mortgageForm.get(['mortgageDeed', val, 'absence']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'absence']).value : '',
              area1: this.mortgageForm.get(['mortgageDeed', val, 'area1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'area1']).value : '',
              mohiName: this.mortgageForm.get(['mortgageDeed', val, 'mohiName']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'mohiName']).value : '',
              toward: this.mortgageForm.get(['mortgageDeed', val, 'toward']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'toward']).value : '',
              purchasedLand: this.mortgageForm.get(['mortgageDeed', val, 'purchasedLand']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'purchasedLand']).value : '',
              purchasedHouse: this.mortgageForm.get(['mortgageDeed', val, 'purchasedHouse']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'purchasedHouse']).value : '',
              soldLand: this.mortgageForm.get(['mortgageDeed', val, 'soldLand']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'soldLand']).value : '',
              soldHouse: this.mortgageForm.get(['mortgageDeed', val, 'soldHouse']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'soldHouse']).value : '',
              apology: this.mortgageForm.get(['mortgageDeed', val, 'apology']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'apology']).value : '',
              akhtiyarAddress1: this.mortgageForm.get(['mortgageDeed', val, 'akhtiyarAddress1']).value ?
                  this.mortgageForm.get(['mortgageDeed', val, 'akhtiyarAddress1']).value : '',
          };
          this.freeText.push(freeText);
      }
      return JSON.stringify(this.freeText);
  }
  submit() {
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
}
