import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from "../../../../../admin/modal/company-info";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LegalStatus} from "../../../../../admin/modal/legal-status";
import {Capital} from "../../../../../admin/modal/capital";
import {Swot} from "../../../../../admin/modal/swot";
import {CompanyLocations} from "../../../../../admin/modal/companyLocations";
import {ManagementTeam} from "../../../../../admin/modal/management-team";
import {AddressService} from "../../../../../../@core/service/baseservice/address.service";
import {LoanDataService} from "../../../../../loan/service/loan-data.service";
import {ActivatedRoute} from "@angular/router";
import {LoanFormService} from "../../../../../loan/component/loan-form/service/loan-form.service";
import {ToastService} from "../../../../../../@core/utils";
import {CompanyInfoService} from "../../../../../admin/service/company-info.service";
import {BlacklistService} from "../../../../../admin/component/blacklist/blacklist.service";
import {NbDialogRef} from "@nebular/theme";
import {CompanyFormComponent} from "../../../customer-form/company-form/company-form.component";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";

@Component({
  selector: 'app-edit-management-team',
  templateUrl: './edit-management-team.component.html',
  styleUrls: ['./edit-management-team.component.scss']
})
export class EditManagementTeamComponent implements OnInit {

  companyInfoFormGroup: FormGroup;

  submitted = false;
  companyInfo: CompanyInfo;
  legalStatus: LegalStatus = new LegalStatus();
  capital: Capital = new Capital();
  swot: Swot = new Swot();
  locations: CompanyLocations = new CompanyLocations();
  managementTeamList: Array<ManagementTeam> = new Array<ManagementTeam>();

  constructor(
      private formBuilder: FormBuilder,
      private commonLocation: AddressService,
      private loanDataService: LoanDataService,
      private activatedRoute: ActivatedRoute,
      private loanFormService: LoanFormService,
      private toastService: ToastService,
      private companyInfoService: CompanyInfoService,
      private blackListService: BlacklistService,
      protected ref: NbDialogRef<CompanyFormComponent>,
  ) {

  }

  get form() {
    return this.companyInfoFormGroup.controls;
  }

  ngOnInit() {
    this.buildForm();

    if (ObjectUtil.isEmpty(this.companyInfo.managementTeamList)) {

    } else {
      this.setCompanyInfo(this.companyInfo);
    }

  }

  buildForm() {
    this.companyInfoFormGroup = this.formBuilder.group({


      // managementTeams
      managementTeams: this.formBuilder.array([
        this.managementTeamFormGroup()
      ]),

    });
  }

  setCompanyInfo(info: CompanyInfo) {
    // set managementTeams data
    this.companyInfoFormGroup.setControl('managementTeams', this.setManagementTeams(info.managementTeamList));

  }

  managementTeamFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined, Validators.required],
      designation: [undefined, Validators.required]
    });
  }

  // set managementTeams data
  setManagementTeams(managementTeamList: ManagementTeam[]): FormArray {
    const managementTeamFormArray = new FormArray([]);
    managementTeamList.forEach(managementTeam => {
      managementTeamFormArray.push(this.formBuilder.group({
        name: [managementTeam.name === undefined ? '' : managementTeam.name, Validators.required],
        designation: [managementTeam.designation === undefined ? '' : managementTeam.designation, Validators.required],
      }));
    });
    return managementTeamFormArray;
  }

  removeManagementTeam(index: number) {
    (<FormArray>this.companyInfoFormGroup.get('managementTeams')).removeAt(index);
  }

  addManagementTeam() {
    (<FormArray>this.companyInfoFormGroup.get('managementTeams')).push(this.managementTeamFormGroup());
  }




  onSubmit() {
    // management team list
    this.companyInfo.managementTeamList = this.companyInfoFormGroup.get('managementTeams').value;
    this.companyInfoService.save(this.companyInfo).subscribe((response: any) => {
      this.close();
      this.toastService.show(new Alert(AlertType.SUCCESS, `Company Saved Successfully`));
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, `Error saving Company: ${error.error.message}`));
    });
  }

  close() {
    this.ref.close();
  }

}
