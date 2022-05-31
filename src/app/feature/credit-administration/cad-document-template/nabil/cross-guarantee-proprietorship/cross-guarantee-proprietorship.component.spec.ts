import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossGuaranteeProprietorshipComponent } from './cross-guarantee-proprietorship.component';

describe('CrossGuaranteeProprietorshipComponent', () => {
  let component: CrossGuaranteeProprietorshipComponent;
  let fixture: ComponentFixture<CrossGuaranteeProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossGuaranteeProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossGuaranteeProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
