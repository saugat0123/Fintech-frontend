import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
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
import {CreateDocumentComponent} from '../create-document/create-document.component';
import {SiteVisitDocument} from './site-visit-document';
import {ActivatedRoute} from '@angular/router';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';

@Component({
    selector: 'app-fix-asset-collateral',
    templateUrl: './fix-asset-collateral.component.html',
    styleUrls: ['./fix-asset-collateral.component.scss']
})
export class FixAssetCollateralComponent implements OnInit {

    fixedAssetsForm: FormGroup;
    @Input() securityId: number;
    @Input() security: string;
    @Input() siteVisitDocument: Array<SiteVisitDocument> = new Array<SiteVisitDocument>();
    customerType: string;
    customerId: number;
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
    fileType = '.jpg';
    modelHeader: string;
    modelBody: string;
    isSiteVisitPresent: boolean;
    security_id_for_delete: string;

    constructor(private formBuilder: FormBuilder,
                private http: HttpClient,
                public nbDialogRef: NbDialogRef<FixAssetCollateralComponent>,
                private activeModal: NgbActiveModal,
                private toastService: ToastService,
                private roleService: RoleService,
                private addressService: AddressService,
                private collateralSiteVisitService: CollateralSiteVisitService,
                private modelService: NgbModal,
                private nbDialogService: NbDialogService,
                private activatedRoute: ActivatedRoute) {
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
        this.getCustomerTypeAndId();
    }

    getCustomerTypeAndId() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.customerType = params.customerType;
            this.customerId = params.customerInfoId;
        });
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
            this.isSiteVisitPresent = true;
            this.siteVisitDocument = this.collateralSiteVisit.siteVisitDocuments;
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
            securityName: [undefined],
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
        this.spinner = true;
        if (ObjectUtil.isEmpty(this.collateralSiteVisit)) {
            this.collateralSiteVisit = new CollateralSiteVisit();
        }
        if (ObjectUtil.isEmpty(this.securityId)) {
            this.toastService.show(new Alert(AlertType.ERROR, 'No security found please add one'));
            return;
        }
        this.fixedAssetsForm.get('securityName').patchValue(this.security);
        const formData: FormData = new FormData();
        // for update site visit
        if (!ObjectUtil.isEmpty(this.collateralSiteVisit.id)) {
            formData.append('id', this.collateralSiteVisit.id.toString());
        }
        // for new site visit
        if (!ObjectUtil.isEmpty(this.siteVisitDocument)) {
            this.siteVisitDocument.map((m) => {
                formData.append('docName', m.docName);
                if (!ObjectUtil.isEmpty(m.multipartFile)) {
                    formData.append('file', m.multipartFile, m.docName);
                    formData.append('fileExist', 'Yes');
                } else {
                    formData.append('fileExist', 'No');
                }
                formData.append('isPrintable', m.isPrintable);
                let docIds = -1;
                if (!ObjectUtil.isEmpty(m.id)) {
                    docIds = m.id;
                }
                formData.append('docId', docIds.toString());
            });
        }
        // required parameter for backend
        formData.append('customerId', this.customerId.toString());
        formData.append('customerType', this.customerType);
        formData.append('siteVisitData', this.fixedAssetsForm.get('date').value);
        formData.append('securityName', this.security);
        formData.append('siteVisitJsonData', JSON.stringify(this.fixedAssetsForm.value));
        if (this.fixedAssetsForm.invalid) {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Please check validation!!!'));
            this.spinner = false;
            return;
        }
        this.collateralSiteVisitService.saveCollateralSiteVisit(this.securityId, formData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Save Security Site Visit'));
            this.spinner = false;
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

    public openDocumentCreateModal(editId): void {
        const siteVisitDocument = this.siteVisitDocument;
        this.nbDialogService.open(CreateDocumentComponent, {
            context: { editId, siteVisitDocument }
        });
    }

    viewDocument(url: string, name: string) {
        const viewDocName = name.concat(this.fileType);
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}${viewDocName}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

    public onClose(model): void {
        this.modelService.dismissAll(model);
    }

    public openModel(model, security_id_for_delete): void {
        this.security_id_for_delete = security_id_for_delete;
        this.modelHeader = 'DELETE';
        if (security_id_for_delete === 'single') {
            this.modelBody = 'ARE YOU SURE YOU WANT TO DELETE ?';
        } else {
            this.modelBody = 'ARE YOU SURE YOU WANT TO DELETE ALL ?';
        }
        this.modelService.open(model);
    }

    public deleteSiteVisit(deleteId, model): void {
        if (deleteId === 'single') {
            this.collateralSiteVisitService.deleteSiteVisit(this.collateralSiteVisit.id, this.collateralSiteVisit.siteVisitDate)
                .subscribe((response: any) => {
                    this.modelService.dismissAll(model);
                    this.nbDialogRef.close(FixAssetCollateralComponent);
                    this.toastService.show(new Alert(AlertType.SUCCESS, response.detail));
            }, error => {
                    this.modelService.dismissAll(model);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Could not delete site visit'));
                console.error(error);
            });
        } else {
            this.collateralSiteVisitService.deleteAllSiteVisit(this.securityId, this.collateralSiteVisit.securityName)
                .subscribe((res: any) => {
                    this.modelService.dismissAll(model);
                    this.nbDialogRef.close(FixAssetCollateralComponent);
                    this.toastService.show(new Alert(AlertType.SUCCESS, res.detail));
                }, error => {
                    this.modelService.dismissAll(model);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Could not delete site visit'));
                    console.error(error);
                });
        }
    }
}
