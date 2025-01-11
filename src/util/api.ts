
export function success(data: any, headers: any = null) {
    return base_response(true, 200, data, null, headers)
}

export function error(message: String, headers: any = null) {
    return base_response(false, 400, null, message, headers)
}

function base_response(success: boolean, code: Number, data: any= null, message:  any = null, headers: any =null) {
    return {
        success,
        status: code, 
        message,
        data
    }
}