import { TestBed } from '@angular/core/testing';

import { CbsGroupService } from './cbs-group.service';

describe('CbsGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CbsGroupService = TestBed.get(CbsGroupService);
    expect(service).toBeTruthy();
  });
});
