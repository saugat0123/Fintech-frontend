import {Component, DoCheck} from '@angular/core';
import {Pageable} from '../../@core/service/baseservice/common-pageable';
import {CommonPageService} from '../../@core/service/baseservice/common-pagination-service';
import {CommonService} from '../../@core/service/baseservice/common-baseservice';
import {CommonDataService} from '../../@core/service/baseservice/common-dataService';


@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements DoCheck {
    spinner = false;
    search = new Object();

    dataList: any;
    pageable: Pageable = new Pageable();
    currentAPI: any;

    constructor(
        private dataService: CommonDataService,
        private commonPageService: CommonPageService, private commonService: CommonService) {
    }


    ngDoCheck(): void {
        if (this.dataService.getData() === undefined) {

        } else {
            this.search = this.dataService.getData();
        }

        this.pageable = this.commonPageService.getPageable();
        this.currentAPI = this.commonPageService.getCurrentApi();

    }

    loadPage(pageNumber: number) {

        this.spinner = true;
        this.commonService.getByPostAllPageable(this.currentAPI, this.search, pageNumber, 10).subscribe((response: any) => {
                this.dataList = response.detail.content;
                this.dataService.setDataList(this.dataList);
                this.pageable = this.commonPageService.setPageable(response.detail);

                this.spinner = false;
            }, error => {
                this.spinner = false;
                console.error(error);
            }
        );
    }

}
