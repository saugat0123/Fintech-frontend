import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationActionModelComponent } from './verification-action-model.component';

describe('VerificationActionModelComponent', () => {
  let component: VerificationActionModelComponent;
  let fixture: ComponentFixture<VerificationActionModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationActionModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationActionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
