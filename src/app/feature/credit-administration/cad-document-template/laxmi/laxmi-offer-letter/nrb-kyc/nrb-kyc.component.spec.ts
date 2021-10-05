import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrbKycComponent } from './nrb-kyc.component';

describe('NrbKycComponent', () => {
  let component: NrbKycComponent;
  let fixture: ComponentFixture<NrbKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NrbKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrbKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
