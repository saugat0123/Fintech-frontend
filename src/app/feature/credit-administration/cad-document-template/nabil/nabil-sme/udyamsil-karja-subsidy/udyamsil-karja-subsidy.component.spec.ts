import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdyamsilKarjaSubsidyComponent } from './udyamsil-karja-subsidy.component';

describe('UdyamsilKarjaSubsidyComponent', () => {
  let component: UdyamsilKarjaSubsidyComponent;
  let fixture: ComponentFixture<UdyamsilKarjaSubsidyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdyamsilKarjaSubsidyComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdyamsilKarjaSubsidyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
