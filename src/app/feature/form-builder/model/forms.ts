import {BaseEntity} from '../../../@core/model/base-entity';
import {Status} from '../../../@core/Status';

export class Forms extends BaseEntity {
    title: string;
    config: string;
    status: Status;

}
