import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryAggrementCompanyComponent } from './supplementary-aggrement-company.component';

describe('SupplementaryAggrementCompanyComponent', () => {
  let component: SupplementaryAggrementCompanyComponent;
  let fixture: ComponentFixture<SupplementaryAggrementCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplementaryAggrementCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementaryAggrementCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
