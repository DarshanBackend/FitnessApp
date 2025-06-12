export const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
};

export const sendSuccessResponse = (res, message, data = []) => {
    return res.status(200).json({
        success: true,
        message,
        data: data || []
    });
};

export const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: []
    });
};

export const sendCreatedResponse = (res, message, data = []) => {
    return res.status(201).json({
        success: true,
        message,
        data: data || []
    });
};

export const sendNotFoundResponse = (res, message) => {
    return res.status(404).json({
        success: false,
        message,
        data: []
    });
};

export const sendBadRequestResponse = (res, message) => {
    return res.status(400).json({
        success: false,
        message,
        data: []
    });
};

export const sendUnauthorizedResponse = (res, message) => {
    return res.status(401).json({
        success: false,
        message,
        data: []
    });
};

export const sendForbiddenResponse = (res, message) => {
    return res.status(403).json({
        success: false,
        message,
        data: []
    });
}; 