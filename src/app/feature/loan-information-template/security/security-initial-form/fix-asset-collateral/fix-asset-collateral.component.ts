import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogRef} from '@nebular/theme';
import {FormUtils} from '../../../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Pattern} from '../../../../../@core/utils/constants/pattern';
import {RoleService} from '../../../../admin/component/role-permission/role.service';
import {ToastService} from '../../../../../@core/utils';
import {CollateralSiteVisit} from './CollateralSiteVisit';
import {CollateralSiteVisitService} from './collateral-site-visit.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';

@Component({
    selector: 'app-fix-asset-collateral',
    templateUrl: './fix-asset-collateral.component.html',
    styleUrls: ['./fix-asset-collateral.component.scss']
})
export class FixAssetCollateralComponent implements OnInit {
    fixedAssetsForm: FormGroup;
    @Input() securityId: number;
    @Input() security: string;
    submitted = false;
    majorMarketPlaceDistance = ['less than 500M', '500M to 1KM', '1KM to 2KM', 'More than 2KM'];
    designationList = [];
    spinner = false;
    fixed = false;
    provinceList: Array<Province> = new Array<Province>();
    districts: Array<District> = new Array<District>();
    municipalities: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
    collateralSiteVisits: Array<CollateralSiteVisit>;
    collateralSiteVisit: CollateralSiteVisit = new CollateralSiteVisit();
    collateralData: any;
    selectedSiteVisit: any;

    constructor(private formBuilder: FormBuilder,
                private http: HttpClient,
                public nbDialogRef: NbDialogRef<FixAssetCollateralComponent>,
                private activeModal: NgbActiveModal,
                private toastService: ToastService,
                private roleService: RoleService,
                private addressService: AddressService,
                private collateralSiteVisitService: CollateralSiteVisitService) {
    }

    get form() {
        return this.fixedAssetsForm.controls;
    }

    get staffsForm() {
        return (this.fixedAssetsForm.get('staffs') as FormArray).controls;
    }

    ngOnInit() {
        this.buildForm();
        this.addressService.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
            });
        this.getRoleList();
        this.getCollateralBySecurityName(this.security);
        this.addStaffs();
    }

    getCollateralBySecurityName(securityName) {
        if (this.securityId === undefined) {
            return;
        }
        this.collateralSiteVisitService.getCollateralBySecurityNameAndSecurityAndId(securityName, this.securityId)
            .subscribe((response: any) => {
            this.collateralSiteVisits = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, `Unable to load site visit info of ${securityName}`));
        });
    }

    getLastSiteVisitDetail() {
        this.collateralSiteVisitService.getCollateralBySiteVisitDateAndId(this.selectedSiteVisit.siteVisitDate, this.selectedSiteVisit.id)
            .subscribe((response: any) => {
            this.collateralSiteVisit = response.detail;
            this.collateralData = JSON.parse(this.collateralSiteVisit.siteVisitJsonData);
            this.getDistrictsById(this.collateralData.province.id, null);
            this.getMunicipalitiesById(this.collateralData.district.id, null);
            this.fixedAssetsForm.patchValue(JSON.parse(this.collateralSiteVisit.siteVisitJsonData));
            this.setStaffDetail(this.collateralData);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, `Unable to load site visit info by ${this.selectedSiteVisit.siteVisitDate} date`));
        });
    }
    getDistrictsById(provinceId: number, event) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districts = response.detail;
                this.districts.sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }


    getMunicipalitiesById(districtId: number, event) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
                this.municipalities.sort((a, b) => a.name.localeCompare(b.name));
                if (event !== null) {
                    this.fixedAssetsForm.get('municipalityVdc').patchValue(null);
                }
            }
        );
    }
    getRoleList() {
        this.spinner = true;
        this.roleService.getAll().subscribe(res => {
            this.designationList = res.detail;
            this.spinner = false;
        }, error => {
            console.error('error', error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
            this.spinner = false;
        });
    }

    setStaffDetail(data) {
        const formControls = this.fixedAssetsForm.get('staffs') as FormArray;
        data.staffs.splice(0, 1);
        data.staffs.forEach((detail) => {
            formControls.push(
                this.formBuilder.group({
                    staffRepresentativeNameDesignation: [detail.staffRepresentativeNameDesignation],
                    staffRepresentativeName: [detail.staffRepresentativeName],
                    staffRepresentativeNameDesignation2: [detail.staffRepresentativeNameDesignation2],
                    staffRepresentativeName2: [detail.staffRepresentativeName2],
                })
            );
        });
    }

    buildForm() {
        this.fixedAssetsForm = this.formBuilder.group({
            date: [undefined, Validators.required],
            personContacted: [undefined, Validators.pattern(Pattern.ALPHABET_ONLY)],
            phoneNoOfContact: [undefined, Validators.pattern(Pattern.NUMBER_MOBILE)],
            address1: [undefined],
            address2: [undefined],
            province: [undefined, Validators.required],
            district: [undefined, Validators.required],
            municipalityVdc: [undefined, Validators.required],
            ward: [undefined, Validators.required],
            typeOfProperty: [undefined],
            shapeOfLand: [undefined],
            locationAndShapeOfLand: [undefined],
            roadApproach: [undefined],
            roadWidth: [undefined],
            prominentPlace: [undefined],
            approachDistance: [undefined],
            roadAccessFrom: [undefined],
            otherFacilities: [undefined],
            waterSupply: [undefined],
            electricity: [undefined],
            boundaryWallConstruction: [undefined],
            boundaryFencing: [undefined],
            drainage: [undefined],
            open: [undefined],
            telephoneLine: [undefined],
            remarksForOtherFacility: [undefined],
            building: [undefined],
            buildingArea: [undefined],
            constructionYear: [undefined],
            builtUpArea: [undefined],
            buildingType: [undefined],
            noOfStorey: [undefined],
            loadBearingWall: [undefined],
            mortarCement: [undefined],
            otherRoofing: [undefined],
            insideFurniture: [undefined],
            frameStructure: [undefined],
            rccRoofing: [undefined],
            bathroomAndToilet: [undefined],
            naksaPassObtained: [undefined],
            buildingCompCertificate: [undefined],
            constructionAsPerNaksa: [undefined],
            roadSetbacks: [undefined],
            riverOrCanalSetbacks: [undefined],
            highTensionSetbacks: [undefined],
            majorMarketPlaces: [undefined],
            schoolOrCollege: [undefined],
            hospitalOrNursingHome: [undefined],
            staffs: this.formBuilder.array([]),
            commentAboutFAC: [undefined],
            fixedAssetsLongitude: [undefined],
            fixedAssetsLatitude: [undefined],
        });
    }

    staffsFormGroup(): FormGroup {
        return this.formBuilder.group({
            staffRepresentativeNameDesignation: [undefined],
            staffRepresentativeName: [undefined],
            staffRepresentativeNameDesignation2: [undefined],
            staffRepresentativeName2: [undefined],
        });
    }

    addStaffs() {
        const controls = (<FormArray>(this.fixedAssetsForm.get('staffs')));
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please fill all staff data!!!'));
            return;
        }
        controls.push(this.staffsFormGroup());
    }

    deleteStaff(i) {
        (<FormArray>(this.fixedAssetsForm.get('staffs'))).removeAt(i);
    }

    onSubmit() {
        this.submitted = true;
        if (ObjectUtil.isEmpty(this.collateralSiteVisit)) {
            this.collateralSiteVisit = new CollateralSiteVisit();
        }
        this.collateralSiteVisit.siteVisitDate = this.fixedAssetsForm.get('date').value;
        this.collateralSiteVisit.siteVisitJsonData = JSON.stringify(this.fixedAssetsForm.value);
        this.collateralSiteVisit.securityName = this.security;
        if (this.fixedAssetsForm.invalid) {
            this.toastService.show(new Alert(AlertType.ERROR, 'Please check validation!!!'));
            return;
        }
        this.collateralSiteVisitService.saveCollateralSiteVisit(this.securityId, this.collateralSiteVisit).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Save Security Site Visit'));
            this.nbDialogRef.close();
        }, error => {
            this.spinner = false;
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Security Site Visit'));
        });
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }
}
