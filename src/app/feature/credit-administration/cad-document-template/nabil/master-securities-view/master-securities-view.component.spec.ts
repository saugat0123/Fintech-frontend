import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSecuritiesViewComponent } from './master-securities-view.component';

describe('MasterSecuritiesViewComponent', () => {
  let component: MasterSecuritiesViewComponent;
  let fixture: ComponentFixture<MasterSecuritiesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSecuritiesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSecuritiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
