import {Pageable} from '../service/baseservice/common-pageable';

export class PaginationUtils {
    public static getPageable(res: any): Pageable {

        console.log(res);
        const page = new Pageable();
        page.first = res.first;
        page.last = res.last;
        page.number = res.number;
        page.numberOfElements = res.numberOfElements;
        page.totalPages = res.totalPages;
        page.size = res.size;
        page.totalElements = res.totalElements;

        page.number = res.number + 1;

        return page;
    }
}
