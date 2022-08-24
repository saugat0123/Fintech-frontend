import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfSetOffCompanyComponent } from './letter-of-set-off-company.component';

describe('LetterOfSetOffCompanyComponent', () => {
  let component: LetterOfSetOffCompanyComponent;
  let fixture: ComponentFixture<LetterOfSetOffCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfSetOffCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfSetOffCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
