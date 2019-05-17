import { TestBed } from '@angular/core/testing';

import { MemoDataService } from './memo-data.service';

describe('MemoDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemoDataService = TestBed.get(MemoDataService);
    expect(service).toBeTruthy();
  });
});
