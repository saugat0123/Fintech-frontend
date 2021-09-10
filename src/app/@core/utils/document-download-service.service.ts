import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import {LocalStorageUtil} from './local-storage-util';
import {ApiConfig} from './api/ApiConfig';
import * as JSZipUtils from 'jszip-utils/lib/index';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {saveAs as importedSaveAs} from 'file-saver';
import {ToastService} from './ToastService';

@Injectable({
  providedIn: 'root'
})
export class DocumentDownloadServiceService {

  constructor( private toastService: ToastService) { }

   downloadAllInZip(documentUrls: string[], targetFileName: string): void {
    const zip = new JSZip();
    let count = 0;
    const zipFilename = LocalStorageUtil.getStorage().userFullName + 'zip';
    const urls = [];
    if (documentUrls.length > 0) {
      documentUrls.map(d => {
        d = ApiConfig.URL + '/' + d;
        urls.push(d);
      });

      urls.forEach((url: string) => {
        // full path of document
        const pathToZipFrom = new URL(url).pathname;
        // loading multiple file data and pushing
       try {
           JSZipUtils.getBinaryContent(url, (err, data) => {
               if (err) {
                   throw err; // or handle the error
               }
               // extracting files name only from url
               const filenameWithExtension = pathToZipFrom.replace(/^.*[\\\/]/, '');
               zip.file(filenameWithExtension, data, {binary: true}).folder('');
               count++;
               if (count === urls.length) {
                   zip.generateAsync({type: 'blob'}).then(content => {
                       importedSaveAs(content, targetFileName);
                   });
               }
           });
       } catch (err) {
           console.error(err);
           this.toastService.show(new Alert(AlertType.SUCCESS, 'File Not Found in Server'));
       }
      });
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Files has been downloaded!'));
    } else {
      this.toastService.show(new Alert(AlertType.ERROR, 'No file found!!!'));
    }
  }
}
