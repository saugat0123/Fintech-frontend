import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CollateralOwner} from '../../../../loan/model/collateralOwner';
import {CollateralDetail} from '../../../../loan/model/collateralDetail';
import {CustomerInfoService} from '../../../../customer/service/customer-info.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterConfigurationComponent} from '../cad-offer-letter-configuration.component';

@Component({
    selector: 'app-collateral-owner-details-form',
    templateUrl: './collateral-owner-details-form.component.html',
    styleUrls: ['./collateral-owner-details-form.component.scss']
})
export class CollateralOwnerDetailsFormComponent implements OnInit {
    @Input() customer: Customer;
    @Input() customerInfo: CustomerInfoData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() collateralDetail: CollateralDetail;
    @Output() customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    spinner = false;
    submitted = false;
    userConfigForm: FormGroup;
    collateralOwnerList: Array<CollateralOwner>;
    province: Province = new Province();
    collateralPermanentProvinceList: Array<Province> = Array<Province>();
    district: District = new District();
    collateralPermanentDistrictList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    collateralPermanentMunicipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

    constructor(private formBuilder: FormBuilder,
                private addressService: AddressService,
                private customerInfoService: CustomerInfoService,
                private toastService: ToastService,
                protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>
    ) {
    }

    ngOnInit() {
        this.getProvince();
        this.buildForm();
        const data = JSON.parse(this.customerInfo.nepData);
        this.setCollateralOwner(data.collateralOwnerDetail);
    }

    getProvince() {
        let provinces: Array<Province>;
        this.addressService.getProvince().subscribe((res: any) => {
            provinces = res.detail;
            this.collateralPermanentProvinceList = provinces;
        });
    }

    getCollateralOwnerDistricts(province: Province) {
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.collateralPermanentDistrictList = response.detail;
                this.collateralPermanentDistrictList.sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    getCollateralOwnerMunicipalities(district: District) {
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.collateralPermanentMunicipalitiesList = response.detail;
                this.collateralPermanentMunicipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
                this.collateralPermanentMunicipalitiesList.forEach(municipality => {
                    // tslint:disable-next-line:max-line-length
                    if (!ObjectUtil.isEmpty(this.collateralOwnerList.filter(value => value.collateralOwnerPermanentMunicipalities === municipality))
                        // tslint:disable-next-line:max-line-length
                        && municipality.id === this.collateralOwnerList.filter(value => value.collateralOwnerPermanentMunicipalities === municipality)[0].id) {
                        this.userConfigForm.controls.collateralPermanentMunicipalitiesList.setValue(municipality);
                    }
                });
            }
        );

    }

    buildForm() {
        this.userConfigForm = this.formBuilder.group({
            collateralOwnerDetail: this.formBuilder.array([])
        });
    }

    setCollateralOwner(collateralOwnerDetail: any) {
        const formArray = this.userConfigForm.get('collateralOwnerDetail') as FormArray;
        if (!ObjectUtil.isEmpty(this.customerInfo.collaterals)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.collaterals.collateralOwnerList)) {
                const collateralOwnerList = this.customerInfo.collaterals.collateralOwnerList;
                this.collateralOwnerList = collateralOwnerList;
            }
        }
        collateralOwnerDetail.forEach(value => {
            formArray.push(this.formBuilder.group({
                collateralOwnerName: [value.collateralOwnerName],
                collateralOwnerNameInEnglish: [value.collateralOwnerNameInEnglish],
                collateralOwnerDOB: [value.collateralOwnerDOB],
                collateralOwnerCitizenshipNo: [value.collateralOwnerCitizenshipNo],
                collateralOwnerCitizenshipIssueDate: [value.collateralOwnerCitizenshipIssueDate],
                collateralOwnerCitizenshipIssueDistrict: [value.collateralOwnerCitizenshipIssueDistrict],
                collateralOwnerGender: [value.collateralOwnerGender],
                collateralOwnerRelationMedium: [value.collateralOwnerRelationMedium],
                collateralOwnerFatherName: [value.collateralOwnerFatherName],
                collateralOwnerMotherName: [value.collateralOwnerMotherName],
                collateralOwnerGrandFatherName: [value.collateralOwnerGrandFatherName],
                collateralOwnerGrandMotherName: [value.collateralOwnerGrandMotherName],
                collateralOwnerSpouse: [value.collateralOwnerSpouse],
                collateralOwnerPermanentProvince: [value.collateralOwnerPermanentProvince],
                collateralOwnerPermanentDistrict: [value.collateralOwnerPermanentDistrict],
                collateralOwnerPermanentMunicipalities: [value.collateralOwnerPermanentMunicipalities],
                collateralOwnerPermanentWard: [value.collateralOwnerPermanentWard],
            }));
        });
    }

    collateralOwnerGender(val) {
        if (val === 'MALE') {
            return 1;
        } else {
            return 0;
        }
    }

    addCollateralOwner() {
        (this.userConfigForm.get('collateralOwnerDetail') as FormArray).push(this.addCollateralOwnerField());
    }

    addCollateralOwnerField() {
        return this.formBuilder.group({
            collateralOwnerName: '',
            collateralOwnerNameInEnglish: '',
            collateralOwnerDOB: '',
            collateralOwnerCitizenshipNo: '',
            collateralOwnerCitizenshipIssueDate: '',
            collateralOwnerCitizenshipIssueDistrict: '',
            collateralOwnerGender: '',
            collateralOwnerRelationMedium: '',
            collateralOwnerFatherName: '',
            collateralOwnerMotherName: '',
            collateralOwnerGrandFatherName: '',
            collateralOwnerGrandMotherName: '',
            collateralOwnerSpouse: '',
            collateralOwnerPermanentProvince: '',
            collateralOwnerPermanentDistrict: '',
            collateralOwnerPermanentMunicipalities: '',
            collateralOwnerPermanentWard: '',
        });
    }

    removeAtIndexCollateralOwner(i: any) {
        (this.userConfigForm.get('collateralOwnerDetail') as FormArray).removeAt(i);
    }

    get basicInfoControls() {
        return this.userConfigForm.controls;
    }

    save() {
        this.submitted = true;
        if (this.userConfigForm.invalid) {
            return;
        }
        this.spinner = true;
        const collateralData = JSON.stringify(this.userConfigForm.value);
        this.customerInfoService.updateNepaliConfigData(collateralData, this.customerInfo.id).subscribe(res => {
            this.customerInfoData = res.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated!!!'));
            this.spinner = false;
            this.reloadPage();
            this.dialogRef.close(this.customerInfoData);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while Updating data!!!'));
            console.log(error);
            this.spinner = false;
            this.dialogRef.close();
        });
    }

    reloadPage() {
        window.location.reload();
    }

}
