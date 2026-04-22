import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-add-movie',
  styleUrls: ['./add-movie.component.scss'],
  templateUrl: './add-movie.component.html',
})
export class AddMovieComponent {
  movieForm: FormGroup;
  submitted = false;
  printMode = false;

  constructor(private fb: FormBuilder) {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      director: ['', [Validators.required, Validators.minLength(2)]],
      genre: ['', [Validators.required]],
      releaseYear: ['', [Validators.required, Validators.min(1888), Validators.max(2030), Validators.pattern('^[0-9]{4}$')]],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(600), Validators.pattern('^[0-9]+$')]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      language: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  get f() {
    return this.movieForm.controls;
  }

  onSubmit() {
    this.submitted = true;
  }

  onReset() {
    this.submitted = false;
    this.movieForm.reset();
  }

  onPrint() {
    this.submitted = true;
    if (this.movieForm.valid) {
      this.printMode = true;
      setTimeout(() => {
        window.print();
        this.printMode = false;
      }, 200);
    }
  }
}
