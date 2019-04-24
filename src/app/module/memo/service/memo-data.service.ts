import {Injectable} from '@angular/core';
import {MemoType} from "../model/memoType";
import {Memo} from "../model/memo";

@Injectable({
    providedIn: 'root'
})
export class MemoDataService {

    isNewMemo: boolean = true;
    memoApi: string = "v1/memos";
    memoTypeApi: string = "v1/memos/types";

    memoType: MemoType = new MemoType();
    memo: Memo = new Memo();

    constructor() {
    }

    setMemoApi(memoApi: string) {
        this.memoApi = memoApi;
    }

    getMemoApi() {
        return this.memoApi;
    }

    setMemoTypeApi(memoTypeApi: string) {
        this.memoTypeApi = memoTypeApi;
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

    setMemo(memo: Memo) {
        this.memo = memo;
    }

    getMemo() {
        return this.memo;
    }
}
