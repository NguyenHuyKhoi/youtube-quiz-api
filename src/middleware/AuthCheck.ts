import { User } from "@model";
import { MsgError, StatusCodes } from "@util";
import { Response } from "express";
import { createParamDecorator, ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
@Service()
export class AuthCheck implements ExpressMiddlewareInterface {
  async use(request: any, response: Response, next?: (err?: any) => any): Promise<any> {
    const auth_header = request.headers.authorization ? request.headers.authorization : "Unauthorized";
    const auth_items = auth_header.split(" ");
    if (!auth_items || auth_items.length < 2 || auth_items[0] != "Bearer") {
      return this.wrapRepsonse(response, MsgError.INVALID_TOKEN);
    }
    const token = auth_items[1];

    // TODO: Token is user_d
    var user: any = await User.findById({ _id: token }).lean();

    if (!user) {
      return this.wrapRepsonse(response, MsgError.USER_NOT_FOUND);
    }
    request.loggedUser = user;

    next ? next()?.then() : {};
  }

  private wrapRepsonse(res: Response, error: MsgError, status: StatusCodes = StatusCodes.UNAUTHORIZED) {
    return res.status(status).send({
      success: false,
      status,
      message: error,
    });
  }
}

export function LoggedUser() {
  return createParamDecorator({
    value: (action) => {
      return action.request.loggedUser;
    },
  });
}

export interface ILoggedUser {
  _id: string;
  device_id: string;
}
