import { TestBed } from '@angular/core/testing';

import { CombinedLoanService } from './combined-loan.service';

describe('CombinedLoanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CombinedLoanService = TestBed.get(CombinedLoanService);
    expect(service).toBeTruthy();
  });
});
