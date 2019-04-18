import {District} from './district';
import {Province} from './province';


export class Branch {
    id: number;
    name: string;
    branchCode: string;
    address: string;
    created: string;
    lastModified: string;
    district:District=new District();
    province:Province=new Province();
    streetName: string;
    wardNumber: string;
}