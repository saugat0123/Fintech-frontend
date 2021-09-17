import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {RetailProfessionalLoanComponent} from '../../../mega-offer-letter-template/mega-offer-letter/retail-professional-loan/retail-professional-loan.component';

@Component({
  selector: 'app-educational-loan-template-data',
  templateUrl: './educational-loan-template-data.component.html',
  styleUrls: ['./educational-loan-template-data.component.scss']
})
export class EducationalLoanTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  btnValue = false;
  selectedSecurityVal;
  selectedCountryVal;
  embassyName;

  constructor(
      private formBuilder: FormBuilder,
      private dialogService: NbDialogService,
      private modelService: NgbModal,
      private ngDialogRef: NbDialogRef<RetailProfessionalLoanComponent>
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      embassyName: [undefined],
      selectedCountry: [undefined],
      selectedSecurity: [undefined],
    });
  }

  submit() {
    console.log('Submitted Value ', this.form.value);
  }

  transferValue() {
    const country = this.form.get('selectedCountry').value;
    const security = this.form.get('selectedSecurity').value;

    if (!ObjectUtil.isEmpty(country) && !ObjectUtil.isEmpty(security)) {
      this.btnValue = true;
      this.selectedCountryVal = country;
      this.selectedSecurityVal = security;
      this.embassyName = this.form.get('embassyName').value;
    }
  }

  openModel(modalName) {
    this.dialogService.open(modalName);
  }

  // onClose() {
  //   this.modelService.dismissAll();
  // }
}
