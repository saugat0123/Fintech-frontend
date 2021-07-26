import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroCommonDetailComponent } from './micro-common-detail.component';

describe('MicroCommonDetailComponent', () => {
  let component: MicroCommonDetailComponent;
  let fixture: ComponentFixture<MicroCommonDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroCommonDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroCommonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
