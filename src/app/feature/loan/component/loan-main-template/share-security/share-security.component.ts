import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepseService} from '../../../../admin/component/nepse/nepse.service';
import {Nepse} from '../../../../admin/modal/nepse';
import {ShareType} from '../../../model/ShareType';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';
import {CustomerShareData} from '../../../../admin/modal/CustomerShareData';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';

@Component({
  selector: 'app-share-security',
  templateUrl: './share-security.component.html',
  styleUrls: ['./share-security.component.scss']
})
export class ShareSecurityComponent implements OnInit {
  @Input()
  shareSecurity: ShareSecurity;
    securityOffered: string;
  shareSecurityForm: FormGroup;
  shareType = ShareType;
  shareDataForEdit = [];
    customerShareData: Array<CustomerShareData> = new Array<CustomerShareData>();
    activeNepseMaster: NepseMaster = new NepseMaster();
    savedActiveNepseMaster: NepseMaster = new NepseMaster();
  nepseList: Array<Nepse> = new Array<Nepse>();
  companySelectMessage: Map<string, string> = new Map<string, string>();
  shareSecurityData: ShareSecurity = new ShareSecurity();
  search: any = {
    status: 'ACTIVE',
    shareType: undefined,
    companyName: undefined
  };

  constructor(
      private formBuilder: FormBuilder,
      private  shareService: NepseService) {
  }

  ngOnInit() {
    this.buildForm();
    this.findActiveShareRate();
    if (this.shareSecurity !== undefined) {
        const shareSecurityAllData = JSON.parse(this.shareSecurity.data);
        this.shareSecurityData.id = this.shareSecurity.id;
        this.shareSecurityData.version = this.shareSecurity.version;
        this.shareDataForEdit = shareSecurityAllData.shareField;
        this.customerShareData = this.shareSecurity.customerShareData;
        this.securityOffered = shareSecurityAllData.securityOffered;
        this.savedActiveNepseMaster = shareSecurityAllData.loanShareRate;
      this.setShareData();
    } else {
      this.addShareList();
    }
    this.getNepseData();
  }

  onSubmit() {
      const mergedData = {
          shareField: this.shareSecurityForm.value.shareField,
        securityOffered: this.securityOffered,
        loanShareRate: this.savedActiveNepseMaster
      };
      this.shareSecurityData.data = JSON.stringify(mergedData);
      this.shareSecurityData.customerShareData = this.patchFormDataForSave();
  }

  buildForm() {
    this.shareSecurityForm = this.formBuilder.group({shareField: this.formBuilder.array([])});
  }

  addShareList() {
    (this.shareSecurityForm.get('shareField') as FormArray).push(
        this.formBuilder.group(
            {
              companyName: [undefined, Validators.required],
              shareType: [undefined, Validators.required],
              totalShareUnit: [0, Validators.required],
              amountPerUnit: [0, Validators.required],
              total: [0, Validators.required],
              consideredValue: [0, Validators.required],
              companyCode: [undefined]
            }
        )
    );
  }

  setShareData() {
      let index = 0;
    this.shareDataForEdit.forEach((data) => {
      (this.shareSecurityForm.get('shareField') as FormArray).push(
          this.formBuilder.group({
              id: [this.customerShareData[index].id],
              version: [this.customerShareData[index].version],
                companyName: [data.companyName],
                shareType: [data.shareType],
                totalShareUnit: [data.totalShareUnit],
            amountPerUnit: [data.amountPerUnit],
                total: [data.total],
            companyCode: [data.companyCode],
            consideredValue: [data.consideredValue]
              }
          )
      );
        index += 1;
    });
  }

  removeShareList(index) {
    (this.shareSecurityForm.get('shareField') as FormArray).removeAt(index);
  }

  getNepseData() {
    this.shareService.findAllNepseCompanyData(this.search).subscribe((list) => {
      this.nepseList = list.detail;
    });
  }

  setShareValueByCompany(index) {
    const companyName = ((this.shareSecurityForm.get('shareField') as FormArray).at(index).get('companyName').value);
    const totalShareUnit = (this.shareSecurityForm.get('shareField') as FormArray).at(index).get('totalShareUnit').value;
    const matchedNepse = this.nepseList.filter(nepse => (nepse.companyName === companyName));
    if (matchedNepse) {
      (this.shareSecurityForm.get('shareField') as FormArray).at(index).patchValue({
        shareType : matchedNepse[0].shareType,
        companyCode: matchedNepse[0].companyCode,
        amountPerUnit: matchedNepse[0].amountPerUnit,
        total: totalShareUnit ? totalShareUnit * Number(matchedNepse[0].amountPerUnit) : 0,
        consideredValue: totalShareUnit ? this.calculateConsideredValue(index , matchedNepse[0].shareType) : 0
      });
    }

  }

  calculateShareFieldsValues(totalShareUnit , index) {
    const amountPerUnit = (this.shareSecurityForm.get('shareField') as FormArray).at(index).get('amountPerUnit').value;
    const shareType = (this.shareSecurityForm.get('shareField') as FormArray).at(index).get('shareType').value;
    if (totalShareUnit) {
      (this.shareSecurityForm.get('shareField') as FormArray).at(index).patchValue({
        total: totalShareUnit * amountPerUnit,
        consideredValue: this.calculateConsideredValue(index , shareType)
      });
    }
  }

    patchFormDataForSave() {
        const currentFormArray: FormArray = (this.shareSecurityForm.get('shareField') as FormArray);
        const customerShareDataList: Array<CustomerShareData> = [];
        for (const c of currentFormArray.controls) {
            customerShareDataList.push(c.value);
        }
        return customerShareDataList;
    }
  findActiveShareRate() {
    this.shareService.getActiveShare().subscribe(value => {
      this.activeNepseMaster = value.detail;
      if (this.shareSecurity === undefined) {
        this.savedActiveNepseMaster = value.detail;
      }
    });
  }

  calculateConsideredValue(index , shareType) {
    const activeNepse = shareType.toString() === ShareType.PROMOTER.toString() ?
        this.savedActiveNepseMaster.promoter : this.savedActiveNepseMaster.ordinary;
    const amountPerUnit = (this.shareSecurityForm.get('shareField') as FormArray).at(index).get('amountPerUnit').value;
    const totalShareUnit = (this.shareSecurityForm.get('shareField') as FormArray).at(index).get('totalShareUnit').value;
    return ((totalShareUnit * amountPerUnit) / 100) * activeNepse;
  }
}
