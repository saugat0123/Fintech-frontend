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
            fileName = `${ApiConfig.URL}/${file}?${Math.floor(Math.random() * 100) + 1}`;

            const link = document.createElement('a');
            link.href = fileName;
            link.target = '_blank';
            link.click();
        }
    }


    public download(url: string, name: string): void {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.download = name;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

   public getDifferenceInDays(createdDate: Date): number {
        const createdAt = new Date(createdDate);
        const current = new Date();
        return Math.floor((Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) -
            Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) / (1000 * 60 * 60 * 24));
    }

    public getDaysDifference(lastModifiedDate: Date, createdDate: Date): number {
        const createdAt = new Date(createdDate);
        const lastModifiedAt = new Date(lastModifiedDate);
        return Math.floor((Date.UTC(lastModifiedAt.getFullYear(), lastModifiedAt.getMonth(), lastModifiedAt.getDate()) -
            Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) / (1000 * 60 * 60 * 24));
    }
}
