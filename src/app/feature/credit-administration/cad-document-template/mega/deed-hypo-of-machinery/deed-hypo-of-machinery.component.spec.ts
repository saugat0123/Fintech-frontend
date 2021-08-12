import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeedHypoOfMachineryComponent } from './deed-hypo-of-machinery.component';

describe('DeedHypoOfMachineryComponent', () => {
  let component: DeedHypoOfMachineryComponent;
  let fixture: ComponentFixture<DeedHypoOfMachineryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeedHypoOfMachineryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeedHypoOfMachineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
