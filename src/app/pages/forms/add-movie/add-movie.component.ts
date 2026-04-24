import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';

@Component({
  selector: 'ngx-add-movie',
  styleUrls: ['./add-movie.component.scss'],
  templateUrl: './add-movie.component.html',
})
export class AddMovieComponent implements OnInit {
  movieForm: FormGroup;
  submitted = false;
  printMode = false;
  editMode = false;
  editId: number | null = null;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        const movie = this.movieService.getMovieById(Number(id));
        if (movie) {
          this.editMode = true;
          this.editId = movie.id;
          this.movieForm.patchValue({
            title: movie.title,
            director: movie.director,
            genre: movie.genre,
            releaseYear: String(movie.releaseYear),
            duration: String(movie.duration),
            rating: movie.rating,
            language: movie.language,
            description: movie.description,
          });
        }
      }
    });
  }

  get f() {
    return this.movieForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.movieForm.valid) {
      const formVal = this.movieForm.value;
      const movieData = {
        title: formVal.title,
        director: formVal.director,
        genre: formVal.genre,
        releaseYear: Number(formVal.releaseYear),
        duration: Number(formVal.duration),
        rating: Number(formVal.rating),
        language: formVal.language,
        description: formVal.description,
      };

      if (this.editMode && this.editId !== null) {
        this.movieService.updateMovie(this.editId, movieData);
        this.successMessage = 'Movie updated successfully!';
      } else {
        this.movieService.addMovie(movieData);
        this.successMessage = 'Movie added successfully!';
      }
    }
  }

  onReset() {
    this.submitted = false;
    this.successMessage = '';
    this.movieForm.reset();
    if (this.editMode) {
      this.editMode = false;
      this.editId = null;
      this.router.navigate(['/pages/forms/add-movie']);
    }
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

  goToMovieList() {
    this.router.navigate(['/pages/forms/movie-list']);
  }
}
