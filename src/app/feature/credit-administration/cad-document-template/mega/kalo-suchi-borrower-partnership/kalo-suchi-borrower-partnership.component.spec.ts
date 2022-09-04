import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerPartnershipComponent } from './kalo-suchi-borrower-partnership.component';

describe('KaloSuchiBorrowerPartnershipComponent', () => {
  let component: KaloSuchiBorrowerPartnershipComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
