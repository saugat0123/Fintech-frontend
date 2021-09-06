import {Injectable} from '@angular/core';
import {ApiConfig} from '../utils/api/ApiConfig';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils/lib/index';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {saveAs as importedSaveAs} from 'file-saver';
import {ToastService} from '../utils';
import {ObjectUtil} from '../utils/ObjectUtil';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public SET_CLASS_NAME = 'far fa-file-pdf fa-1x text-danger';

  constructor(private toastService: ToastService) {
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

  public downloadAll(documentUrls: string[], fileName: string): void {
    if (ObjectUtil.isEmpty(fileName)) {
      fileName = 'allDocument';
    }
    const zip = new JSZip();
    let count = 0;
    const zipFilename = fileName + '.zip';
    const urls = [];
    if (documentUrls.length > 0) {
      documentUrls.map(d => {
        d = ApiConfig.URL + '/' + d;
        urls.push(d);
      });

      urls.forEach((url: string) => {
        const pathToZipFrom = new URL(url).pathname;
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, (err, data) => {
          if (err) {
            throw err; // or handle the error
          }
          zip.file(pathToZipFrom, data, {binary: true});
          count++;
          if (count === urls.length) {
            zip.generateAsync({type: 'blob'}).then(content => {
              importedSaveAs(content, zipFilename);
            });
          }
        });
      });
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Files has been downloaded!'));
    } else {
      this.toastService.show(new Alert(AlertType.ERROR, 'No file found!!!'));
    }
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
