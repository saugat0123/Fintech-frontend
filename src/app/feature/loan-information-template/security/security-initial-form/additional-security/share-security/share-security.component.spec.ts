import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSecurityComponent } from './share-security.component';

describe('ShareSecurityComponent', () => {
  let component: ShareSecurityComponent;
  let fixture: ComponentFixture<ShareSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
