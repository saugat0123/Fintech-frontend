import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Province} from '../../../../admin/modal/province';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {Valuator} from '../../../../admin/modal/valuator';
import {LandBuilding} from '../../model/land-building';

@Component({
  selector: 'app-security-land-building',
  templateUrl: './security-land-building.component.html',
  styleUrls: ['./security-land-building.component.scss']
})
export class SecurityLandBuildingComponent implements OnInit {
  landBuildingForm: FormGroup = new FormGroup({});
  provinceList: Array<Province> = new Array<Province>();
  districtList: Array<District> = new Array<District>();
  municipalityList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
  valuatorList: Array<Valuator> = new Array<Valuator>();
  landBuilding: Array<LandBuilding> = new Array<LandBuilding>();
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private addressService: AddressService,
              private toastService: ToastService,
              private valuatorService: ValuatorService,) { }

  ngOnInit() {
    this.buildForm();
    this.getAllProvince();
    this.getAllValuator();
  }

  private getAllValuator(): void {
    this.valuatorService.getAllValuator().subscribe({
      next: (response: any) => {
        this.valuatorList = response.detail;
      },
      error: (error) => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to load district!!!'));
      },
      complete: () => {},
    });
  }

  public getAllProvince(): void {
    this.addressService.getProvince().subscribe({
      next: (response: any) => {
        this.provinceList = response.detail;
      },
      error: (err) => {
        console.log(err);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load province!!!'));
      },
      complete: () => {},
    });
  }

  public getDistrictByProvince(province: Province, index: number): void {
    this.addressService.getDistrictByProvince(province).subscribe({
      next: (response: any) => {
        this.districtList = response.detail;
        this.landBuildingForm.get(['landAndBuilding', index, 'district']).reset();
        this.landBuildingForm.get(['landAndBuilding', index, 'municipality']).reset();
      },
      error: (error) => {
        console.log(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load district!!!'));
      },
      complete: () => {},
    });
  }

  public getMunicipalityByDistrict(district: District, index: number): void {
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe({
      next: (response: any) => {
        this.municipalityList = response.detail;
        this.landBuildingForm.get(['landAndBuilding', index, 'municipality']).reset();
      },
      error: (error) => {
        console.log(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load district!!!'));
      },
      complete: () => {},
    });
  }

  private buildForm(): FormGroup {
    return this.landBuildingForm = this.formBuilder.group({
      landAndBuilding: this.formBuilder.array([this.buildLandBuildFormGroup()]),
    });
  }

  private buildLandBuildFormGroup(): FormGroup {
    return this.formBuilder.group({
      governmentRate: [undefined],
      marketRate: [undefined],
      fairMarketValue: [undefined, Validators.required],
      distressValue: [undefined, Validators.required],
      considerValue: [undefined, Validators.required],
      sheetNo: [undefined, Validators.required],
      plotNumber: [undefined, Validators.required],
      province: [undefined, Validators.required],
      district: [undefined, Validators.required],
      municipalityVdc: [undefined, Validators.required],
      geoLocation: [undefined],
      valuators: [undefined],
      addressLine1: [undefined],
      addressLine2: [undefined],
      registerOffice: [undefined],
    });
  }

  public addLandBuilding(): void {
    (this.landBuildingForm.get('landAndBuilding') as FormArray).push(this.buildLandBuildFormGroup());
  }

  public removeLandAndBuilding(index: number): void {
    (<FormArray>this.landBuildingForm.get('landAndBuilding')).removeAt(index);
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.landBuildingForm.invalid) {
      this.toastService.show(new Alert(AlertType.WARNING, 'Validation Occurred'));
      return;
    }
    const formArray = this.landBuildingForm.get('landAndBuilding') as FormArray;
    formArray.controls.map(val => {
      this.landBuilding.push(val.value);
    });
  }

  public compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}
