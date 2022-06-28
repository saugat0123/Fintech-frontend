import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LegalStatus} from '../../../../../admin/modal/legal-status';
import {Capital} from '../../../../../admin/modal/capital';
import {Swot} from '../../../../../admin/modal/swot';
import {CompanyLocations} from '../../../../../admin/modal/companyLocations';
import {ManagementTeam} from '../../../../../admin/modal/management-team';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';
import {LoanDataService} from '../../../../../loan/service/loan-data.service';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../../../../loan/component/loan-form/service/loan-form.service';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {CompanyInfoService} from '../../../../../admin/service/company-info.service';
import {NbDialogRef} from '@nebular/theme';
import {CompanyFormComponent} from '../../../customer-form/company-form/company-form.component';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {DesignationList} from '../../../../../loan/model/designationList';

@Component({
  selector: 'app-edit-management-team',
  templateUrl: './edit-management-team.component.html',
  styleUrls: ['./edit-management-team.component.scss']
})
export class EditManagementTeamComponent implements OnInit {

  managementFormGroup: FormGroup;

  submitted = false;
    spinner = false;
    add = false;
  companyInfo: CompanyInfo;
  legalStatus: LegalStatus = new LegalStatus();
  capital: Capital = new Capital();
  swot: Swot = new Swot();
  locations: CompanyLocations = new CompanyLocations();
  managementTeamList: Array<ManagementTeam> = new Array<ManagementTeam>();
  designationList: DesignationList = new DesignationList();
  designation;

  constructor(
      private formBuilder: FormBuilder,
      private commonLocation: AddressService,
      private loanDataService: LoanDataService,
      private activatedRoute: ActivatedRoute,
      private loanFormService: LoanFormService,
      private toastService: ToastService,
      private companyInfoService: CompanyInfoService,
      protected ref: NbDialogRef<CompanyFormComponent>,
      protected dialogRef: NbDialogRef<EditManagementTeamComponent>
  ) {

  }

  get form() {
    return this.managementFormGroup.controls;
  }

  ngOnInit() {
    this.buildForm();
    this.designation = this.designationList.designation;

    if (ObjectUtil.isEmpty(this.companyInfo.managementTeamList)) {
      this.createManagementArray();

    } else {
      this.setManagement(this.companyInfo.managementTeamList);

    }

  }

  buildForm() {
    this.managementFormGroup = this.formBuilder.group({


      // managementTeams
      managementTeams: this.formBuilder.array([
      ]),

    });
  }


  createManagementArray() {
      (this.managementFormGroup.get('managementTeams') as FormArray).push(this.formBuilder.group({
        name: [undefined],
        designation: [undefined]
      }));
  }
  setManagement(currentData) {
    const managementData = (this.managementFormGroup.get('managementTeams') as FormArray);
    currentData.forEach((singleData, index) => {
      managementData.push(this.formBuilder.group({
        name: [ObjectUtil.setUndefinedIfNull(singleData.name)],
        designation: [ObjectUtil.setUndefinedIfNull(singleData.designation)],
        id: [ObjectUtil.setUndefinedIfNull(singleData.id)],
        version: [ObjectUtil.setUndefinedIfNull(singleData.version)],
      }));
    });
  }


  removeManagementTeam(index: number) {
    (<FormArray>this.managementFormGroup.get('managementTeams')).removeAt(index);
  }

  addManagement() {
    if (this.managementFormGroup.invalid) {
      this.add = true;
      return;
    }
    (this.managementFormGroup.get('managementTeams') as FormArray).push(
        this.formBuilder.group({
          name: [undefined],
          designation: [undefined]
        })
    );
  }




  onSubmit() {
    this.submitted = true;
    if (this.managementFormGroup.invalid) {
      return;
    }
    this.spinner = true;
    // management team list
    this.companyInfo.managementTeamList = this.managementFormGroup.get('managementTeams').value;

    this.companyInfoService.save(this.companyInfo).subscribe((response: any) => {
      this.companyInfo = response.detail;
      this.toastService.show(new Alert(AlertType.SUCCESS, `Company Saved Successfully`));
      this.dialogRef.close(ModalResponse.SUCCESS);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, `Error saving Company: ${error.error.message}`));
    });
  }

  close() {
    this.ref.close();
  }

}
