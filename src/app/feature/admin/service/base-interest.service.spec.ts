import { TestBed } from '@angular/core/testing';

import { BaseInterestService } from './base-interest.service';

describe('BaseInterestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseInterestService = TestBed.get(BaseInterestService);
    expect(service).toBeTruthy();
  });
});
