import {Province} from '../../admin/modal/province';
import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';

export class CollateralOwner {
    id: number;
    collateralOwnerName: string;
    collateralOwnerNameInEnglish: string;
    collateralOwnerDOB: string;
    collateralOwnerCitizenshipNo: string;
    collateralOwnerCitizenshipIssueDate: Date;
    collateralOwnerCitizenshipIssueDistrict: District;
    collateralOwnerGender: string;
    collateralOwnerRelationMedium: string;
    collateralOwnerFatherName: string;
    collateralOwnerMotherName: string;
    collateralOwnerGrandFatherName: string;
    collateralOwnerGrandMotherName: string;
    collateralOwnerSpouse: string;
    collateralOwnerPermanentProvince: Province;
    collateralOwnerPermanentDistrict: District;
    collateralOwnerPermanentMunicipalities: MunicipalityVdc;
    collateralOwnerPermanentWard: string;
}
