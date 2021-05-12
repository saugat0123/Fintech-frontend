import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogRef} from '@nebular/theme';
import {FormUtils} from '../../../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Pattern} from '../../../../../@core/utils/constants/pattern';
import {CommonAddressComponent} from '../../../../common-address/common-address.component';
import {RoleService} from '../../../../admin/component/role-permission/role.service';
import {ToastService} from '../../../../../@core/utils';

@Component({
    selector: 'app-fix-asset-collateral',
    templateUrl: './fix-asset-collateral.component.html',
    styleUrls: ['./fix-asset-collateral.component.scss']
})
export class FixAssetCollateralComponent implements OnInit {
    fixedAssetsForm: FormGroup;
    submitted = false;
    @ViewChild('currentResidentAddress', {static: true}) currentResidentAddress: CommonAddressComponent;
    majorMarketPlaceDistance = ['less than 500M', '500M to 1KM', '1KM to 2KM', 'More than 2KM'];
    designationList = [];
    spinner = false;

    constructor(private formBuilder: FormBuilder,
                private http: HttpClient,
                public nbDialogRef: NbDialogRef<FixAssetCollateralComponent>,
                private activeModal: NgbActiveModal,
                private toastService: ToastService,
                private roleService: RoleService) {
    }

    get form() {
        return this.fixedAssetsForm.controls;
    }

    get staffsForm() {
        return (this.fixedAssetsForm.get('staffs') as FormArray).controls;
    }

    ngOnInit() {
        this.getRoleList();
        this.buildForm();
        this.addStaffs();
    }

    getRoleList() {
        this.spinner = true;
        this.roleService.getAll().subscribe(res => {
            this.designationList = res.detail;
            this.spinner = false;
        }, error => {
            console.log('error', error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
            this.spinner = false;
        });
    }

    buildForm() {
        this.fixedAssetsForm = this.formBuilder.group({
            date: [undefined, Validators.required],
            personContacted: [undefined, Validators.pattern(Pattern.ALPHABET_ONLY)],
            phoneNoOfContact: [undefined, Validators.pattern(Pattern.NUMBER_MOBILE)],
            address: [undefined],
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
            constructionYear: [undefined, Validators.required],
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
    }

}
