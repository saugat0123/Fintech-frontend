import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroOtherInfoAndConfirmationComponent } from './micro-other-info-and-confirmation.component';

describe('MicroOtherInfoAndConfirmationComponent', () => {
  let component: MicroOtherInfoAndConfirmationComponent;
  let fixture: ComponentFixture<MicroOtherInfoAndConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroOtherInfoAndConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroOtherInfoAndConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
