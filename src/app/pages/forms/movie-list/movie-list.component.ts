import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

type SortField = 'title' | 'releaseYear' | 'rating';

@Component({
  selector: 'ngx-movie-list',
  styleUrls: ['./movie-list.component.scss'],
  templateUrl: './movie-list.component.html',
})
export class MovieListComponent implements OnInit, OnDestroy {
  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  pagedMovies: Movie[] = [];

  // Search & Filters
  searchText = '';
  filterGenre = '';
  filterLanguage = '';
  filterYear = '';

  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Documentary', 'Animation'];
  languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Bulgarian', 'Other'];

  // Sorting
  sortField: SortField = 'title';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  // Detail view
  selectedMovie: Movie | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private movieService: MovieService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.movieService.movies$
      .pipe(takeUntil(this.destroy$))
      .subscribe(movies => {
        this.allMovies = movies;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------- Search / Filter ----------

  applyFilters(): void {
    let result = [...this.allMovies];

    if (this.searchText.trim()) {
      const term = this.searchText.trim().toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(term));
    }
    if (this.filterGenre) {
      result = result.filter(m => m.genre === this.filterGenre);
    }
    if (this.filterLanguage) {
      result = result.filter(m => m.language === this.filterLanguage);
    }
    if (this.filterYear) {
      const year = Number(this.filterYear);
      if (!isNaN(year)) {
        result = result.filter(m => m.releaseYear === year);
      }
    }

    this.filteredMovies = this.sortMovies(result);
    this.currentPage = 1;
    this.paginate();
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterGenre = '';
    this.filterLanguage = '';
    this.filterYear = '';
    this.applyFilters();
  }

  // ---------- Sorting ----------

  toggleSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filteredMovies = this.sortMovies(this.filteredMovies);
    this.paginate();
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) return 'arrow-ios-downward-outline';
    return this.sortDirection === 'asc' ? 'arrow-upward-outline' : 'arrow-downward-outline';
  }

  private sortMovies(movies: Movie[]): Movie[] {
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return movies.sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];
      if (typeof valA === 'string') {
        return valA.localeCompare(valB as string) * dir;
      }
      return ((valA as number) - (valB as number)) * dir;
    });
  }

  // ---------- Pagination ----------

  paginate(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredMovies.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedMovies = this.filteredMovies.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  // ---------- CRUD Actions ----------

  editMovie(movie: Movie): void {
    this.router.navigate(['/pages/forms/add-movie'], { queryParams: { id: movie.id } });
  }

  deleteMovie(movie: Movie): void {
    if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      this.movieService.deleteMovie(movie.id);
    }
  }

  viewMovie(movie: Movie): void {
    this.selectedMovie = movie;
  }

  closeDetail(): void {
    this.selectedMovie = null;
  }

  goToAddMovie(): void {
    this.router.navigate(['/pages/forms/add-movie']);
  }
}
