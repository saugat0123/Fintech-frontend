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
import {Occupation} from '../../admin/modal/occupation';
import {EnumUtils} from '../../../@core/utils/enums.utils';
import {Gender} from '../../../@core/model/enum/gender';
import {ShareGuarantorJson} from '../../admin/modal/shareGuarantorJson';
import {RoleService} from '../../admin/component/role-permission/role.service';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {DesignationList} from '../../loan/model/designationList';
import {Editor} from '../../../@core/utils/constants/editor';

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
  @Input() customerInfo: CustomerInfoData;

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
  checkSameAddress = false;
  genderPairs = EnumUtils.pairs(Gender);
  jsonData: any;
  question = ['Yes', 'No'];
  designationList = [];
  spinner = false;
  designation;
  designationLists: DesignationList = new DesignationList();

  ckeConfig = Editor.CK_CONFIG;

  constructor(
      private formBuilder: FormBuilder,
      private addressServices: AddressService,
      private toastService: ToastService,
      private blackListService: BlacklistService,
      private roleService: RoleService,
  ) {
  }

  ngOnInit() {
    this.designation = this.designationLists.designation;
    this.buildForm();
    this.getProvince();
    this.getAllDistrict();
    this.getRoleList();
    this.relationList = this.relationshipList.relation;
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
        this.jsonData = JSON.parse(v.guarantorJson);
        this.setJsonData(this.jsonData, index);
        this.legalChange(v.consentOfLegalHeirs, index);
        this.checkSameAddress = v.checkSameAddress;
        const promoterData = JSON.parse(v.promoterData);
        if (!ObjectUtil.isEmpty(promoterData)) {
          promoterData.background.forEach(d => {
            this.addBackground(index, d);
          });
          promoterData.familyDetails.forEach(d => {
            this.addFamily(index, d);
          });
        }
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
     /* background: [ObjectUtil.setUndefinedIfNull(data.background)],
      successionPlanning: [ObjectUtil.setUndefinedIfNull(data.successionPlanning)],*/
      guarantorLegalDocumentAddress: [ObjectUtil.setUndefinedIfNull(data.guarantorLegalDocumentAddress)],
      checkSameAddress: [ObjectUtil.isEmpty(data.checkSameAddress) ? false : data.checkSameAddress],
      passNumber: [undefined],
      // passIssueDate: [
      //   ObjectUtil.isEmpty(data.guarantorJson) ? undefined : new Date(data.guarantorJson), Validators.required,
      // ],
      passIssueDate: [undefined],
      passIssuedPlace: [undefined],
      panNumber: [undefined],
      // panIssueDate: [
      //   ObjectUtil.isEmpty(data.issuedYear) ? undefined : new Date(data.issuedYear), Validators.required,
      // ],
      panIssueDate: [undefined],
      panIssuedPlace: [undefined],
      nationality: [undefined],
      email: [undefined],
      shareHolding: [undefined],
      managementTeam: [undefined],
      managementDesignation: [undefined],
      boardDirector: [undefined],
      sharePercent: [undefined],
      bodNumber: [undefined],
      bodFemaleDirector: [undefined],
      marginalisedDirector: [undefined],
      femaleMarDirector: [undefined],

      // legal
      legalStatus: [undefined],
      registrationNumber: [undefined],
      // issuedYear: [
      //   ObjectUtil.isEmpty(data.issuedYear) ? undefined : new Date(data.issuedYear), Validators.required,
      // ],
      registrationDate: [undefined],
      registrationWith: [undefined],
      groupName: [undefined],
      guarantorType: [ObjectUtil.isEmpty(data.guarantorType) ? undefined : data.guarantorType],
      promoterData: this.formBuilder.group({
        background: this.formBuilder.array([]),
        familyDetails: this.formBuilder.array([])
      }),
      // groupBackground: [ObjectUtil.isEmpty(data.groupBackground) ? undefined : data.groupBackground]
    });
  }

  addBackground(i: number, data ?) {
    ((this.form.get(['guarantorDetails', i, 'promoterData']) as FormGroup).get('background') as FormArray).push(this.formBuilder.group({
      previousAssociations: [data ? data.previousAssociations : undefined],
      natureOfBusiness: [data ? data.natureOfBusiness : undefined],
      capacity: [data ? data.capacity : undefined],
      tenure: [data ? new Date(data.tenure) : undefined],
    }));
  }

  removeBackground(i: number, j: number) {
    ((this.form.get(['guarantorDetails', i, 'promoterData']) as FormGroup).get('background') as FormArray).removeAt(j);
  }
  addFamily(i: number, data ?) {
    ((this.form.get(['guarantorDetails', i, 'promoterData']) as FormGroup).get('familyDetails') as FormArray).push(this.formBuilder.group({
      name: [data ? data.name : undefined],
      relation: [data ? data.relation : undefined],
      age: [data ? data.age : undefined],
      profession: [data ? data.profession : undefined],
    }));
  }

  removeFamily(i: number, j: number) {
    ((this.form.get(['guarantorDetails', i, 'promoterData']) as FormGroup).get('familyDetails') as FormArray).removeAt(j);
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
      console.log('invalid', this.form);
      return;
    }
    if (!ObjectUtil.isEmpty(this.guarantorDetailValue)) {
      this.guarantorDetail = this.guarantorDetailValue;
    }
    this.guarantorDetail.guarantorList = new Array<Guarantor>();
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray['controls'].forEach(c => {
      const guarantor: Guarantor = c.value;
      guarantor.promoterData = JSON.stringify(c.get('promoterData').value);
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
      const submitData = new ShareGuarantorJson();
      Object.keys(submitData).forEach((k) => {
        submitData[k] = this.form.value[k];
      });
      submitData.passNumber = c.get('passNumber').value;
      submitData.passIssueDate = c.get('passIssueDate').value;
      submitData.passIssuedPlace = c.get('passIssuedPlace').value;
      submitData.panNumber = c.get('panNumber').value;
      submitData.panIssueDate = c.get('panIssueDate').value;
      submitData.panIssuedPlace = c.get('panIssuedPlace').value;
      submitData.nationality = c.get('nationality').value;
      submitData.email = c.get('email').value;
      submitData.shareHolding = c.get('shareHolding').value;
      submitData.managementTeam = c.get('managementTeam').value;
      submitData.managementDesignation = c.get('managementDesignation').value;
      submitData.boardDirector = c.get('boardDirector').value;
      submitData.sharePercent = c.get('sharePercent').value;
      submitData.bodNumber = c.get('bodNumber').value;
      submitData.bodFemaleDirector = c.get('bodFemaleDirector').value;
      submitData.marginalisedDirector = c.get('marginalisedDirector').value;
      submitData.femaleMarDirector = c.get('femaleMarDirector').value;
      submitData.registrationNumber = c.get('registrationNumber').value;
      submitData.registrationDate = c.get('registrationDate').value;
      submitData.registrationWith = c.get('registrationWith').value;
      submitData.groupName = c.get('groupName').value;
      // guarantor.guarantorJson = submitData;
      guarantor.guarantorJson = JSON.stringify(submitData);
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
            // this.form.get(['guarantorDetails', i, 'successionPlanning']).patchValue(this.form.get(['guarantorDetails', i, 'successionPlanning']).value);
            this.form.get(['guarantorDetails', i, 'temporaryAddressLineOne'])
                .patchValue(this.form.get(['guarantorDetails', i, 'permanentAddressLineOne']).value);
            this.form.get(['guarantorDetails', i, 'temporaryAddressLineTwo'])
                .patchValue(this.form.get(['guarantorDetails', i, 'permanentAddressLineTwo']).value);
            this.checkSameAddress = event;
        } else {
            this.resetValue(i);
            this.checkSameAddress = event;
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

  setJsonData(data, index: number) {
    this.form.get(['guarantorDetails', index, 'passNumber']).patchValue(data.passNumber);
    this.form.get(['guarantorDetails', index, 'passIssueDate'])
        .patchValue(ObjectUtil.isEmpty(data.passIssueDate) ? undefined : new Date(data.passIssueDate));
    this.form.get(['guarantorDetails', index, 'passIssuedPlace']).patchValue(data.passIssuedPlace);
    this.form.get(['guarantorDetails', index, 'panNumber']).patchValue(data.panNumber);
    this.form.get(['guarantorDetails', index, 'panIssueDate'])
        .patchValue(ObjectUtil.isEmpty(data.panIssueDate) ? undefined : new Date(data.panIssueDate));
    this.form.get(['guarantorDetails', index, 'panIssuedPlace']).patchValue(data.panIssuedPlace);
    this.form.get(['guarantorDetails', index, 'nationality']).patchValue(data.nationality);
    this.form.get(['guarantorDetails', index, 'email']).patchValue(data.email);
    this.form.get(['guarantorDetails', index, 'shareHolding']).patchValue(data.shareHolding);
    this.form.get(['guarantorDetails', index, 'managementTeam']).patchValue(data.managementTeam);
    this.form.get(['guarantorDetails', index, 'managementDesignation']).patchValue(data.managementDesignation);
    this.form.get(['guarantorDetails', index, 'boardDirector']).patchValue(data.boardDirector);
    this.form.get(['guarantorDetails', index, 'sharePercent']).patchValue(data.sharePercent);
    this.form.get(['guarantorDetails', index, 'bodNumber']).patchValue(data.bodNumber);
    this.form.get(['guarantorDetails', index, 'bodFemaleDirector']).patchValue(data.bodFemaleDirector);
    this.form.get(['guarantorDetails', index, 'marginalisedDirector']).patchValue(data.marginalisedDirector);
    this.form.get(['guarantorDetails', index, 'femaleMarDirector']).patchValue(data.femaleMarDirector);
    this.form.get(['guarantorDetails', index, 'registrationNumber']).patchValue(data.registrationNumber);
    this.form.get(['guarantorDetails', index, 'registrationDate'])
        .patchValue(ObjectUtil.isEmpty(data.registrationDate) ? undefined : new Date(data.registrationDate));
    this.form.get(['guarantorDetails', index, 'registrationWith']).patchValue(data.registrationWith);
    this.form.get(['guarantorDetails', index, 'groupName']).patchValue(data.groupName);
  }

  getRoleList() {
    this.spinner = true;
    this.roleService.getAll().subscribe(res => {
      this.spinner = false;
      this.designationList = res.detail;
    }, error => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
    });
  }

  legalChange(checked, i: number) {
    if (checked) {
      this.form.get(['guarantorDetails', i, 'citizenNumber']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'issuedYear']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'issuedPlace']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'passNumber']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'passIssueDate']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'passIssuedPlace']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'dateOfBirth']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'fatherName']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'grandFatherName']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'motherName']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'spouseName']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'fatherInLaw']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'nationality']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'managementTeam']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'managementDesignation']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'boardDirector']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'bodNumber']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'bodFemaleDirector']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'marginalisedDirector']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'femaleMarDirector']).patchValue(null);
    } else {
      this.form.get(['guarantorDetails', i, 'registrationNumber']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'registrationDate']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'registrationWith']).patchValue(null);
      this.form.get(['guarantorDetails', i, 'groupName']).patchValue(null);
    }
    this.clearValidation(checked, i);
  }

  clearValidation(checked, i) {
    if (checked) {
      this.form.get(['guarantorDetails', i, 'citizenNumber']).clearValidators();
      this.form.get(['guarantorDetails', i, 'issuedYear']).clearValidators();
      this.form.get(['guarantorDetails', i, 'issuedPlace']).clearValidators();
      this.form.get(['guarantorDetails', i, 'dateOfBirth']).clearValidators();
      this.form.get(['guarantorDetails', i, 'fatherName']).clearValidators();
      this.form.get(['guarantorDetails', i, 'grandFatherName']).clearValidators();
    } else {
      this.form.get(['guarantorDetails', i, 'citizenNumber']).setValidators(Validators.required);
      this.form.get(['guarantorDetails', i, 'issuedYear']).setValidators(Validators.required);
      this.form.get(['guarantorDetails', i, 'issuedPlace']).setValidators(Validators.required);
      this.form.get(['guarantorDetails', i, 'dateOfBirth']).setValidators(Validators.required);
      this.form.get(['guarantorDetails', i, 'fatherName']).setValidators(Validators.required);
      this.form.get(['guarantorDetails', i, 'grandFatherName']).setValidators(Validators.required);
    }
    this.form.get(['guarantorDetails', i, 'citizenNumber']).updateValueAndValidity();
    this.form.get(['guarantorDetails', i, 'issuedYear']).updateValueAndValidity();
    this.form.get(['guarantorDetails', i, 'issuedPlace']).updateValueAndValidity();
    this.form.get(['guarantorDetails', i, 'dateOfBirth']).updateValueAndValidity();
    this.form.get(['guarantorDetails', i, 'fatherName']).updateValueAndValidity();
    this.form.get(['guarantorDetails', i, 'grandFatherName']).updateValueAndValidity();
  }
}
