import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadWorkFlowBaseComponent } from './cad-work-flow-base.component';

describe('CadWorkFlowBaseComponent', () => {
  let component: CadWorkFlowBaseComponent;
  let fixture: ComponentFixture<CadWorkFlowBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadWorkFlowBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadWorkFlowBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
