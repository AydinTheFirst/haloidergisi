import { PartialType } from "@nestjs/mapped-types";

import { CreateCrewDto } from "./create-crew.dto";

export class UpdateCrewDto extends PartialType(CreateCrewDto) {}
