import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentLetterCompanyComponent } from './consent-letter-company.component';

describe('ConsentLetterCompanyComponent', () => {
  let component: ConsentLetterCompanyComponent;
  let fixture: ComponentFixture<ConsentLetterCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
