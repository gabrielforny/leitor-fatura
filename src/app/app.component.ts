// src/app/app.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { NgIf, JsonPipe } from '@angular/common';
import { FaturaService } from './services/fatura.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, JsonPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Leitor de Fatura CSV';
  progress = 0;
  loading = false;
  resultado: unknown = null;
  erro: string | null = null;
  form: FormGroup

  constructor(private fb: FormBuilder, private api: FaturaService) {
    this.form = this.fb.group({
      file: [null as File | null, [Validators.required]],
      agrupar: [false],
    });

  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.form.patchValue({ file });
    this.form.updateValueAndValidity();
  }

  enviar() {
    this.erro = null;
    this.resultado = null;
    if (this.form.invalid || !this.form.value.file) return;

    this.loading = true;
    this.progress = 0;

    this.api.enviarCsv(this.form.value.file!, !!this.form.value.agrupar)
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progress = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            this.loading = false;
            this.resultado = event.body;
          }
        },
        error: (err) => {
          this.loading = false;
          this.erro = err?.error?.message ?? 'Falha ao enviar CSV.';
        }
      });
  }

  resetar() {
    this.form.reset({ file: null, agrupar: false });
    this.resultado = null;
    this.erro = null;
    this.progress = 0;
  }
}
