import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogRef} from '@nebular/theme';
import {FormUtils} from '../../../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-fix-asset-collateral',
    templateUrl: './fix-asset-collateral.component.html',
    styleUrls: ['./fix-asset-collateral.component.scss']
})
export class FixAssetCollateralComponent implements OnInit {
    fixedAssetsForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private http: HttpClient,
                public nbDialogRef: NbDialogRef<FixAssetCollateralComponent>,
                private activeModal: NgbActiveModal) {
    }


    get staffsForm() {
        return (<FormArray>(this.fixedAssetsForm.get('staffs'))).controls;
    }

    ngOnInit() {
        this.buildForm();
        this.addStaffs();
    }

    buildForm() {
        this.fixedAssetsForm = this.formBuilder.group({
            date: [undefined],
            personContacted: [undefined],
            phoneNoOfContact: [undefined],
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
            staffRepresentativeNameDesignation: undefined,
            staffRepresentativeName: undefined,
            staffRepresentativeNameDesignation2: undefined,
            staffRepresentativeName2: undefined,
        });
    }

    addStaffs() {
        const controls =  (<FormArray>(this.fixedAssetsForm.get('staffs')));
        controls.push(this.staffsFormGroup());
    }

    deleteStaff(i) {
        (<FormArray>(this.fixedAssetsForm.get('staffs'))).removeAt(i);
    }
        onSubmit() {
    }

}
