import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }

        const object = plainToInstance(metadata.metatype, value);
        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            const firstMessage = this.extractFirstError(errors);
            throw new BadRequestException({
                code: 0,
                message: firstMessage,
            });
        }

        return object;
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private extractFirstError(errors: ValidationError[]): string {
        for (const error of errors) {
            // Check for direct constraints (normal property validation)
            if (error.constraints) {
                const messages = Object.values(error.constraints);
                if (messages.length > 0) {
                    return messages[0] as string;
                }
            }

            // Check for nested validations (e.g., @ValidateNested)
            if (error.children && error.children.length > 0) {
                const nestedMessage = this.extractFirstError(error.children);
                if (nestedMessage) {
                    return nestedMessage;
                }
            }
        }

        // Fallback if no constraints or nested errors found
        return 'Validation failed';
    }
}
