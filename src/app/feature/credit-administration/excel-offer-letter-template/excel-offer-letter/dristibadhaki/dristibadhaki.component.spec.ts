import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DristibadhakiComponent } from './dristibadhaki.component';

describe('DristibadhakiComponent', () => {
  let component: DristibadhakiComponent;
  let fixture: ComponentFixture<DristibadhakiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DristibadhakiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DristibadhakiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
