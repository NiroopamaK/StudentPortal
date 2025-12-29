import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadStudentsFromFileComponent } from './load-students-from-file.component';

describe('LoadStudentsFromFileComponent', () => {
  let component: LoadStudentsFromFileComponent;
  let fixture: ComponentFixture<LoadStudentsFromFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadStudentsFromFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadStudentsFromFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
