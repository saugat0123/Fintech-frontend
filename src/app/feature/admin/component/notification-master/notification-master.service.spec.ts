import { TestBed } from '@angular/core/testing';

import { NotificationMasterService } from './notification-master.service';

describe('NotificationMasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationMasterService = TestBed.get(NotificationMasterService);
    expect(service).toBeTruthy();
  });
});
