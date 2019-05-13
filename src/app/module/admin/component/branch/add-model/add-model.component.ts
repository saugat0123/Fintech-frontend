import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {Branch} from '../../../modal/branch';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {CommonLocation} from '../../../../../shared-service/baseservice/common-location';
import {Province} from '../../../modal/province';
import {District} from '../../../modal/district';
import {MunicipalityVdc} from '../../../modal/municipality_VDC';
import {AlertService} from '../../../../../common/alert/alert.service';
import {Alert, AlertType} from '../../../../../common/alert/Alert';


@Component({
    selector: 'app-add-model',
    templateUrl: './add-model.component.html',
    styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    branch: Branch = new Branch();
    provinces: Province[];
    districts: District[];
    municipalities: MunicipalityVdc[];
    district: District = new District();
    province: Province = new Province();
    municipality: MunicipalityVdc = new MunicipalityVdc();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private location: CommonLocation,
        private alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
            this.province = this.branch.province;
            if (this.province !== undefined) {
                this.getSelectedProvinceDistrict();
            }
            this.district = this.branch.district;
            if (this.district !== undefined) {
                this.getSelectedDistrictMunicipality();
            }
        });
    }

    getSelectedProvinceDistrict() {
        this.location.getDistrictByProvince(this.branch.province).subscribe(
            (response: any) => {
                this.districts = response.detail;
            }
        );
    }

    getSelectedDistrictMunicipality() {
        this.location.getMunicipalityVDCByDistrict(this.branch.district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
            }
        );
    }

    getMunicipalities() {
        this.branch.district = this.district;
        this.location.getMunicipalityVDCByDistrict(this.district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
            }
        );
    }


    getDistricts(provinceId: number) {
        this.branch.province = this.province;
        this.province.id = provinceId;
        this.location.getDistrictByProvince(this.province).subscribe(
            (response: any) => {
                this.districts = response.detail;
            }
        );
        this.municipalities = new Array();
        console.log(this.province);
    }

    ngDoCheck(): void {
        this.branch = this.dataService.getBranch();
        if (this.branch.id == null) {
            this.task = 'Add';
            this.province = new Province();
            this.district = new District();
            this.municipality = new MunicipalityVdc();
        } else {
            this.task = 'Edit';
            this.district = this.branch.district;
            this.province = this.branch.province;
            this.municipality = this.branch.municipalityVdc;

        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.branch, 'v1/branch').subscribe(result => {
                this.modalService.dismissAll(AddModelComponent);
                if (this.branch.id == null) {
                    this.alertService.notify(new Alert(AlertType.SUCCESS, 'Successfully Saved Branch'));
                } else {
                    this.alertService.notify(new Alert(AlertType.SUCCESS, 'Successfully Updated Branch'));
                }
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.branch = new Branch();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/branch']));

            }, error => {
                this.modalService.dismissAll(AddModelComponent);
                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/branch']));
            }
        );
    }


    onClose() {
        this.activeModal.dismiss(AddModelComponent);
    }

    getMunicipality() {
        this.branch.municipalityVdc = this.municipality;
    }


}
