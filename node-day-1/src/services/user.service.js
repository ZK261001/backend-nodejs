const userModel = require("@/models/user.model");
const paginationService = require("@/services/pagination.service");

class UserService {
    model = userModel;
    constructor() {
        paginationService.apply(this);
    }
}

module.exports = new UserService();
