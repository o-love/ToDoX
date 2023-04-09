import { ElementRef } from "@angular/core";

export interface Form {
    checkErrors(): boolean;
    resetErrors(): void;
    onError(label: ElementRef): void;
    onFocus(event: any, label: any): void;
    onBlur(event: any, label: any): void;
    goBack(): void;
}