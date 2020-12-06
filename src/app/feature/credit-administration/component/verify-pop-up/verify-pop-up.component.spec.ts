import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPopUpComponent } from './verify-pop-up.component';

describe('VerifyPopUpComponent', () => {
  let component: VerifyPopUpComponent;
  let fixture: ComponentFixture<VerifyPopUpComponent>;

  beforeEach(async(() => {
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
