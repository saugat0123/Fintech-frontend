import {Collateral} from './collateral';
import {CollateralOwner} from './collateralOwner';

export class CollateralDetail {
    id: number;
    version: number;
    collateralList: Array<Collateral>;
    collateralOwnerList: Array<CollateralOwner>;
}
