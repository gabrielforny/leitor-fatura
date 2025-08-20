import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FaturaService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) { }

  enviarCsv(file: File, agrupar: boolean): Observable<HttpEvent<unknown>> {
    const form = new FormData();
    form.append('File', file);
    form.append('Agrupar', String(agrupar));

    console.log('Chamando Backend....')
    const req = new HttpRequest('POST', `https://leitorfaturacsv-1.onrender.com/LeitorFaturaCsv`, form, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}