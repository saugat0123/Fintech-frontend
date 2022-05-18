import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporationGuaranteeComponent } from './corporation-guarantee.component';

describe('CorporationGuaranteeComponent', () => {
  let component: CorporationGuaranteeComponent;
  let fixture: ComponentFixture<CorporationGuaranteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporationGuaranteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporationGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
