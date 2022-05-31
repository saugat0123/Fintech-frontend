import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryAggrementPartnershipComponent } from './supplementary-aggrement-partnership.component';

describe('SupplementaryAggrementPartnershipComponent', () => {
  let component: SupplementaryAggrementPartnershipComponent;
  let fixture: ComponentFixture<SupplementaryAggrementPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplementaryAggrementPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementaryAggrementPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
