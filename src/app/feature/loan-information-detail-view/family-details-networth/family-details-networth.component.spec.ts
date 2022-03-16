import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDetailsNetworthComponent } from './family-details-networth.component';

describe('FamilyDetailsNetworthComponent', () => {
  let component: FamilyDetailsNetworthComponent;
  let fixture: ComponentFixture<FamilyDetailsNetworthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyDetailsNetworthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDetailsNetworthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
