import { TestBed } from '@angular/core/testing';

import { CreditMemoTypeService } from './credit-memo-type-service.';

describe('CreditMemoTypeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreditMemoTypeService = TestBed.get(CreditMemoTypeService);
    expect(service).toBeTruthy();
  });
});
