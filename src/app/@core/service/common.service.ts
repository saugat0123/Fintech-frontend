import {Injectable} from '@angular/core';
import {ApiConfig} from '../utils/api/ApiConfig';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    public SET_CLASS_NAME = 'far fa-file-pdf fa-1x text-danger';

    constructor() {
    }

    public openDocument(file) {
        let fileName = file;
        if (file !== null) {
            fileName = ApiConfig.URL + '/' + file;

            const link = document.createElement('a');
            link.href = fileName;
            link.target = '_blank';
            link.click();
        }
    }


    public download(url: string, name: string): void {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}`;
        link.download = name;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }
}
