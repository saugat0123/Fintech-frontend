import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Scheme} from '../../modal/scheme';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Branch} from '../../modal/branch';

@Component({
  selector: 'app-scheme-select',
  templateUrl: './scheme-select.component.html',
  styleUrls: ['./scheme-select.component.css']
})
export class SchemeSelectComponent implements OnInit {
  applicantForm: FormGroup;
  schemeList: Array<Scheme>;
  branchList: Array<Branch>;
  scheme: Scheme = new Scheme();
  currentApi: string;

  constructor( private formBuilder: FormBuilder,
               private commonService: CommonService,
               private dataService: CommonDataService,
               private router: Router ) {

    this.applicantForm = this.formBuilder.group({

      fullName: [ undefined, Validators.required ],
      age: [ undefined, Validators.required ],
      nationality: [ undefined, Validators.required ],
      phoneNumber: [ undefined, Validators.required ],
      requestAmount: [ undefined, Validators.required ],
      scheme: [ undefined, Validators.required ],
      branch: [ undefined]
    });
  }

  ngOnInit() {
    this.currentApi = 'v1/companies/3/schemes';
    this.getSchemeList();

  }

  getSchemeList() {
    this.commonService.getByGetAllPageable(this.currentApi, 1, 10).subscribe((response: any) => {
      this.schemeList = response.detail.content;
      console.log(this.schemeList);
    });
  }

  onSubmit() {
    this.scheme.id = this.applicantForm.get('scheme').value;
    this.dataService.setSchemeID(this.scheme.id);
    this.router.navigate(['customer/schemequestion']);
  }

}
