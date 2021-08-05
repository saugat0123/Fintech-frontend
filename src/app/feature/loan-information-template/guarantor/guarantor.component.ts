import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GuarantorDetail} from '../../loan/model/guarantor-detail';
import {CalendarType} from '../../../@core/model/calendar-type';
import {Province} from '../../admin/modal/province';
import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';
import {Address} from '../../loan/model/address';
import {AddressService} from '../../../@core/service/baseservice/address.service';
import {ToastService} from '../../../@core/utils';
import {BlacklistService} from '../../admin/component/blacklist/blacklist.service';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Guarantor} from '../../loan/model/guarantor';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {RelationshipList} from '../../loan/model/relationshipList';
import {TypeOfSourceOfIncomeArray} from '../../admin/modal/crg/typeOfSourceOfIncome';
import {Occupation} from '../../admin/modal/occupation';

@Component({
    selector: 'app-guarantor',
    templateUrl: './guarantor.component.html',
    styleUrls: ['./guarantor.component.scss']
})
export class GuarantorComponent implements OnInit {
    @Input() guarantorDetailValue: GuarantorDetail;
    @Output() blackListStatusEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() calendarType: CalendarType;
    @Output() guarantorDataEmitter = new EventEmitter();
    @Input() fromProfile: boolean;
    @Input() customerInfo;

    form: FormGroup;
    submitted = false;
    addMore = false;
    guarantorDetail: GuarantorDetail = new GuarantorDetail();
    displayEngDate = true;

    province: Province = new Province();
    provinceList: Array<Province> = new Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    addressList: Array<Address> = new Array<Address>();
    addressListTemporary: Array<Address> = new Array<Address>();
    private isBlackListed: boolean;
    allDistrict: Array<District> = new Array<District>();
    relationshipList: RelationshipList = new RelationshipList();
    relationList;
    docTitle = 'Net Worth Document';
    docFolderName = 'guarantorDoc';
    occupation = Occupation.enumObject();
    sameAsCurrentChecked = false;

    constructor(
        private formBuilder: FormBuilder,
        private addressServices: AddressService,
        private toastService: ToastService,
        private blackListService: BlacklistService,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.getProvince();
        this.getAllDistrict();
        this.relationList = this.relationshipList.relation;
        const formArray = this.form.get('guarantorDetails') as FormArray;

    }

    buildForm() {
        this.form = this.formBuilder.group({
            guarantorDetails: this.formBuilder.array([])
        });

        if (ObjectUtil.isEmpty(this.guarantorDetailValue)) {
            this.addEmptyGroup();
        } else {
            const formArray = this.form.get('guarantorDetails') as FormArray;
            if (this.guarantorDetailValue.guarantorList.length === 0) {
                this.addEmptyGroup();
                return;
            }
            this.guarantorDetailValue.guarantorList.forEach((v, index) => {
                this.addressList.push(new Address());
                this.addressListTemporary.push(new Address());
                if (!ObjectUtil.isEmpty(v.province) && !ObjectUtil.isEmpty(v.province.id)) {
                    this.getDistrict(v.province.id, index);
                    if (!ObjectUtil.isEmpty(v.district.id)) {
                        this.getMunicipalities(v.district.id, index);
                    }
                }
                if (!ObjectUtil.isEmpty(v.provinceTemporary) && !ObjectUtil.isEmpty(v.provinceTemporary.id)) {
                    this.getDistrictTemporary(v.provinceTemporary.id, index);
                    if (!ObjectUtil.isEmpty(v.districtTemporary.id)) {
                        this.getMunicipalitiesTemporary(v.districtTemporary.id, index);
                    }
                }
                formArray.push(this.addGuarantorDetails(v));
                this.sameAsCurrentChecked = v.checkedSameAsCurrent;
            });
        }
    }

    addEmptyGroup(): void {
        if (this.form.invalid) {
            this.addMore = true;
            return;
        }
        this.addressList.push(new Address());
        this.addressListTemporary.push(new Address());
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.push(this.addGuarantorDetails(new Guarantor()));
    }

    addGuarantorDetails(data: Guarantor) {
        return this.formBuilder.group({
            id: [
                ObjectUtil.setUndefinedIfNull(data.id)
            ],
            version: [
                ObjectUtil.setUndefinedIfNull(data.version)
            ],
            name: [
                ObjectUtil.setUndefinedIfNull(data.name),
                Validators.required
            ],
            province: [
                ObjectUtil.isEmpty(data.province) ? undefined : data.province.id,
                Validators.required
            ],
            district: [
                ObjectUtil.isEmpty(data.district) ? undefined : data.district.id,
                Validators.required
            ],
            municipalities: [
                ObjectUtil.isEmpty(data.municipalities) ? undefined : data.municipalities.id,
                Validators.required
            ],
            provinceTemporary: [
                ObjectUtil.isEmpty(data.provinceTemporary) ? undefined : data.provinceTemporary.id,
                Validators.required
            ],
            districtTemporary: [
                ObjectUtil.isEmpty(data.districtTemporary) ? undefined : data.districtTemporary.id,
                Validators.required
            ],
            municipalitiesTemporary: [
                ObjectUtil.isEmpty(data.municipalitiesTemporary) ? undefined : data.municipalitiesTemporary.id,
                Validators.required
            ],
            citizenNumber: [
                ObjectUtil.setUndefinedIfNull(data.citizenNumber),
                Validators.required
            ],
            issuedYear: [
                ObjectUtil.isEmpty(data.issuedYear) ? undefined : new Date(data.issuedYear), Validators.required,
            ],
            issuedPlace: [
                ObjectUtil.setUndefinedIfNull(data.issuedPlace),
                Validators.required
            ],
            contactNumber: [
                ObjectUtil.setUndefinedIfNull(data.contactNumber),
                Validators.required
            ],
            fatherName: [
                ObjectUtil.setUndefinedIfNull(data.fatherName),
                Validators.required
            ],
            grandFatherName: [
                ObjectUtil.setUndefinedIfNull(data.grandFatherName),
                Validators.required
            ],
            relationship: [
                ObjectUtil.setUndefinedIfNull(data.relationship),
                Validators.required
            ],
            netWorth: [
                ObjectUtil.setUndefinedIfNull(data.netWorth),
                Validators.required
            ],
            docPath: [
                ObjectUtil.setUndefinedIfNull(data.docPath)
            ],

            wardNumber: [
                ObjectUtil.setUndefinedIfNull(data.wardNumber), Validators.required
            ],
            permanentAddressLineOne: [ObjectUtil.setUndefinedIfNull(data.permanentAddressLineOne)],
            permanentAddressLineTwo: [ObjectUtil.setUndefinedIfNull(data.permanentAddressLineTwo)],
            temporaryAddressLineOne: [ObjectUtil.setUndefinedIfNull(data.temporaryAddressLineOne)],
            temporaryAddressLineTwo: [ObjectUtil.setUndefinedIfNull(data.temporaryAddressLineTwo)],

            wardNumberTemporary: [
                ObjectUtil.setUndefinedIfNull(data.wardNumberTemporary), Validators.required
            ],
            consentOfLegalHeirs: [ObjectUtil.isEmpty(data.consentOfLegalHeirs) ? false : data.consentOfLegalHeirs],
            dateOfBirth: [ObjectUtil.isEmpty(data.dateOfBirth) ? undefined : new Date(data.dateOfBirth), Validators.required],
            motherName: [ObjectUtil.setUndefinedIfNull(data.motherName)],
            spouseName: [ObjectUtil.setUndefinedIfNull(data.spouseName)],
            fatherInLaw: [ObjectUtil.setUndefinedIfNull(data.fatherInLaw)],
            profession: [ObjectUtil.setUndefinedIfNull(data.profession)],
            background: [ObjectUtil.setUndefinedIfNull(data.background)],
            guarantorLegalDocumentAddress: [ObjectUtil.setUndefinedIfNull(data.guarantorLegalDocumentAddress),
                Validators.required],
            checkedSameAsCurrent: [ObjectUtil.isEmpty(data.checkedSameAsCurrent) ? false : data.checkedSameAsCurrent],
        });

    }

    removeGuarantorDetails(index: number) {
        (this.form.get('guarantorDetails') as FormArray).removeAt(index);
    }

    getProvince() {
        this.addressServices.getProvince().subscribe((response: any) => {
            this.provinceList = response.detail;
        });
    }

    getDistrict(provinceId: number, i: number) {
        const province = new Province();
        province.id = provinceId;
        this.addressServices.getDistrictByProvince(province).subscribe((response: any) => {
            this.districtList = response.detail;
            this.districtList.sort((a, b) => a.name.localeCompare(b.name));
            this.addressList[i].districtList = this.districtList;
        });
    }

    getMunicipalities(districtId: number, i: number) {
        const district = new District();
        district.id = districtId;
        this.addressServices.getMunicipalityVDCByDistrict(district).subscribe((response: any) => {
            this.municipalitiesList = response.detail;
            this.municipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
            this.addressList[i].municipalityVdcList = this.municipalitiesList;
        });
    }

    getDistrictTemporary(provinceId: number, i: number) {
        const province = new Province();
        province.id = provinceId;
        this.addressServices.getDistrictByProvince(province).subscribe((response: any) => {
            this.districtList = response.detail;
            this.districtList.sort((a, b) => a.name.localeCompare(b.name));
            this.addressListTemporary[i].districtList = this.districtList;
        });
    }

    getMunicipalitiesTemporary(districtId: number, i: number) {
        const district = new District();
        district.id = districtId;
        this.addressServices.getMunicipalityVDCByDistrict(district).subscribe((response: any) => {
            this.municipalitiesList = response.detail;
            this.municipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
            this.addressListTemporary[i].municipalityVdcList = this.municipalitiesList;
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        if (!ObjectUtil.isEmpty(this.guarantorDetailValue)) {
            this.guarantorDetail = this.guarantorDetailValue;
        }
        this.guarantorDetail.guarantorList = new Array<Guarantor>();
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray['controls'].forEach(c => {
            const guarantor: Guarantor = c.value;
            if (!ObjectUtil.isEmpty(c.get('province').value)) {
                const province = new Province();
                province.id = c.get('province').value;
                guarantor.province = province;
                const district = new District();
                district.id = c.get('district').value;
                guarantor.district = district;
                const municipalityVdc = new MunicipalityVdc();
                municipalityVdc.id = c.get('municipalities').value;
                guarantor.municipalities = municipalityVdc;
                guarantor.checkedSameAsCurrent = c.get('checkedSameAsCurrent').value;
            }
            if (!ObjectUtil.isEmpty(c.get('provinceTemporary').value)) {
                const province = new Province();
                province.id = c.get('provinceTemporary').value;
                guarantor.provinceTemporary = province;
                const district = new District();
                district.id = c.get('districtTemporary').value;
                guarantor.districtTemporary = district;
                const municipalityVdc = new MunicipalityVdc();
                municipalityVdc.id = c.get('municipalitiesTemporary').value;
                guarantor.municipalitiesTemporary = municipalityVdc;
            }
            this.guarantorDetail.guarantorList.push(guarantor);
        });
        this.guarantorDataEmitter.emit(this.guarantorDetail);
    }

    checkBlackListByCitizenshipNo(citizenshipNum, index) {
        this.blackListService.checkBlacklistByRef(citizenshipNum).subscribe((response: any) => {
            this.isBlackListed = response.detail;
            this.blackListStatusEmitter.emit(this.isBlackListed);

            if (this.isBlackListed) {
                this.toastService.show(new Alert(AlertType.ERROR, 'Blacklisted Guarantor'));
                (this.form.get('guarantorDetails') as FormArray).controls[index].reset();
            }
        });
    }

    private getAllDistrict() {
        this.addressServices.getAllDistrict().subscribe((response: any) => {
            this.allDistrict = response.detail;
        });
    }

    documentPath(path, i) {
        this.form.get(['guarantorDetails', i, 'docPath']).patchValue(path);
    }

    sameAsAbove(i, event) {
        if (event === true) {
            console.log('Value of temporaryAddress', this.form.get('guarantorDetails'));
            this.form.get(['guarantorDetails', i]).patchValue({checkedSameAsCurrent: true});
            // tslint:disable-next-line:max-line-length
            this.form.get(['guarantorDetails', i, 'provinceTemporary']).patchValue(this.form.get(['guarantorDetails', i, 'province']).value);
            // tslint:disable-next-line:max-line-length
            this.form.get(['guarantorDetails', i, 'districtTemporary']).patchValue(this.form.get(['guarantorDetails', i, 'district']).value);
            this.form.get(['guarantorDetails', i, 'municipalitiesTemporary'])
                .patchValue(this.form.get(['guarantorDetails', i, 'municipalities']).value);
            this.getMunicipalitiesTemporary(this.form.get(['guarantorDetails', i, 'district']).value, i);
            this.getDistrictTemporary(this.form.get(['guarantorDetails', i, 'province']).value, i);
            // tslint:disable-next-line:max-line-length
            this.form.get(['guarantorDetails', i, 'wardNumberTemporary']).patchValue(this.form.get(['guarantorDetails', i, 'wardNumber']).value);
            this.form.get(['guarantorDetails', i, 'temporaryAddressLineOne'])
                .patchValue(this.form.get(['guarantorDetails', i, 'permanentAddressLineOne']).value);
            this.form.get(['guarantorDetails', i, 'temporaryAddressLineTwo'])
                .patchValue(this.form.get(['guarantorDetails', i, 'permanentAddressLineTwo']).value);
            this.sameAsCurrentChecked = event;
        } else {
            this.resetValue(i);
            this.sameAsCurrentChecked = event;
        }
        if (ObjectUtil.isEmpty(this.form.get(['guarantorDetails', i, 'municipalities']).value)) {
            this.toastService.show(new Alert(AlertType.WARNING, 'Please fill Permanent Address Completely'));
            return;
        }
    }
    resetValue(index)  {
        this.form.get(['guarantorDetails', index, 'provinceTemporary']).patchValue(null);
        this.form.get(['guarantorDetails', index, 'districtTemporary']).patchValue(null);
        this.form.get(['guarantorDetails', index, 'municipalitiesTemporary']).patchValue(null);
        this.form.get(['guarantorDetails', index, 'temporaryAddressLineOne']).patchValue(null);
        this.form.get(['guarantorDetails', index, 'temporaryAddressLineTwo']).patchValue(null);
        this.form.get(['guarantorDetails', index, 'wardNumberTemporary']).patchValue(null);
    }

}
