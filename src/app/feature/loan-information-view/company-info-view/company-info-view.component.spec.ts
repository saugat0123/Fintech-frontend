import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyInfoViewComponent } from './company-info-view.component';

describe('CompanyInfoViewComponent', () => {
  let component: CompanyInfoViewComponent;
  let fixture: ComponentFixture<CompanyInfoViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyInfoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
