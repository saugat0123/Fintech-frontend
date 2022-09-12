import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveFiftyComponent } from './above-fifty.component';

describe('AboveFiftyComponent', () => {
  let component: AboveFiftyComponent;
  let fixture: ComponentFixture<AboveFiftyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveFiftyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveFiftyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
