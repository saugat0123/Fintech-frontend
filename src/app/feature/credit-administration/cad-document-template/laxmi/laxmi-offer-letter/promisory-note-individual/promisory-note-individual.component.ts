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
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';

@Component({
  selector: 'app-promisory-note-individual',
  templateUrl: './promisory-note-individual.component.html',
  styleUrls: ['./promisory-note-individual.component.scss']
})
export class PromisoryNoteIndividualComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private nepaliToEnglishPipe: NepaliToEngNumberPipe,
      private nepaliNumber: NepaliNumberPipe,
  ) { }
  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  form: FormGroup;
  spinner = false;
  initialInfoPrint;
  cadCheckListEnum = CadCheckListTemplateEnum;
  nepaliData;
  amount;
  customerInfo;
  ngOnInit() {
  this.buildForm();
    this.amount = this.cadData.assignedLoan[0].proposal.proposedLimit;
    this.customerInfo = this.cadData.assignedLoan[0].customerInfo;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
          if (!ObjectUtil.isEmpty(JSON.parse(singleCadFile.initialInformation).rupees)){
            this.amount = JSON.parse(singleCadFile.initialInformation).rupees;
          }
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.checkInitialData();
  }
  checkInitialData() {
    if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
      this.form.patchValue(JSON.parse(this.initialInfoPrint));
      // this.setSakshis(JSON.parse(this.initialInfoPrint).sakshi);
      if (JSON.parse(this.initialInfoPrint).sakshi >= 2) {
        const data = JSON.parse(this.initialInfoPrint).sakshi[0];
        const datas = JSON.parse(this.initialInfoPrint).sakshi[1];
        this.form.patchValue({
          sakshiName: data.name,
          age: data.age,
          wardNum: data.wardNum,
          district: data.district,
          municipality: data.municipality,
          sakshiNameTwo: datas.name,
          ageTwo: datas.age,
          wardNumTwo: datas.wardNum,
          districtTwo: datas.district,
          municipalityTwo: datas.municipality
        });
      }
      this.form.patchValue({
        amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount))
      });
    } else {
      this.fillNepaliData();
      this.form.patchValue({
        rupees: this.nepaliNumber.transform(this.amount, 'preeti'),
        amount: this.nepaliCurrencyWordPipe.transform(this.amount)
      });
    }
  }
  con(e) {
    this.form.patchValue({
      amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
    });
  }
  buildForm() {
    this.form = this.formBuilder.group({
      branch: [undefined],
      rupees: [undefined],
      amount: [undefined],
      name: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      husbandName: [undefined],
      address: [undefined],
      personalDetails: [undefined],
      role: [undefined],
      roleName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      roj: [undefined],
      district: [undefined],
      municipality: [undefined],
      wardNum: [undefined],
      age: [undefined],
      sakshiName: [undefined],
      districtTwo: [undefined],
      municipalityTwo: [undefined],
      wardNumTwo: [undefined],
      ageTwo: [undefined],
      sakshiNameTwo: [undefined],
    });
  }

  fillNepaliData() {
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      this.form.patchValue({
        grandFatherName: this.nepaliData.grandFatherName,
        fatherName: this.nepaliData.fatherName,
        name: this.nepaliData.name,
        husbandName: this.nepaliData.husbandName,
        address: `${this.nepaliData.permanentDistrict} ,${this.nepaliData.permanentMunicipality}, ${this.nepaliData.permanentWard}`,
        personalDetails: `${this.nepaliNumber.transform(this.customerInfo.citizenshipNumber, 'preeti')} ,${this.nepaliData.citizenshipIssueDate}, ${this.nepaliData.citizenshipIssueDistrict}`,
        rupees: this.nepaliNumber.transform(this.amount, 'preeti'),
        amount: this.nepaliCurrencyWordPipe.transform(this.amount)
      });
    }
  }
  submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
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

  addSakshi() {
    (this.form.get('sakshi') as FormArray).push(
        this.formBuilder.group({
          district: [undefined],
          municipality: [undefined],
          wardNum: [undefined],
          age: [undefined],
          name: [undefined]
        }));
  }

  removeSakshi(i) {
    (this.form.get('sakshi') as FormArray).removeAt(i);
  }
  setSakshis(data) {
    const formArray = this.form.get('sakshi') as FormArray;
    if (data.length === 0 || ObjectUtil.isEmpty(data)) {
      this.addSakshi();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        district: [value.district],
        municipality: [value.municipality],
        wardNum: [value.wardNum],
        age: [value.age],
        name: [value.name],
      }));
    });
  }
}
