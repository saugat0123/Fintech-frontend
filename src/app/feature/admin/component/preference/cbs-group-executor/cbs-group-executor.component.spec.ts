import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsGroupExecutorComponent } from './cbs-group-executor.component';

describe('CbsGroupExecutorComponent', () => {
  let component: CbsGroupExecutorComponent;
  let fixture: ComponentFixture<CbsGroupExecutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbsGroupExecutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsGroupExecutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
