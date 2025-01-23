import { User } from "@model";
import { DeviceLoginRequest } from "@request";
import { Service } from "typedi";

@Service()
export class AuthService {
  constructor() {}
  async deviceLogin(request: DeviceLoginRequest) {
    const { device_id } = request;
    const user = await User.findOneAndUpdate({ device_id }, { $set: { device_id } }, { upsert: true, new: true }).lean();
    return user;
  }
}
