import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Customer} from '../../../../admin/modal/customer';

@Component({
    selector: 'app-collateral-owner-details-form',
    templateUrl: './collateral-owner-details-form.component.html',
    styleUrls: ['./collateral-owner-details-form.component.scss']
})
export class CollateralOwnerDetailsFormComponent implements OnInit {
    @Input() customer: Customer;
    spinner = false;
    submitted = false;
    userConfigForm: FormGroup;
    province: Province = new Province();
    collateralPermanentProvinceList: Array<Province> = Array<Province>();
    district: District = new District();
    collateralPermanentDistrictList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    collateralPermanentMunicipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

    constructor(private formBuilder: FormBuilder,
        private addressService: AddressService,
    ) {
    }

    ngOnInit() {
        this.getProvince();
        this.buildForm();
    }

    getProvince() {
        let provinces: Array<Province>;
        this.addressService.getProvince().subscribe((res: any) => {
            provinces = res.detail;
            this.collateralPermanentProvinceList = provinces;
        });
    }

    getDistricts(province: Province) {
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.collateralPermanentDistrictList = response.detail;
                this.collateralPermanentDistrictList.sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    getMunicipalities(district: District) {
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.collateralPermanentMunicipalitiesList = response.detail;
                this.collateralPermanentMunicipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
                this.collateralPermanentMunicipalitiesList.forEach(municipality => {
                    if (!ObjectUtil.isEmpty(this.customer.municipalities) && municipality.id === this.customer.municipalities.id) {
                        this.userConfigForm.controls.municipalities.setValue(municipality);
                    }
                });
            }
        );

    }
    buildForm() {
       this.userConfigForm = this.formBuilder.group({
           collateralOwnerName: [undefined],
           collateralOwnerNameInEnglish: [undefined],
           collateralOwnerDOB: [undefined],
           collateralOwnerCitizenshipNo: [undefined],
           collateralOwnerCitizenshipIssueDate: [undefined],
           collateralOwnerCitizenshipIssueDistrict: [undefined],
           collateralOwnerGender: [undefined],
           collateralOwnerRelationMedium: [undefined],
           collateralOwnerFatherName: [undefined],
           collateralOwnerMotherName: [undefined],
           collateralOwnerGrandFatherName: [undefined],
           collateralOwnerGrandMotherName: [undefined],
           collateralOwnerSpouse: [undefined],
           collateralOwnerPermanentProvince: [undefined],
           collateralOwnerPermanentDistrict: [undefined],
           collateralOwnerPermanentMunicipalities: [undefined],
           collateralOwnerPermanentWard: [undefined],
       });
    }
    get basicInfoControls() {
        return this.userConfigForm.controls;
    }

}
