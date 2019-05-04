import {Sector} from './sector';


export class SubSector {
    id: number;
    created: Date;
    lastModified: Date;
    subSectorName: string;
    subSectorCode: string;
    sector: Sector;
}
