import { TestBed } from '@angular/core/testing';

import { MemoCommonService } from './memo-common.service';

describe('MemoCommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemoCommonService = TestBed.get(MemoCommonService);
    expect(service).toBeTruthy();
  });
});
