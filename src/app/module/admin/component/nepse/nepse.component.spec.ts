import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepseComponent } from './nepse.component';

describe('NepseComponent', () => {
  let component: NepseComponent;
  let fixture: ComponentFixture<NepseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
