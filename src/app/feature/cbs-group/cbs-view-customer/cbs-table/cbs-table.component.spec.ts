import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CbsTableComponent } from './cbs-table.component';

describe('CbsTableComponent', () => {
  let component: CbsTableComponent;
  let fixture: ComponentFixture<CbsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CbsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
