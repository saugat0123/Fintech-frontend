import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrgLongComponent } from './crg-long.component';

describe('CrgLongComponent', () => {
  let component: CrgLongComponent;
  let fixture: ComponentFixture<CrgLongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrgLongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrgLongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
