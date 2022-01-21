import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {NepDataPersonal} from '../../../../model/nepDataPersonal';

@Component({
  selector: 'app-mortgage-deed',
  templateUrl: './mortgage-deed.component.html',
  styleUrls: ['./mortgage-deed.component.scss']
})
export class MortgageDeedComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;
  nepDataPersonal = new NepDataPersonal();

  constructor(private dialogRef: NbDialogRef<MortgageDeedComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            this.setGuarantorDetails(initialInfo.guarantorDetails);
          }
          if (!ObjectUtil.isEmpty(initialInfo.rinBibaran)) {
            this.setRinBibaran(initialInfo.rinBibaran);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      const collateralOwnerAddress =
          !ObjectUtil.isEmpty(this.nepaliData.collateralOwnerDetails) ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentMunicipalities.nepaliName : '' + ' j8f g+= ' +
          !ObjectUtil.isEmpty(this.nepaliData.collateralOwnerDetails) ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentWard : '' + ' , ' +
          !ObjectUtil.isEmpty(this.nepaliData.collateralOwnerDetails) ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentDistrict.nepaliName : '';
      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        cityName: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
        jillaName: this.nepaliData.branchMunVdc ? this.nepaliData.branchMunVdc : '',
        wodaNum: this.nepaliData.branchWardNo ? this.nepaliData.branchWardNo : '',
        jillaName2: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        dhitoName: !ObjectUtil.isEmpty(this.nepaliData.collateralOwnerDetails) ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerName : '',
        upabhogRu: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        upabhogRuWord: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        creditorNameEnglish5: this.nepaliData.branchNameInEnglish ? this.nepaliData.branchNameInEnglish : '',
        creditorNameNepali4: this.nepaliData.collateralOwnerDetails[0].collateralOwnerName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerName : '',
        creditorNameEnglish4: this.nepaliData.collateralOwnerDetails[0].collateralOwnerNameInEnglish ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerNameInEnglish : '',
        dateOfBirth3: this.nepaliData.collateralOwnerDetails[0].collateralOwnerDOB ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerDOB : '',
        address3: collateralOwnerAddress ? collateralOwnerAddress : '',
        sex3: this.nepaliData.collateralOwnerDetails[0].collateralOwnerGender ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerGender : '',
        creditorCitizenshipNo2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerCitizenshipNo ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerCitizenshipNo : '',
       creditorCitizenshipOfficeAddress2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerCitizenshipIssueDistrict ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerCitizenshipIssueDistrict : '',
       jaggaDhaniSanketNo: this.nepaliData.collateralOwnerDetails[0].collateralOwnerCodeNo ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerCodeNo : '',
       creditorMobileNo2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerMobileNo ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerMobileNo : '',
       creditorCitizenshipIssueDate2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerCitizenshipIssueDate ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerCitizenshipIssueDate : '',
       creditorFatherName2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerFatherName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerFatherName : '',
       creditorGrandFatherName2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerGrandFatherName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerGrandFatherName : '',
       creditorSpouse2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerSpouse ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerSpouse : '',
       creditorMotherName2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerMotherName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerMotherName : '',
       creditorGrandMotherName2: this.nepaliData.collateralOwnerDetails[0].collateralOwnerGrandMotherName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerMotherName : '',
       jaggaPradeshNo: this.nepaliData.collateralDetails[0].collateralProvinceNo ? this.nepaliData.collateralDetails[0].collateralProvinceNo : '',
        jaggaDistrict: this.nepaliData.collateralDetails[0].collateralDistrict ? this.nepaliData.collateralDetails[0].collateralDistrict : '',
       sawikMunicipality: this.nepaliData.collateralDetails[0].collateralMunVdcOriginal ? this.nepaliData.collateralDetails[0].collateralMunVdcOriginal : '',
       sawikWardNo: this.nepaliData.collateralDetails[0].collateralWardNoOld ? this.nepaliData.collateralDetails[0].collateralWardNoOld : '',
       sawikTole: this.nepaliData.collateralDetails[0].toleOld ? this.nepaliData.collateralDetails[0].toleOld : '',
       halMunicipality: this.nepaliData.collateralDetails[0].collateralMunVdcChanged ? this.nepaliData.collateralDetails[0].collateralMunVdcChanged : '',
        halWardNo: this.nepaliData.collateralDetails[0].wardNoNew ? this.nepaliData.collateralDetails[0].wardNoNew : '',
       halTole: this.nepaliData.collateralDetails[0].toleNew ? this.nepaliData.collateralDetails[0].toleNew : '',
       seatNo: this.nepaliData.collateralDetails[0].seatNo ? this.nepaliData.collateralDetails[0].seatNo : '',
       kittaNoAnka: this.nepaliData.collateralDetails[0].plotNo ? this.nepaliData.collateralDetails[0].plotNo : '',
       kittaNoWord: this.nepaliData.collateralDetails[0].plotNoOld ? this.nepaliData.collateralDetails[0].plotNoOld : '',
       area: this.nepaliData.collateralDetails[0].areaOfCollateral ? this.nepaliData.collateralDetails[0].areaOfCollateral : '',
        type: this.nepaliData.collateralDetails[0].collateralType ? this.nepaliData.collateralDetails[0].collateralType : '',
      });
    }

    const customerAddress =
        this.nepaliData.permanentMunicipalities.nepaliName + ' j8f g+= ' +
        this.nepaliData.permanentWard + ' , ' +
        this.nepaliData.permanentDistrict.nepaliName;
    this.form.get(['rinBibaran', 0, 'creditorNameNepali2']).patchValue(this.nepaliData.name);
    this.form.get(['rinBibaran', 0, 'creditorNameEnglish2']).patchValue(this.nepaliData.nameInEnglish);
    this.form.get(['rinBibaran', 0, 'dateOfBirth1']).patchValue(this.nepaliData.dob);
    this.form.get(['rinBibaran', 0, 'address1']).patchValue(customerAddress);
    this.form.get(['rinBibaran', 0, 'sex1']).patchValue(this.nepaliData.gender === '1' ? 'पुरुष' : 'महिला');
    this.form.get(['rinBibaran', 0, 'creditorCitizenshipNo1']).patchValue(this.nepaliData.citizenshipNo);
    this.form.get(['rinBibaran', 0, 'creditorCitizenshipIssueDate1']).patchValue(this.nepaliData.citizenshipIssueDate);
    this.form.get(['rinBibaran', 0, 'creditorCitizenshipIssueOffice1']).patchValue(this.nepaliData.citizenshipIssueDistrict);
    this.form.get(['rinBibaran', 0, 'creditorMobileNo1']).patchValue(this.nepaliData.contactNumber);
    this.form.get(['rinBibaran', 0, 'creditorSpouse1']).patchValue(this.nepaliData.husbandName);
    this.form.get(['rinBibaran', 0, 'creditorFatherName1']).patchValue(this.nepaliData.fatherName);
    this.form.get(['rinBibaran', 0, 'creditorMotherName1']).patchValue(this.nepaliData.motherName);
    this.form.get(['rinBibaran', 0, 'creditorGrandFatherName1']).patchValue(this.nepaliData.grandFatherName);
    this.form.get(['rinBibaran', 0, 'creditorGrandMotherName1']).patchValue(this.nepaliData.grandMotherName);

  }

  setGuarantorDetails(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        citizenNumber: [value.citizenNumber],
        issuedYear: [value.issuedYear],
        guarantorCDOoffice: [value.guarantorCDOoffice],
        guarantorDistrict: [value.guarantorDistrict],
        guarantorMunicipality: [value.guarantorMunicipality],
        guarantorWadNo: [value.guarantorWadNo]
      }));
    });
  }
  onSubmit(): void {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
          this.initialInfoPrint = singleCadFile.initialInformation;
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);

      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }


  buildForm() {
    this.form = this.formBuilder.group({
      customerName : [undefined],
      tokenDartaNo: [undefined],
      regNo: [undefined],
      creditorName: [undefined],
      tokenDartaDate1: [undefined],
      tokenDartaDate2: [undefined],
      districtName: [undefined],
      municipalityName: [undefined],
      wardNo: [undefined],
      branchName: [undefined],
      dhitoName: [undefined],
      aageChreditor: [undefined],
      upabhogRu: [undefined],
      upabhogRuWord: [undefined],
      jyayeJethaRu: [undefined],
      jyayeJethaRuWord: [undefined],
      creditorNameNepali1: [undefined],
      creditorNameEnglish1: [undefined],
      dartaDate1: [undefined],
      praliNo1: [undefined],
      dartaOfficeAndAddress1: [undefined],
      panNo1: [undefined],
      dartaMiti1: [undefined],
      dartaOffice1: [undefined],
      RegOfficeAddress1: [undefined],
      propNameNepali1: [undefined],
      propNameEnglish1: [undefined],
      propCitizenNo1: [undefined],
      propCitizenJariDate1: [undefined],
      propCitizenJariOffice1: [undefined],
      propAddress1: [undefined],
      creditorNameNepali3: [undefined],
      creditorNameEnglish3: [undefined],
      dartaDate2: [undefined],
      praliNo2: [undefined],
      dartaOfficeAndAddress2: [undefined],
      panNo2: [undefined],
      dartaMiti2: [undefined],
      dartaOffice2: [undefined],
      RegOfficeAddress2: [undefined],
      propNameNepali2: [undefined],
      propNameEnglish2: [undefined],
      propCitizenNo2: [undefined],
      propCitizenJariDate2: [undefined],
      propCitizenJariOffice2: [undefined],
      propAddress2: [undefined],
      creditorNameNepali4: [undefined],
      creditorNameEnglish4: [undefined],
      dateOfBirth3: [undefined],
      address3: [undefined],
      sex3: [undefined],
      creditorCitizenshipNo2: [undefined],
      creditorCitizenshipIssueDate2: [undefined],
      creditorCitizenshipIssueOffice2: [undefined],
      creditorCitizenshipOfficeAddress2: [undefined],
      jaggaDhaniSanketNo: [undefined],
      creditorMobileNo2: [undefined],
      creditorFatherName2: [undefined],
      creditorMotherName2: [undefined],
      creditorSpouse2: [undefined],
      creditorGrandFatherName2: [undefined],
      creditorGrandMotherName2: [undefined],
      creditorNameNepali5: [undefined],
      branchName1: [undefined],
      creditorNameEnglish5: [undefined],
      branchName2: [undefined],
      dartaDate3: [undefined],
      dartaNo3: [undefined],
      dartaOfficeAndAddress3: [undefined],
      panNo3: [undefined],
      dartaMiti3: [undefined],
      dartaOffice3: [undefined],
      pratiNameNepali3: [undefined],
      pratiNameEnglish3: [undefined],
      pratiCitizenNo3: [undefined],
      pratiCitizenJariDate3: [undefined],
      pratiCitizenJariOffice3: [undefined],
      pratiAddress3: [undefined],
      jaggaPradeshNo: [undefined],
      jaggaDistrict: [undefined],
      sawikDistrict: [undefined],
      sawikMunicipality: [undefined],
      sawikWardNo: [undefined],
      sawikTole: [undefined],
      halDistrict: [undefined],
      halMunicipality: [undefined],
      halWardNo: [undefined],
      halTole: [undefined],
      seatNo: [undefined],
      kittaNoAnka: [undefined],
      kittaNoWord: [undefined],
      Khanda: [undefined],
      area: [undefined],
      type: [undefined],
      kaifiyat: [undefined],
      kittaNo: [undefined],
      chaluArthikBarsa: [undefined],
      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDay: [undefined],
      itisambatTime: [undefined],
      itisambatShubam: [undefined],
      dhitoSurakchanKarta: [undefined],
      dhitoSurakchanKartaName: [undefined],
      karmachariName1: [undefined],
      karmachariPosition1: [undefined],
      karmachariDate1: [undefined],
      karmachariName2: [undefined],
      karmachariPosition2: [undefined],
      karmachariDate2: [undefined],
      jaggaMinimumPrice: [undefined],
      karmachariName3: [undefined],
      karmachariPosition3: [undefined],
      karmachariDate3: [undefined],
      regNo2: [undefined],
      paritDate: [undefined],
      tokenDartaNo2: [undefined],
      date: [undefined],
      karobatThailiRu: [undefined],
      regDasturRu: [undefined],
      lavKar: [undefined],
      anyaKar: [undefined],
      rasidNo: [undefined],
      malpotKaryalaya: [undefined],
      doormukam: [undefined],
      paritMiti: [undefined],
      paritName: [undefined],
      paritPosition: [undefined],
      fatwalaMiti: [undefined],
      fatwalaName: [undefined],
      fatwalaPosition: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      rinBibaran: this.formBuilder.array([]),
      jillaName: [undefined],
      cityName: [undefined],
      wodaNum: [undefined],
      jillaName2: [undefined],
      witnessName: [undefined],
      witnessCitizenshipNo: [undefined],
      witnessCitizenshipIssueDate: [undefined],
      witnessCDOoffice: [undefined],
      witnessIssuedPlace: [undefined],
      witnessMunicipality: [undefined],
      witnessWardNo: [undefined],
      witnessName1: [undefined],
      witnessCitizenshipNo1: [undefined],
      witnessCitizenshipIssueDate1: [undefined],
      witnessCDOoffice1: [undefined],
      witnessIssuedPlace1: [undefined],
      witnessMunicipality1: [undefined],
      panNo: [undefined],
      dartaDate4: [undefined],
      witnessWardNo1 : [undefined]

    });
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }


  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWadNo: [undefined]
    });
  }


  addRinBibaran(): void {
    const formArray = this.form.get('rinBibaran') as FormArray;
    formArray.push(this.rinBibaranFormGroup());
  }

  removeRinBibaran(index: number): void {
    const formArray = this.form.get('rinBibaran') as FormArray;
    formArray.removeAt(index);
  }
  rinBibaranFormGroup(): FormGroup {
    return this.formBuilder.group({
      creditorNameNepali2: [undefined],
      creditorNameEnglish2: [undefined],
      dateOfBirth1: [undefined],
      address1: [undefined],
      sex1: [undefined],
      creditorCitizenshipNo1: [undefined],
      creditorCitizenshipIssueDate1: [undefined],
      creditorCitizenshipIssueOffice1: [undefined],
      creditorCitizenshipOfficeAddress1: [undefined],
      creditorMobileNo1: [undefined],
      creditorFatherName1: [undefined],
      creditorMotherName1: [undefined],
      creditorSpouse1: [undefined],
      creditorGrandFatherName1: [undefined],
      creditorGrandMotherName1: [undefined],
    });

  }
  setRinBibaran(data) {
    const formArray = this.form.get('rinBibaran') as FormArray;
    if (data.length === 0) {
      this.addRinBibaran();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        creditorNameNepali2: [value.creditorNameNepali2],
        creditorNameEnglish2: [value.creditorNameEnglish2],
        dateOfBirth1: [value.dateOfBirth1],
        address1: [value.address1],
        sex1: [value.sex1],
        creditorCitizenshipNo1: [value.creditorCitizenshipNo1],
        creditorCitizenshipIssueDate1: [value.creditorCitizenshipIssueDate1],
        creditorCitizenshipIssueOffice1: [value.creditorCitizenshipIssueOffice1],
        creditorCitizenshipOfficeAddress1: [value.creditorCitizenshipOfficeAddress1],
        creditorMobileNo1: [value.creditorMobileNo1],
        creditorFatherName1: [value.creditorFatherName1],
        creditorMotherName1: [value.creditorMotherName1],
        creditorSpouse1: [value.creditorSpouse1],
        creditorGrandFatherName1: [value.creditorGrandFatherName1],
        creditorGrandMotherName1: [value.creditorGrandMotherName1],
      }));
    });
  }

}

