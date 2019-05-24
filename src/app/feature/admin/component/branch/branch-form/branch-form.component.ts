import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Branch} from '../../../modal/branch';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonLocation} from '../../../../../@core/service/baseservice/common-location';
import {Province} from '../../../modal/province';
import {District} from '../../../modal/district';
import {MunicipalityVdc} from '../../../modal/municipality_VDC';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {AlertService} from '../../../../../@theme/components/alert/alert.service';
import {ModalResponse, ToastService} from '../../../../../@core/utils';


@Component({
    selector: 'app-branch-form',
    templateUrl: './branch-form.component.html'
})
export class BranchFormComponent implements OnInit, DoCheck {
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
        private location: CommonLocation,
        private alertService: AlertService,
        private toastService: ToastService
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

                this.activeModal.close(ModalResponse.SUCCESS);

                if (this.branch.id == null) {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Branch'));
                } else {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Branch'));
                }

                this.branch = new Branch();

            }, error => {

                console.log(error);

                this.activeModal.dismiss(ModalResponse.ERROR);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Branch'));

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/branch']));
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

    getMunicipality() {
        this.branch.municipalityVdc = this.municipality;
    }


}
