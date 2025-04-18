import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";

export class CustomValidationPipe extends ValidationPipe {
  // Hataları oluştururken doğrudan bir BadRequestException fırlatıyoruz
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const messages = this.flattenValidationErrors(validationErrors);
      // Doğrudan özel bir hata fırlatıyoruz
      return new BadRequestException({
        errors: messages, // Hatayı özelleştiriyoruz
        message: "Validation failed",
        statusCode: 400,
      });
    };
  }

  // Hata mesajlarını düzleştirip, tek bir dizide topluyoruz.
  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    return validationErrors.map((error) =>
      Object.values(error.constraints).join(", "),
    );
  }
}
