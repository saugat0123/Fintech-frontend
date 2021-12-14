import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadOfferletterProfileComponent } from './cad-offerletter-profile.component';

describe('CadOfferletterProfileComponent', () => {
  let component: CadOfferletterProfileComponent;
  let fixture: ComponentFixture<CadOfferletterProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadOfferletterProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadOfferletterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
