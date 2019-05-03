import {DomSanitizer} from "@angular/platform-browser";
import {Pipe} from "@angular/core";

@Pipe({name: 'safeHtml'})
export class SafePipe {
    constructor(private sanitizer:DomSanitizer){}

    transform(value: any, args?: any): any {
        return this.sanitizer.bypassSecurityTrustHtml(value);
        // return this.sanitizer.bypassSecurityTrustStyle(style);
        // return this.sanitizer.bypassSecurityTrustXxx(style);
    }
}