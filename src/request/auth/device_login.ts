import { IsNotEmpty, IsString } from "class-validator";

export class DeviceLoginRequest {
  @IsNotEmpty()
  @IsString()
  device_id: string;
}
