import {BaseEntity} from '../../../../../@core/model/base-entity';

export class SiteVisitDocument extends BaseEntity {
    docName: string;
    isPrintable: string;
    docPath: string;
    securityName: string;
    multipartFile: File;
}
