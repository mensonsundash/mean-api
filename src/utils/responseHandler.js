export function CreateError(status, message) {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
}

export function CreateSuccess(statusCode, successMessage, data) {
    const successObj = {
        status: statusCode,
        message: successMessage,
        data: data
    }
    return successObj;
}