import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerosnalOverdraftWithoutCollateralTemplateDataComponent } from './perosnal-overdraft-without-collateral-template-data.component';

describe('PerosnalOverdraftWithoutCollateralTemplateDataComponent', () => {
  let component: PerosnalOverdraftWithoutCollateralTemplateDataComponent;
  let fixture: ComponentFixture<PerosnalOverdraftWithoutCollateralTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerosnalOverdraftWithoutCollateralTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerosnalOverdraftWithoutCollateralTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
