import { TestBed } from '@angular/core/testing';

import { CoreCapitalService } from './core-capital.service';

describe('CoreCapitalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreCapitalService = TestBed.get(CoreCapitalService);
    expect(service).toBeTruthy();
  });
});
