import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Section1SmeSecurityComponent} from './sme-security-sections/section1-sme-security/section1-sme-security.component';
import {Section2SmeSecurityComponent} from './sme-security-sections/section2-sme-security/section2-sme-security.component';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-sme-security',
  templateUrl: './sme-security.component.html',
  styleUrls: ['./sme-security.component.scss']
})
export class SmeSecurityComponent implements OnInit {
  masterSecurityForm: FormGroup;
  securityData: any = {};
  @ViewChild('primarySecurity', {static: false})
  section1SmeSecurityComponent: Section1SmeSecurityComponent;
  @ViewChild('secondarySecurity', {static: false})
  section2SmeSecurityComponent: Section2SmeSecurityComponent;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.masterSecurityForm = this.formBuilder.group({
      primarySecurity: [undefined],
      secondarySecurity: [undefined],
    });
  }

  setSecurityData() {
    const tempPrimarySecurity = this.section1SmeSecurityComponent.section1SecurityForm.value;
    if (!ObjectUtil.isEmpty(tempPrimarySecurity)) {
      this.masterSecurityForm.get('primarySecurity').patchValue(tempPrimarySecurity.securityDetails);
    }
    const tempSecondarySecurity = this.section2SmeSecurityComponent.section2SecurityForm.value;
    if (!ObjectUtil.isEmpty(tempSecondarySecurity)) {
      this.masterSecurityForm.get('secondarySecurity').patchValue(tempSecondarySecurity.securityDetails);
    }
    return this.masterSecurityForm.value;
  }

}
