import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfInstallmentsComponent } from './letter-of-installments.component';

describe('LetterOfInstallmentsComponent', () => {
  let component: LetterOfInstallmentsComponent;
  let fixture: ComponentFixture<LetterOfInstallmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfInstallmentsComponent ]
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
