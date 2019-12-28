import {Component, Input, OnInit} from '@angular/core';
import {Valuator} from '../../../modal/valuator';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';

import {Province} from '../../../modal/province';
import {District} from '../../../modal/district';
import {MunicipalityVdc} from '../../../modal/municipality_VDC';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ValuatorService} from '../valuator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {BranchService} from '../../branch/branch.service';
import {Branch} from '../../../modal/branch';
import {ValuatingField} from '../../../modal/valuatingField';


@Component({
    selector: 'app-valuator-form',
    templateUrl: './add-valuator.component.html'
})
export class ValuatorFormComponent implements OnInit {

    @Input()
    model: Valuator = new Valuator();

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    provinces: Province[];
    districts: District[];
    municipalities: MunicipalityVdc[];
    branchList: Branch[] = [];

    valuatorForm: FormGroup;
    valuatingFieldEnum = ValuatingField;

    constructor(
        private service: ValuatorService,
        private location: AddressService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private branchService: BranchService
    ) {

    }

    ngOnInit() {
        this.spinner = true;
        this.buildForm();

        this.branchService.getAll().subscribe( (response: any) => {
            this.branchList = response.detail;
            if (!ObjectUtil.isEmpty(this.model) && !ObjectUtil.isEmpty(this.model.branch)) {
                this.valuatorForm.get('branch').patchValue(this.model.branch);
            }
            this.spinner = false;
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Branch List!'));
            console.log(error);
            this.spinner = false;
        });

        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
            this.spinner = false;
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Provinces!'));
            console.log(error);
            this.spinner = false;
        });

        if (!ObjectUtil.isEmpty(this.model.province)) {
            this.getDistrictsById(this.model.province.id, null);
            this.getMunicipalitiesById(this.model.district.id, null);
        }
    }

    buildForm() {
        this.valuatorForm = this.formBuilder.group({
            id: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.id)) ? undefined :
                this.model.id],
            name: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.name)) ? undefined :
                this.model.name, [Validators.required]],
            contactNo: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.contactNo)) ? undefined :
                this.model.contactNo, [Validators.required]],
            email: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.email)) ? undefined :
                this.model.email, [Validators.required, Validators.email]],
            province: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.province)) ? undefined :
                this.model.province, [Validators.required]],
            district: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.district)) ? undefined :
                this.model.district, [Validators.required]],
            municipalityVdc: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.municipalityVdc)) ? undefined :
                this.model.municipalityVdc, [Validators.required]],
            streetName: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.streetName)) ? undefined :
                this.model.streetName, [Validators.required]],
            wardNumber: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.wardNumber)) ? undefined :
                this.model.wardNumber, [Validators.required, Validators.min(0)]],
            valuatingField: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.valuatingField)) ? undefined :
                this.model.valuatingField, [Validators.required]],
            bankAssociateDate: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.bankAssociateDate)) ? undefined :
                this.formatDate(new Date(this.model.bankAssociateDate)), [Validators.required]],
            minAmount: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.minAmount)) ? undefined :
                this.model.minAmount, [Validators.required, Validators.min(0)]],
            maxAmount: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.maxAmount)) ? undefined :
                this.model.maxAmount, [Validators.required, Validators.min(0)]],
            branch: [undefined, [Validators.required]],
            inactiveComment: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.inactiveComment)) ? undefined :
                this.model.inactiveComment],
            status: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.status)) ? undefined :
                this.model.status],
            version: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.version)) ? undefined :
                this.model.version]
        });
    }

    get valuatorFormControl() {
        return this.valuatorForm.controls;
    }

    formatDate(date: Date) {
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2);
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    getDistrictsById(provinceId: number, event) {
        const province = new Province();
        province.id = provinceId;
        this.location.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districts = response.detail;
                if (event !== null) {
                    this.valuatorForm.get('district').patchValue(null);
                    this.valuatorForm.get('municipalityVdc').patchValue(null);
                    this.municipalities = null;
                }
            }
        );
    }

    getMunicipalitiesById(districtId: number, event) {
        const district = new District();
        district.id = districtId;
        this.location.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
                if (event !== null) {
                    this.valuatorForm.get('municipalityVdc').patchValue(null);
                }
            }
        );
    }

    addCustomValuatingField(tag: string) {
        return tag;
    }

    onSubmit() {
        this.submitted = true;
        if (this.valuatorForm.invalid) { return; }
        this.spinner = true;
        this.model = this.valuatorForm.value;
        this.service.save(this.model).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Valuator!'));
                this.model = new Valuator();
                this.activeModal.close(ModalResponse.SUCCESS);

            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Valuator!'));
                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ValuatorFormComponent);
    }
}
