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

@Component({
  selector: 'app-promissory-note-guarantor',
  templateUrl: './promissory-note-guarantor.component.html',
  styleUrls: ['./promissory-note-guarantor.component.scss']
})
export class PromissoryNoteGuarantorComponent implements OnInit {
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
  loanCategory;

  constructor(private dialogRef: NbDialogRef<PromissoryNoteGuarantorComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
    this.buildForm();
    this.fillForm();
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          /*if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            this.setGuarantorDetails(initialInfo.guarantorDetails);
          }*/
          /*if (initialInfo.witnessDetails) {
            this.setWitnessDetails(initialInfo.witnessDetails);
          }*/
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.setGuarantorDetails(this.nepaliData.guarantorDetails);
    }

    this.form.patchValue({
      gender: this.nepaliData.gender ? this.nepaliData.gender : '',
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
      amount: [undefined],
      amountInWords: [undefined],
      name: [undefined],
      permanentVdcMun: [undefined],
      permanentWardNo: [undefined],
      parentsName: [undefined],
      grandParentsName: [undefined],
      husbandWifeName: [undefined],
      citizenshipNo: [undefined],
      temporaryVdcMun: [undefined],
      temporaryWardNo: [undefined],
      citizenshipIssueDate: [undefined],
      citizenshipIssueOffice: [undefined],
      permanentDistrict: [undefined],
      SabikVdcMun: [undefined],
      sabikWardNo: [undefined],
      temporaryDistrict: [undefined],
      financeDistrict: [undefined],
      financeVdcMun: [undefined],
      financeWardNo: [undefined],
      financeBranch: [undefined],
      sabikVdcMun: [undefined],
      age: [undefined],
      gender : [undefined],
      relationship: [undefined],
      date: [undefined],
      borrowerName: [undefined],
      borrowerPermanentDistrict: [undefined],
      borrowerPermanentMunicipality: [undefined],
      borrowerPermanentWardNo: [undefined],
      borrowerParentsName: [undefined],
      borrowerGrandParentsName: [undefined],
      borrowerHusbandWifeName: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerTempDistrict: [undefined],
      borrowerTempMunicipality: [undefined],
      borrowerTempWardNo: [undefined],
      borrowerCitizenshipIssueDate: [undefined],
      borrowerCdoOffice: [undefined],
      borrowerSabikVDC: [undefined],
      borrowerSabikWardNo: [undefined],

      guarantorName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenshipIssueDate: [undefined],
      guarantorCdoOffice: [undefined],
      guarantorPermanentDistrict: [undefined],
      guarantorPermanentMunicipality: [undefined],
      guarantorPermanentWardNo: [undefined],
      guarantorSabikVDC: [undefined],
      guarantorSabikWardNo: [undefined],
      guarantorTempDistrict: [undefined],
      guarantorTempMunicipality: [undefined],
      guarantorTempWardNo: [undefined],
      guarantorParentsName: [undefined],
      guarantorGrandParentsName: [undefined],
      guarantorHusbandWifeName: [undefined],

      IdentifiedGuarantorName: [undefined],
      IdentifiedHintNo: [undefined],
      branchName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      itiSambatTime: [undefined],
      itiSambatRojSubham: [undefined],
      witnessDetails: this.formBuilder.array([]),
      guarantorDetails: this.formBuilder.array([]),
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
      witnessWardNo1: [undefined]
    });
  }

  witnessFormGroup(): FormGroup {
    return this.formBuilder.group({
      witnessName: [undefined],
      witnessCitizenshipNo: [undefined],
      witnessCitizenshipIssueDate: [undefined],
      witnessCDOoffice: [undefined],
      witnessDistrict: [undefined],
      witnessPermanentMunicipality: [undefined],
      witnessPermanentWardNo: [undefined]
    });
  }

  addWitness(): void {
    const formArray = this.form.get('witnessDetails') as FormArray;
    formArray.push(this.witnessFormGroup());
  }

  removeWitness(index: number): void {
    const formArray = this.form.get('witnessDetails') as FormArray;
    formArray.removeAt(index);
  }

  setWitnessDetails(data) {
    const formArray = this.form.get('witnessDetails') as FormArray;
    if (data.length === 0) {
      this.addWitness();
      return;
    }

    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        witnessName: [value.name],
        witnessCitizenshipNo: [value.witnessCitizenshipNo],
        witnessCitizenshipIssueDate: [value.witnessCitizenshipIssueDate],
        witnessDistrict: [value.witnessDistrict],
        witnessCDOoffice: [value.witnessCDOoffice],
        witnessPermanentMunicipality: [value.witnessPermanentMunicipality],
        witnessPermanentWardNo: [value.witnessPermanentWardNo]
      }));
    });
  }


  setGuarantorDetails(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }
    const loanAmount = JSON.parse(this.cadData.nepData);
    data.forEach((value , i) => {
      if (this.loanCategory === 'INSTITUTION') {
        formArray.push(this.formBuilder.group({
          guarantorType: [!ObjectUtil.isEmpty(value.guarantorType) ? value.guarantorType : ''],
          guarantorName: [value.guarantorName ? value.guarantorName :
              (value.representativeNameGuarantor ? value.representativeNameGuarantor : '')],
          guarantorCitizenshipNo: [value.citizenNumber ? value.citizenNumber :
              (value.representativeCitizenshipNoGuarantor ? value.representativeCitizenshipNoGuarantor : '')],
          guarantorCitizenshipIssueDate: [value.issuedYear ? value.issuedYear :
              (value.representativeCitizenshipIssueDateGuarantor ? value.representativeCitizenshipIssueDateGuarantor : '')],
          guarantorCdoOffice: [value.issuedPlace ? value.issuedPlace :
              (value.representativeCitizenshipIssuingAuthorityGuarantor ? value.representativeCitizenshipIssuingAuthorityGuarantor : '')],
          guarantorPermanentDistrict: [!ObjectUtil.isEmpty(value.guarantorPermanentDistrict) ?
                value.guarantorPermanentDistrict.nepaliName :
                (value.representativePermanentDistrictGuarantor ? value.representativePermanentDistrictGuarantor : '')],
          guarantorPermanentMunicipality: [!ObjectUtil.isEmpty(value.guarantorPermanentMunicipality) ?
                value.guarantorPermanentMunicipality.nepaliName :
                (value.representativePermanentMunicipalityGuarantor ? value.representativePermanentMunicipalityGuarantor : '')],
          guarantorPermanentWardNo: [value.guarantorPermanentWard ? value.guarantorPermanentWard :
              (value.representativePermanentWardGuarantor ? value.representativePermanentWardGuarantor : '')],
          guarantorSabikVDC: [value.guarantorPermanentVdc ? value.guarantorPermanentVdc :
              (value.representativePermanentVdcGuarantor ? value.representativePermanentVdcGuarantor : '')],
          guarantorSabikWardNo: [value.guarantorPermanentVdcWard ? value.guarantorPermanentVdcWard :
              (value.representativePermanentVdcWardGuarantor ? value.representativePermanentVdcWardGuarantor : '')],
          guarantorTempDistrict: [!ObjectUtil.isEmpty(value.guarantorTemporaryDistrict) ?
                value.guarantorTemporaryDistrict.nepaliName :
              (value.representativeTemporaryDistrictGuarantor ? value.representativeTemporaryDistrictGuarantor : '')],
          guarantorTempMunicipality: [!ObjectUtil.isEmpty(value.guarantorTemporaryMunicipality) ?
                value.guarantorTemporaryMunicipality.nepaliName :
              (value.representativeTemporaryMunicipalityGuarantor ? value.representativeTemporaryMunicipalityGuarantor : '')],
          guarantorTempWardNo: [value.guarantorTemporaryWard ? value.guarantorTemporaryWard :
              (value.representativeTemporaryWardGuarantor ? value.representativeTemporaryWardGuarantor : '')],
          guarantorHusbandWifeName: [value.guarantorSpouseName ? value.guarantorSpouseName :
              (value.representativeHusbandWifeNameGuarantor ? value.representativeHusbandWifeNameGuarantor : '')],
          guarantorGrandParentsName: [value.guarantorGrandfatherName ? value.guarantorGrandfatherName :
              (value.representativeGrandFatherNameGuarantor ? value.representativeGrandFatherNameGuarantor : '')],
          guarantorParentsName: [value.guarantorFatherName ? value.guarantorFatherName :
              (value.representativeFatherNameGuarantor ? value.representativeFatherNameGuarantor : '')],
          gender: this.nepaliData.gender ? this.nepaliData.gender : '',
          witnessName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessName : '' : '' : ''],
          witnessCitizenshipNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessCitizenshipNo : '' : '' : ''],
          witnessCitizenshipIssueDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessCitizenshipIssueDate : '' : '' : ''],
          witnessCDOoffice: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessCDOoffice : '' : '' : ''],
          witnessIssuedPlace: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessIssuedPlace : '' : '' : ''],
          witnessMunicipality: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessMunicipality : '' : '' : ''],
          witnessWardNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessWardNo : '' : '' : ''],
          witnessName1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessName1 : '' : '' : ''],
          witnessCitizenshipNo1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessCitizenshipNo1 : '' : '' : ''],
          witnessCitizenshipIssueDate1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessCitizenshipIssueDate1 : '' : '' : ''],
          witnessCDOoffice1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessCDOoffice1 : '' : '' : ''],
          witnessIssuedPlace1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessIssuedPlace1 : '' : '' : ''],
          witnessMunicipality1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessMunicipality1 : '' : '' : ''],
          witnessWardNo1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].witnessWardNo1 : '' : '' : ''],
          IdentifiedGuarantorName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].IdentifiedGuarantorName : '' : '' : ''],
          IdentifiedHintNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].IdentifiedHintNo : '' : '' : ''],
          itiSambatYear: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatYear : '' : '' : ''],
          itiSambatMonth: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatMonth : '' : '' : '' ],
          itiSambatDay: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatDay : '' : '' : ''],
          itiSambatTime: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatTime : '' : '' : ''],
          itiSambatRojSubham: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].itiSambatRojSubham : '' : '' : ''],

          // for Institution
          MinistryOffice: this.nepaliData.ministryOfGovernmentOfNepal ? this.nepaliData.ministryOfGovernmentOfNepal : '',
          DepartmentName: this.nepaliData.department ? this.nepaliData.department : '',
          RegisterOffice: this.nepaliData.companyRegistrarOfficeDistrict ? this.nepaliData.companyRegistrarOfficeDistrict : '',
          Act: this.nepaliData.nameOfRegisteringAct ? this.nepaliData.nameOfRegisteringAct : '',
          UnderName: this.nepaliData.yearOfActEnactment ? this.nepaliData.yearOfActEnactment : '',
          UnderDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
          PraliNo: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
          ServiceOfficeName: this.nepaliData.taxPayerServiceOffice ? this.nepaliData.taxPayerServiceOffice : '',
          certificateNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
          CertifiedDistrict: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
          CertifiedMunicipality: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
          CertifiedWardNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
          CertifiedCompany: this.nepaliData.companyName ? this.nepaliData.companyName : '',
          bottomGrandfatherName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
          bottomFatherName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
          bottomHusbandName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
          bottomMotherName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].bottomMotherName : '' : '' : ''],
          address1:  [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
                      this.initialInfoPrint.guarantorDetails[i].address1 : '' : '' : ''],
          bottomDistrictName: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
          bottomMunicipalityName: this.nepaliData.representativePermanentMunicipality ?
              this.nepaliData.representativePermanentMunicipality : '',
          bottomWardNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
          bottomTempDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
          bottomTempMunicipality: this.nepaliData.representativeTemporaryMunicipality ?
              this.nepaliData.representativeTemporaryMunicipality : '',
          bottomTempWardNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
          bottomAge: this.nepaliData.borrowerAge ? this.nepaliData.borrowerAge : '',
          bottoCustomerName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
          bottoCustomerCizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
          bottomDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
          bottomCDOoffice: this.nepaliData.representativeCitizenshipIssuingAuthority ?
              this.nepaliData.representativeCitizenshipIssuingAuthority : '',
          bottomBranchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
          bottomAmount: !ObjectUtil.isEmpty(loanAmount) ? loanAmount.numberNepali : '',
          bottomAmountInWord: !ObjectUtil.isEmpty(loanAmount) ? loanAmount.nepaliWords : '',
        }));
      }
      if (this.loanCategory === 'INDIVIDUAL') {
        formArray.push(this.formBuilder.group({
          guarantorName: [value.guarantorName],
          guarantorCitizenshipNo: [value.citizenNumber],
          guarantorCitizenshipIssueDate: [value.issuedYear],
          guarantorCdoOffice: [value.issuedPlace],
          guarantorPermanentDistrict: [
            !ObjectUtil.isEmpty(value.guarantorPermanentDistrict) ?
                value.guarantorPermanentDistrict.nepaliName : ''
          ],
          guarantorPermanentMunicipality: [
            !ObjectUtil.isEmpty(value.guarantorPermanentMunicipality) ?
                value.guarantorPermanentMunicipality.nepaliName : ''
          ],
          guarantorPermanentWardNo: [value.guarantorPermanentWard],
          guarantorSabikVDC: [value.guarantorPermanentVdc],
          guarantorSabikWardNo: [value.guarantorPermanentVdcWard],
          guarantorTempDistrict: [
            !ObjectUtil.isEmpty(value.guarantorTemporaryDistrict) ?
                value.guarantorTemporaryDistrict.nepaliName : ''
          ],
          guarantorTempMunicipality: [
            !ObjectUtil.isEmpty(value.guarantorTemporaryMunicipality) ?
                value.guarantorTemporaryMunicipality.nepaliName : ''
          ],
          guarantorTempWardNo: [value.guarantorTemporaryWard],
          guarantorHusbandWifeName: [value.guarantorSpouseName],
          guarantorGrandParentsName: [value.guarantorGrandfatherName],
          guarantorParentsName: [value.guarantorFatherName],
          borrowerName: this.nepaliData.name ? this.nepaliData.name : '',
          borrowerPermanentMunicipality: !ObjectUtil.isEmpty(this.nepaliData.permanentMunicipalities) ?
              this.nepaliData.permanentMunicipalities.nepaliName : '',
          borrowerPermanentWardNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
          borrowerPermanentDistrict: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ? this.nepaliData.permanentDistrict.nepaliName : '',
          borrowerCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
          borrowerCitizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
          borrowerCdoOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
          borrowerParentsName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
          borrowerGrandParentsName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
          borrowerHusbandWifeName : this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
          borrowerTempMunicipality: !ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ?
              this.nepaliData.temporaryMunicipalities.nepaliName : '',
          borrowerTempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
          borrowerTempDistrict: !ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ? this.nepaliData.temporaryDistrict.nepaliName : '',
          age: this.nepaliData.age ? this.nepaliData.age : '',
          financeBranch : this.nepaliData.branchName ? this.nepaliData.branchName : '',
          amount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
          amountInWords: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
          gender: this.nepaliData.gender ? this.nepaliData.gender : '',
          witnessName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessName : '' : '' : ''],
          witnessCitizenshipNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessCitizenshipNo : '' : '' : ''],
          witnessCitizenshipIssueDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessCitizenshipIssueDate : '' : '' : ''],
          witnessCDOoffice: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessCDOoffice : '' : '' : ''],
          witnessIssuedPlace: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessIssuedPlace : '' : '' : ''],
          witnessMunicipality: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessMunicipality : '' : '' : ''],
          witnessWardNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessWardNo : '' : '' : ''],
          witnessName1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessName1 : '' : '' : ''],
          witnessCitizenshipNo1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessCitizenshipNo1 : '' : '' : ''],
          witnessCitizenshipIssueDate1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessCitizenshipIssueDate1 : '' : '' : ''],
          witnessCDOoffice1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessCDOoffice1 : '' : '' : ''],
          witnessIssuedPlace1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessIssuedPlace1 : '' : '' : ''],
          witnessMunicipality1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessMunicipality1 : '' : '' : ''],
          witnessWardNo1: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].witnessWardNo1 : '' : '' : ''],
          IdentifiedGuarantorName: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].IdentifiedGuarantorName : '' : '' : ''],
          IdentifiedHintNo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].IdentifiedHintNo : '' : '' : ''],
          itiSambatYear: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].itiSambatYear : '' : '' : ''],
          itiSambatMonth: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].itiSambatMonth : '' : '' : '' ],
          itiSambatDay: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].itiSambatDay : '' : '' : ''],
          itiSambatTime: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].itiSambatTime : '' : '' : ''],
          itiSambatRojSubham: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.guarantorDetails[i]) ?
              this.initialInfoPrint.guarantorDetails[i].itiSambatRojSubham : '' : '' : ''],
        }));
      }
    });
  }

  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  /*removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }*/


  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      guarantorType: [undefined],
      guarantorName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenshipIssueDate: [undefined],
      guarantorCdoOffice: [undefined],
      guarantorPermanentDistrict: [undefined],
      guarantorPermanentMunicipality: [undefined],
      guarantorPermanentWardNo: [undefined],
      guarantorSabikVDC: [undefined],
      guarantorSabikWardNo: [undefined],
      guarantorTempDistrict: [undefined],
      guarantorTempMunicipality: [undefined],
      guarantorTempWardNo: [undefined],
      guarantorHusbandWifeName: [undefined],
      guarantorGrandParentsName: [undefined],
      guarantorParentsName: [undefined],
      borrowerName: [undefined],
      borrowerPermanentMunicipality: [undefined],
      borrowerPermanentWardNo: [undefined],
      borrowerPermanentDistrict: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerCitizenshipIssueDate: [undefined],
      borrowerCdoOffice: [undefined],
      borrowerParentsName: [undefined],
      borrowerGrandParentsName: [undefined],
      borrowerHusbandWifeName : [undefined],
      borrowerTempMunicipality: [undefined],
      borrowerTempWardNo: [undefined],
      borrowerTempDistrict: [undefined],
      age: [undefined],
      financeBranch : [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      gender: [undefined],
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
      witnessWardNo1: [undefined],
      IdentifiedGuarantorName: [undefined],
      IdentifiedHintNo: [undefined],
      branchName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      itiSambatTime: [undefined],
      itiSambatRojSubham: [undefined],

      // For Institution
      MinistryOffice: [undefined],
      DepartmentName: [undefined],
      RegisterOffice: [undefined],
      Act: [undefined],
      UnderName: [undefined],
      UnderDate: [undefined],
      PraliNo: [undefined],
      ServiceOfficeName: [undefined],
      CertifiedCompany: [undefined],
      certificateNo: [undefined],
      CertifiedDistrict: [undefined],
      CertifiedMunicipality: [undefined],
      CertifiedWardNo: [undefined],
      bottomGrandfatherName: [undefined],
      bottomGrandMotherName: [undefined],
      bottomFatherName: [undefined],
      bottomMotherName: [undefined],
      bottomHusbandName: [undefined],
      bottomDistrictName: [undefined],
      bottomMunicipalityName: [undefined],
      bottomWardNo: [undefined],
      address1: [undefined],
      bottomTempDistrict: [undefined],
      bottomTempMunicipality: [undefined],
      bottomTempWardNo: [undefined],
      bottomAge: [undefined],
      bottoCustomerName: [undefined],
      bottoCustomerCizenshipNo: [undefined],
      bottomDate: [undefined],
      bottomCDOoffice: [undefined],
      bottomBranchName: [undefined],
      bottomAmount: [undefined],
      bottomAmountInWord: [undefined],
    });
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
}
