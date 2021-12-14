import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerifyPopUpComponent } from './verify-pop-up.component';

describe('VerifyPopUpComponent', () => {
  let component: VerifyPopUpComponent;
  let fixture: ComponentFixture<VerifyPopUpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
