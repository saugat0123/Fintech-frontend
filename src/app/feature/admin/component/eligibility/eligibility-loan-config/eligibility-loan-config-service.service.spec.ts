import { TestBed } from '@angular/core/testing';

import { EligibilityLoanConfigService } from './eligibility-loan-config-service';

describe('EligibilityLoanConfigServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EligibilityLoanConfigService = TestBed.get(EligibilityLoanConfigService);
    expect(service).toBeTruthy();
  });
});
