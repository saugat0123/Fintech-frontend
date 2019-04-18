import {Province} from './province';
import {MunicipalityVdc} from './municipality_VDC';

export class District {
    id: number;
    name: string;
    province: Province;
    municipality:MunicipalityVdc[];
}
