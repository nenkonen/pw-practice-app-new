import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from './movie.model';

const STORAGE_KEY = 'movie_list';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesSubject = new BehaviorSubject<Movie[]>(this.loadFromStorage());

  get movies$(): Observable<Movie[]> {
    return this.moviesSubject.asObservable();
  }

  getMovies(): Movie[] {
    return this.moviesSubject.value;
  }

  getMovieById(id: number): Movie | undefined {
    return this.moviesSubject.value.find(m => m.id === id);
  }

  addMovie(movie: Omit<Movie, 'id'>): void {
    const movies = this.getMovies();
    const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
    const newMovie: Movie = { ...movie, id: newId };
    const updated = [...movies, newMovie];
    this.saveAndEmit(updated);
  }

  updateMovie(id: number, movie: Omit<Movie, 'id'>): void {
    const movies = this.getMovies().map(m => m.id === id ? { ...movie, id } : m);
    this.saveAndEmit(movies);
  }

  deleteMovie(id: number): void {
    const movies = this.getMovies().filter(m => m.id !== id);
    this.saveAndEmit(movies);
  }

  private saveAndEmit(movies: Movie[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    } catch (e) {
      // storage full or unavailable – continue with in-memory list
    }
    this.moviesSubject.next(movies);
  }

  private loadFromStorage(): Movie[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
