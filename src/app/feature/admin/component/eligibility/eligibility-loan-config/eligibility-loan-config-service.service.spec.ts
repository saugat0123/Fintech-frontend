import { TestBed } from '@angular/core/testing';

import { EligibilityLoanConfigServiceService } from './eligibility-loan-config-service.service';

describe('EligibilityLoanConfigServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EligibilityLoanConfigServiceService = TestBed.get(EligibilityLoanConfigServiceService);
    expect(service).toBeTruthy();
  });
});
