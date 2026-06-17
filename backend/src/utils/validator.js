const AppError =
    require("../errors/appError");

function validateRouterId(routerId) {

    if (!routerId) {

        throw new AppError(
            "Router ID is required",
            400
        );

    }

}

function validateCost(cost) {

    if (
        typeof cost !== "number" ||
        cost <= 0
    ) {

        throw new AppError(
            "Link cost must be greater than 0",
            400
        );

    }

}

function validateLink(
    source,
    destination
) {

    if (
        !source ||
        !destination
    ) {

        throw new AppError(
            "Source and destination are required",
            400
        );

    }

    if (
        source === destination
    ) {

        throw new AppError(
            "Router cannot connect to itself",
            400
        );

    }

}

module.exports = {
    validateRouterId,
    validateCost,
    validateLink
};