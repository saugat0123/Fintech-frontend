import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OfferDocument} from '../../../../model/OfferDocument';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {RetailPrimarySecurityComponent} from './retail-primary-security/retail-primary-security.component';
import {RetailSecondarySecurityComponent} from './retail-secondary-security/retail-secondary-security.component';

@Component({
  selector: 'app-retail-master-security',
  templateUrl: './retail-master-security.component.html',
  styleUrls: ['./retail-master-security.component.scss']
})
export class RetailMasterSecurityComponent implements OnInit {
  @Input() isEdit = false;
  masterSecurityForm: FormGroup;
  securityData: any = {};
  @ViewChild('primarySecurity', {static: false})
  retailPrimarySecurity: RetailPrimarySecurityComponent;
  @ViewChild('secondarySecurity', {static: false})
  retailSecondarySecurity: RetailSecondarySecurityComponent;
  @Input() offerDocumentList: Array<OfferDocument>;
  initialInformation: any;
  parseSecurityData: any;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (this.offerDocumentList.length > 0 && this.isEdit) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
        this.parseSecurityData = this.initialInformation.securities;
      });
    }
  }

  buildForm() {
    this.masterSecurityForm = this.formBuilder.group({
      primarySecurity: [undefined],
      secondarySecurity: [undefined],
    });
  }

  setSecurityData() {
    const tempPrimarySecurity = this.retailPrimarySecurity.retailPrimarySecurityForm.value;
    if (!ObjectUtil.isEmpty(tempPrimarySecurity)) {
      this.masterSecurityForm.get('primarySecurity').patchValue(tempPrimarySecurity.securityDetails);
    }
    const tempSecondarySecurity = this.retailSecondarySecurity.retailSecondarySecurityForm.value;
    if (!ObjectUtil.isEmpty(tempSecondarySecurity)) {
      this.masterSecurityForm.get('secondarySecurity').patchValue(tempSecondarySecurity.securityDetails);
    }
    return this.masterSecurityForm.value;
  }

}
