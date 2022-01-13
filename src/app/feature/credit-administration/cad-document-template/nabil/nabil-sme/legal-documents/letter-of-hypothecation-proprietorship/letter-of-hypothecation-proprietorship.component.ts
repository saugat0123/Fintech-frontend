import { Component, OnInit, Input } from '@angular/core';
import { CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ObjectUtil} from "../../../../../../../@core/utils/ObjectUtil";
import {CadFile} from "../../../../../model/CadFile";
import {Document} from "../../../../../../admin/modal/document";
import {Alert, AlertType} from "../../../../../../../@theme/model/Alert";
import {CreditAdministrationService} from "../../../../../service/credit-administration.service";
import {ToastService} from "../../../../../../../@core/utils";
import {NbDialogRef} from "@nebular/theme";
import {CadOfferLetterModalComponent} from "../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component";
import {RouterUtilsService} from "../../../../../utils/router-utils.service";

@Component({
  selector: 'app-letter-of-hypothecation-proprietorship',
  templateUrl: './letter-of-hypothecation-proprietorship.component.html',
  styleUrls: ['./letter-of-hypothecation-proprietorship.component.scss']
})
export class LetterOfHypothecationProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfHypothecationProprietor: FormGroup;
  loanHolderNepData: any;
  offerDocumentDetails: any;
  freeText;
  spinner = false;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.loadData();
    this.buildForm();
  }

  loadData() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanHolderNepData = this.cadData.loanHolder.nepData
          ? JSON.parse(this.cadData.loanHolder.nepData)
          : this.cadData.loanHolder.nepData;
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList) && this.cadData.offerDocumentList.length !== 0) {
        this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
    }
    if (!ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.freeText = JSON.parse(singleCadFile.supportedInformation);
        }
      });
    }
  }
  
  buildForm() {
    this.letterOfHypothecationProprietor = this.formBuilder.group({
      branch: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      districtOfFirm: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
      vdcMunicipality: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
      wardNumber: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      streetNumber: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
      borrowerName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],

      sakshiDistrict1: [this.freeText ? this.freeText.sakshiDistrict1 : ''],
      sakshiDistrict2: [this.freeText ? this.freeText.sakshiDistrict2 : ''],
      sakshiMunicipality1: [this.freeText ? this.freeText.sakshiMunicipality1 : ''],
      sakshiMunicipality2: [this.freeText ? this.freeText.sakshiMunicipality2 : ''],
      sakshiAge1: [this.freeText ? this.freeText.sakshiAge1 : ''],
      sakshiAge2: [this.freeText ? this.freeText.sakshiAge2 : ''],
      sakshiWard1: [this.freeText ? this.freeText.sakshiWard1 : ''],
      sakshiWard2: [this.freeText ? this.freeText.sakshiWard2 : ''],
      sakshiName1: [this.freeText ? this.freeText.sakshiName1 : ''],
      sakshiName2: [this.freeText ? this.freeText.sakshiName2 : ''],
      nameOfBankStaff: [this.freeText ? this.freeText.nameOfBankStaff : ''],
    })
  }

  setFreeText() {
    const free = {
      sakshiDistrict1: this.letterOfHypothecationProprietor.get('sakshiDistrict1').value ? this.letterOfHypothecationProprietor.get('sakshiDistrict1').value : '',
      sakshiDistrict2: this.letterOfHypothecationProprietor.get('sakshiDistrict2').value ? this.letterOfHypothecationProprietor.get('sakshiDistrict2').value : '',
      sakshiMunicipality1: this.letterOfHypothecationProprietor.get('sakshiMunicipality1').value ? this.letterOfHypothecationProprietor.get('sakshiMunicipality1').value : '',
      sakshiMunicipality2: this.letterOfHypothecationProprietor.get('sakshiMunicipality2').value ? this.letterOfHypothecationProprietor.get('sakshiMunicipality2').value : '',
      sakshiAge1: this.letterOfHypothecationProprietor.get('sakshiAge1').value ? this.letterOfHypothecationProprietor.get('sakshiAge1').value : '',
      sakshiAge2: this.letterOfHypothecationProprietor.get('sakshiAge2').value ? this.letterOfHypothecationProprietor.get('sakshiAge2').value : '',
      sakshiWard1: this.letterOfHypothecationProprietor.get('sakshiWard1').value ? this.letterOfHypothecationProprietor.get('sakshiWard1').value : '',
      sakshiWard2: this.letterOfHypothecationProprietor.get('sakshiWard2').value ? this.letterOfHypothecationProprietor.get('sakshiWard2').value : '',
      sakshiName1: this.letterOfHypothecationProprietor.get('sakshiName1').value ? this.letterOfHypothecationProprietor.get('sakshiName1').value : '',
      sakshiName2: this.letterOfHypothecationProprietor.get('sakshiName2').value ? this.letterOfHypothecationProprietor.get('sakshiName2').value : '',
      nameOfBankStaff: this.letterOfHypothecationProprietor.get('nameOfBankStaff').value ? this.letterOfHypothecationProprietor.get('nameOfBankStaff').value : '',
    }
    return JSON.stringify(free);
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
        // cadFile.initialInformation = JSON.stringify(this.letterOfHypothecationProprietor.value);
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfHypothecationProprietor.value);
      cadFile.supportedInformation = this.setFreeText();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
    });
  }

}
