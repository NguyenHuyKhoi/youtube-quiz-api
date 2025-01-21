import mongoose, { Types } from "mongoose";

export function success(data: any, headers: any = null) {
  return base_response(true, 200, data, null, headers);
}

export function error(message: String, headers: any = null) {
  return base_response(false, 400, null, message, headers);
}

function base_response(success: boolean, code: Number, data: any = null, message: any = null, headers: any = null) {
  return {
    success,
    status: code,
    message,
    data: transform_data(data),
  };
}

export function format_page(page: any) {
  return Number(page) < 1 || Number.isNaN(page) ? 1 : Number(page);
}

export function format_per_page(per_page: any) {
  if (isNaN(per_page) || Number(per_page) < 1 || Number(per_page) > 100) return Number(10);
  return Number(per_page);
}

export function paginate(data: any, total: number, per_page: number, current_page: number) {
  data = transform_data(data);
  let from = (current_page - 1) * per_page + 1;
  let to = current_page * per_page <= total ? current_page * per_page : total;
  if (from > to) from = to = 0;
  return {
    data: data,
    pagination: {
      total: total,
      per_page: per_page,
      current_page: current_page,
      last_page: Math.ceil(total / per_page),
      from: from,
      to: to,
    },
  };
}

function transform_data(data: any) {
  const dateColumns = ["created_at", "updated_at", "deleted_at", "deadline"];
  const allowedTypes = ["boolean", "number", "string", "bigint", "symbol", "undefined"];
  try {
    if (!data || allowedTypes.includes(typeof data)) {
      return data;
    }

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = transform_data(data[i]);
      }
    } else if (typeof data === "object") {
      if (data instanceof Types.ObjectId) {
        return { id: data.toJSON() };
      }

      for (const property in data) {
        if (property === "_id" && mongoose.Types.ObjectId.isValid(data["_id"])) {
          data["id"] = data["_id"].toString();
          delete data["_id"];
        } else if (dateColumns.includes(property)) {
          //   if (data[property]) data[property] = formatTimezone(data[property]);
        } else {
          data[property] = transform_data(data[property]);
        }
      }
    }

    return data;
  } catch (e) {
    console.log(e);
  }
}
