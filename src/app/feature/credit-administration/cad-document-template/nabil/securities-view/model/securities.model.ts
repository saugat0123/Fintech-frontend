/**
 * @author Paribartan Kalathoki
 */

export class Securities {
  securityOwnersName: string;
  securityOwnersNameCT: string;
  securityOwnersDistrict: {
    id: number;
    name: string;
    nepaliName: string;
  };
  securityOwnersDistrictCT: string;
  securityOwnersMunicipalityOrVdc: any;
  securityOwnersMunicipality: {
    id: number;
    name: string;
    nepaliName: string;
  };
  securityOwnersMunicipalityCT: string;
  securityOwnersWardNo: string;
  securityOwnersWardNoCT: string;
  securityOwnersSeatNo: string;
  securityOwnersSeatNoCT: string;
  securityOwnersKittaNo: number;
  securityOwnersKittaNoCT: string;
  securityOwnersLandArea: string;
  securityOwnersLandAreaCT: string;
}
