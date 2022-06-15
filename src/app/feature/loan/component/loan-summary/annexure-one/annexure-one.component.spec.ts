import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexureOneComponent } from './annexure-one.component';

describe('AnnexureOneComponent', () => {
  let component: AnnexureOneComponent;
  let fixture: ComponentFixture<AnnexureOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnexureOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexureOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
