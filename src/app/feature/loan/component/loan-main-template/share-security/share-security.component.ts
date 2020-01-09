import {Component, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepseService} from '../../../../admin/component/nepse/nepse.service';
import {Nepse} from '../../../../admin/modal/nepse';
import {ShareType} from '../../../model/ShareType';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';

@Component({
  selector: 'app-share-security',
  templateUrl: './share-security.component.html',
  styleUrls: ['./share-security.component.scss']
})
export class ShareSecurityComponent implements OnInit {
  @Input()
  shareSecurity: ShareSecurity;
  shareSecurityForm: FormGroup;
  currentData;
  shareType = ShareType;
  nepseList: Array<Nepse> = new Array<Nepse>();
  companySelectMessage: string ;
  nepse: Nepse = new Nepse();
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
      this.currentData = JSON.stringify(this.shareSecurity.data);
      this.currentData.forEach((value) => {
        this.patchShareData(value);
      });
    } else {
      this.addShareList();
    }
    console.log(this.getNepseData());
  }

  onSubmit() {
    this.shareSecurity = this.shareSecurityForm.value;
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
    console.log(this.shareSecurityForm.get('shareField').value);
  }

  patchShareData(data) {
    (this.shareSecurityForm.get('shareField') as FormArray).push(
        this.formBuilder.group({
              companyName: [data.companyName],
              shareType: [data.shareType],
          totalShareUnit: [data.totalShareUnit],
              shareRate: [data.shareRate],
              total: [data.total]
            }
        )
    );
  }

  removeShareList(index) {
    (this.shareSecurityForm.get('shareField') as FormArray).removeAt(index);
  }

  getNepseData() {
    this.shareService.findAllNepseCompanyData(this.search).subscribe((list) => {
      this.nepseList = list.detail;
      console.log(this.nepseList);
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
        this.companySelectMessage = '';
   console.log(matchedNepse, matchedNepse[0].amountPerUnit);
      (this.shareSecurityForm.get('shareField') as FormArray).at(index).patchValue({
          shareRate:  matchedNepse[0].amountPerUnit ,
          total: totalShareUnit * Number(matchedNepse[0].amountPerUnit)
      });
      } else {
        this.companySelectMessage = shareType.toString().toLowerCase() + ' ' + 'share rate not added of' + ' ' + companyName + '!';
      }
    }
  }
}
