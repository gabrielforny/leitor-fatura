import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaturaService {
  private readonly base = '/api'; 

  constructor(private http: HttpClient) { }

  enviarCsv(file: File, agrupar: boolean): Observable<HttpEvent<unknown>> {
    const form = new FormData();
    form.append('File', file);
    form.append('Agrupar', String(agrupar));

    const req = new HttpRequest('POST', `${this.base}/LeitorFaturaCsv`, form, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}