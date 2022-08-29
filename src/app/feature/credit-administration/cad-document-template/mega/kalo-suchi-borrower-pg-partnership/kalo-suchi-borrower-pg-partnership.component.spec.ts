import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerPgPartnershipComponent } from './kalo-suchi-borrower-pg-partnership.component';

describe('KaloSuchiBorrowerPgPartnershipComponent', () => {
  let component: KaloSuchiBorrowerPgPartnershipComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerPgPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerPgPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerPgPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
