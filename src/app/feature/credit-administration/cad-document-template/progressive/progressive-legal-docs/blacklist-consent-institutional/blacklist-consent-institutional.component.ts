import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {CustomerApprovedLoanCadDocumentation} from "../../../../model/customerApprovedLoanCadDocumentation";
import {ProgressiveLegalDocConst} from "../progressive-legal-doc-const";
import {CustomerOfferLetter} from "../../../../../loan/model/customer-offer-letter";
import {OfferDocument} from "../../../../model/OfferDocument";
import {NbDialogRef} from "@nebular/theme";
import {NepaliToEngNumberPipe} from "../../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {CreditAdministrationService} from "../../../../service/credit-administration.service";
import {ToastService} from "../../../../../../@core/utils";
import {RouterUtilsService} from "../../../../utils/router-utils.service";
import {CustomerOfferLetterService} from "../../../../../loan/service/customer-offer-letter.service";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {CadFile} from "../../../../model/CadFile";
import {Document} from "../../../../../admin/modal/document";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";

@Component({
  selector: 'app-blacklist-consent-institutional',
  templateUrl: './blacklist-consent-institutional.component.html',
  styleUrls: ['./blacklist-consent-institutional.component.scss']
})
export class BlacklistConsentInstitutionalComponent implements OnInit {
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

  constructor(private dialogRef: NbDialogRef<BlacklistConsentInstitutionalComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService) {
  }

  ngOnInit() {
    this.buildForm()
    this.fillForm()
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.form.patchValue(this.initialInfoPrint);
          if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            this.setGuarantorDetails(initialInfo.guarantorDetails);
          }
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
      });
    }


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


  submit(): void {
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


  buildForm(){

    this.form = this.formBuilder.group({
      sincerlyName:[undefined],
      sincerlyCitizenshipNo:[undefined],
      sincerlyDate:[undefined],
      sincerlyCDOoffice:[undefined],
      sincerlyRegNo:[undefined],
      regDate:[undefined],
      regKaryalaya:[undefined],
      sincerlyPermanentDistrict:[undefined],
      sincerlyPermanentMunicipality:[undefined],
      sincerlyPermanentWadNo:[undefined],
      sincerlyTemporaryDistrict:[undefined],
      sincerlyTemporaryVDCname:[undefined],
      sincerlyTemporaryWadNo:[undefined],
      sincerlyParentName:[undefined],
      sincerlyGrandParentName:[undefined],
      sincerlyLekhaNo:[undefined],
      sincerlyKarja:[undefined],
      jamanatName:[undefined],
      jamanatNPN:[undefined],
      jamanatDate:[undefined],
      jamanatJPK:[undefined],
      jamanatRegNo:[undefined],
      jamanatRegDate:[undefined],
      jamanatRegCDO:[undefined],
      jamanatPermanentAddress:[undefined],
      jamanatDistrict:[undefined],
      jamanatWadNo:[undefined],
      jamanatTemporaryAddress:[undefined],
      jamanatTemporaryDistrict:[undefined],
      jamanatTemporaryWadNo:[undefined],
      jamanatHusbandName:[undefined],
      jamanatSasuraName:[undefined],
      karmachari:[undefined],
      karmachariNo:[undefined],
      ItisambatYear: [undefined],
      ItisambatMonth: [undefined],
      ItisambatDay: [undefined],
      ItisambatTime: [undefined],
      ItisambatRojSubham: [undefined],
      sincerlyLekhaRs: [undefined],
      guarantorDetails: this.formBuilder.array([]),

    })

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

}
