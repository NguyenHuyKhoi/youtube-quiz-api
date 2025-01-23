import { DeviceLoginRequest } from "@request";
import { success } from "@util";
import { Body, JsonController, Patch } from "routing-controllers";
import { AuthService } from "@service";
import { Service } from "typedi";

@Service()
@JsonController("/auth")
export class AuthController {
  constructor(private service: AuthService) {}

  @Patch("/device-login")
  async deviceLogin(@Body() request: DeviceLoginRequest) {
    return success(await this.service.deviceLogin(request));
  }
}
