import { Type } from "@nestjs/class-transformer";
import { IsDate, IsInt } from "class-validator";

export class CreateRentalDto {
    @Type(() => Date)
    @IsDate()
    rental_date: Date;

    @Type(() => Date)
    @IsDate()
    return_date: Date;

    @IsInt()
    customer_id: number
}
