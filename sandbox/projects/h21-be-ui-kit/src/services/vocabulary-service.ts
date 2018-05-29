import { Observable } from 'rxjs/index';
import { City } from '../dto/city';
import { Injectable } from '@angular/core'

@Injectable()
export abstract class VocabularyService {
	abstract getCities(pattern: string): Observable<City[]>;
}