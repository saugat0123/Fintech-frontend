import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveSpecialCovenantsComponent } from './above-special-covenants.component';

describe('AboveSpecialCovenantsComponent', () => {
  let component: AboveSpecialCovenantsComponent;
  let fixture: ComponentFixture<AboveSpecialCovenantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveSpecialCovenantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveSpecialCovenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
