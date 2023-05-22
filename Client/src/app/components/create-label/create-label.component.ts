import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TaskService } from 'src/app/services/task/task.service';
import { Label } from 'src/app/models/label';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabelService } from 'src/app/services/label/label.service';
import { Form } from 'src/app/models/form';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['./create-label.component.scss']
})
export class CreateLabelComponent implements OnInit, Form {
  labelForm: FormGroup;
  color: string | undefined;

  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  @ViewChild('selector', { read: ElementRef }) select!: ElementRef<any>;

  @Output() newLabel = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  boardId: string | null = this.route.snapshot.paramMap.get('boardId');
  listId: string | null = this.route.snapshot.paramMap.get('listId');

  loading: boolean = false;
  private colors: string[] = [];

  constructor(private route: ActivatedRoute, private labelService: LabelService, private fb: FormBuilder) {
    this.labelForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(60)]],
    })
  }

  ngOnInit() {
    this.labelService.getColorsName().forEach((color: string) => {
      this.colors.push(color);
    })
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    this.inputs.forEach((input, index) => {
      const control = this.labelForm.controls[Object.keys(this.labelForm.controls)[index]];

      if (control.errors) {
        this.onError(input);
        errors = true;
      }
    })

    if (!this.color) {
      errors = true;
      this.onError(this.select);
    }

    return errors;
  }

  resetErrors(): void {
    this.inputs.forEach((input) => input.nativeElement.style.boxShadow = 'none');
    this.select.nativeElement.style.boxShadow = 'none';
  }

  onError(element: ElementRef<any>): void {
    element.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  selectColor(i: number) {
    if (i < this.colors.length) this.color = this.colors[i];
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    console.log('name:', this.labelForm.value.name, 'description:', this.labelForm.value.description, 'color:', this.color);
    this.resetErrors();
    if (this.checkErrors()) return;

    let name: string = this.labelForm.value.name;
    let description: string = this.labelForm.value.description ? this.labelForm.value.description : '';
    let color: string = this.color ? this.color : '';

    this.createLabel(name, description, color);
  }

  private createLabel(name: string, description: string, color: string) {
    console.log('boardId:', this.boardId, 'listId:', this.listId);
    if (!this.boardId || !this.listId) return;
    console.log('creating new label...');
    this.loading = true;
    this.labelService.createLabel(this.boardId, this.listId, { name: name, description: description, color: color }).then(
      (label: Label) => {
        this.newLabel.emit();
        this.close.emit();
      }
    )
  }
}