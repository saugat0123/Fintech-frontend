import {Injectable} from '@angular/core';
import {MemoType} from '../model/memoType';
import {Memo} from '../model/memo';

@Injectable({
    providedIn: 'root'
})
export class MemoDataService {

    memoApi = 'v1/memos';
    memoTypeApi = 'v1/memos/types';
    deleteApi: string;

    memoType: MemoType = new MemoType();
    memo: Memo = new Memo();

    constructor() {
    }

    getMemoApi() {
        return this.memoApi;
    }

    getMemoTypeApi() {
        return this.memoTypeApi;
    }

    setMemoType(memoType: MemoType) {
        this.memoType = memoType;
    }

    getMemoType() {
        return this.memoType;
    }

    clearMemoType() {
        this.memoType = new MemoType();
    }

    setMemo(memo: Memo) {
        this.memo = memo;
    }

    getMemo() {
        return this.memo;
    }

    clearMemo() {
        this.memo = new Memo();
    }

    setDeleteApi(deleteApi: string) {
        this.deleteApi = deleteApi;
    }

    getDeleteApi() {
        return this.deleteApi;
    }

    clearDeleteApi() {
        this.deleteApi = '';
    }

    clearAll() {
        this.clearMemo();
        this.clearMemoType();
        this.clearDeleteApi();
    }
}
