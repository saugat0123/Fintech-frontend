import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSecondarySecuritiesViewComponent } from './master-secondary-securities-view.component';

describe('MasterSecondarySecuritiesViewComponent', () => {
  let component: MasterSecondarySecuritiesViewComponent;
  let fixture: ComponentFixture<MasterSecondarySecuritiesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSecondarySecuritiesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSecondarySecuritiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
