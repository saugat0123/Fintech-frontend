import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LetterOfInstallmentsComponent} from './letter-of-installments.component';

describe('LetterOfInstallmentsComponent', () => {
  let component: LetterOfInstallmentsComponent;
  let fixture: ComponentFixture<LetterOfInstallmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfInstallmentsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfInstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
