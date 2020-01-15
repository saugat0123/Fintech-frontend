import {Component, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepseService} from '../../../../admin/component/nepse/nepse.service';
import {Nepse} from '../../../../admin/modal/nepse';
import {ShareType} from '../../../model/ShareType';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';
import {CustomerShareData} from '../../../../admin/modal/CustomerShareData';

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
    if (this.shareSecurity !== undefined) {
     const shareSecurityAllData = JSON.parse(this.shareSecurity.data);
      this.shareSecurityData.id = this.shareSecurity.id;
      this.shareSecurityData.version = this.shareSecurity.version;
      this.shareDataForEdit = shareSecurityAllData.shareField;
      this.customerShareData = this.shareSecurity.customerShareData;
      this.securityOffered = shareSecurityAllData.securityDescription;
      this.setShareData();
    } else {
      this.addShareList();
    }this.getNepseData();
  }

  onSubmit() {
    const mergedData = {
      shareField: this.shareSecurityForm.value.shareField,
      securityDescription: this.securityOffered,
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
              shareRate: [0, Validators.required],
              total: [0, Validators.required]
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
                shareRate: [data.shareRate],
                total: [data.total]
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
  findShareValue(index) {
    const shareType = (this.shareSecurityForm.get('shareField') as FormArray).at(index).get('shareType').value;
    const companyName = ((this.shareSecurityForm.get('shareField') as FormArray).at(index).get('companyName').value);
    const totalShareUnit = (this.shareSecurityForm.get('shareField') as FormArray).at(index).get('totalShareUnit').value;
    if (shareType && companyName) {
      const matchedNepse = this.nepseList.filter(nepse => {
        return (nepse.companyName === companyName) && (nepse.shareType === ShareType[shareType].toString());
      });
      if (matchedNepse.length > 0) {
        this.companySelectMessage.set(index.toString() , '');
      (this.shareSecurityForm.get('shareField') as FormArray).at(index).patchValue({
          shareRate:  matchedNepse[0].amountPerUnit ,
          total: totalShareUnit * Number(matchedNepse[0].amountPerUnit)
      });
      } else {
        (this.shareSecurityForm.get('shareField') as FormArray).at(index).patchValue({
          shareRate: 0,
          total: 0
        });
      this.companySelectMessage.set(index.toString() , shareType.toString().toLowerCase()
          + ' ' + 'share rate not added of' + ' ' + companyName + '!');
      }
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
}
