import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroCrgParamsComponent } from './micro-crg-params.component';

describe('MicroCrgParamsComponent', () => {
  let component: MicroCrgParamsComponent;
  let fixture: ComponentFixture<MicroCrgParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroCrgParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroCrgParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
