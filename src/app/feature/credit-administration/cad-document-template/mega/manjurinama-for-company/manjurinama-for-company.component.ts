import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';

@Component({
  selector: 'app-manjurinama-for-company',
  templateUrl: './manjurinama-for-company.component.html',
  styleUrls: ['./manjurinama-for-company.component.scss']
})
export class ManjurinamaForCompanyComponent implements OnInit {

  manjurimaCompany: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }
  ngOnInit(): void {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.manjurimaCompany.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm(){
    this.manjurimaCompany = this.formBuilder.group({
      grandFatherName: [undefined],
      fatherName: [undefined],
      husbandName: [undefined],
      perDistrictName: [undefined],
      perMunicipality: [undefined],
      perWardNo: [undefined],
      tempAddProvinceName: [undefined],
      tempAddDistrictName: [undefined],
      tempAddMunicipalityOrVdc: [undefined],
      tempAddWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      landRevenueOfficeBranch: [undefined],
      governmentMinistryName: [undefined],
      govOfficeDepName: [undefined],
      govOfficeName: [undefined],
      officeRegNo: [undefined],
      registeredDate: [undefined],
      officeDistrict: [undefined],
      officeMunicipalityOrVdc: [undefined],
      officeWardNo: [undefined],
      businessName: [undefined],
      snNo: [undefined],
      landOwnerName: [undefined],
      propertyDistrict: [undefined],
      propertyMunicipalityOrVdc: [undefined],
      propertyWardNo: [undefined],
      propertyKeyNo: [undefined],
      propertyArea: [undefined],
      nameOfTheHeir: [undefined],
      heirCitizenshipNo: [undefined],
      date: [undefined],
      heirDistrictName: [undefined],
      heirAddress: [undefined],
      relationship: [undefined],
      nameOfTheHeir1: [undefined],
      heirCitizenshipNo1: [undefined],
      date1: [undefined],
      heirDistrictName1: [undefined],
      heirAddress1: [undefined],
      relationship1: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDay: [undefined],
      docWrittenWeek: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipalityOrVdc1: [undefined],
      witnessWardNo1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipalityOrVdc2: [undefined],
      witnessWardNo2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
    });
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.manjurimaCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.manjurimaCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.manjurimaCompany.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
    });
    console.log(this.manjurimaCompany.value);
  }

}
