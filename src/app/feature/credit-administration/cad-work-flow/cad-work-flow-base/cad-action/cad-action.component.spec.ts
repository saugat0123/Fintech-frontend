import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadActionComponent } from './cad-action.component';

describe('CadActionComponent', () => {
  let component: CadActionComponent;
  let fixture: ComponentFixture<CadActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
