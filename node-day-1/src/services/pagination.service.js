class PaginationService {
    apply(service) {
        if (!service.model) {
            throw new Error("Model is required for pagination");
        }
        service.pagination = async (page, limit = 20, condition = {}) => {
            const offset = (page - 1) * limit;
            const rows = await service.model.findAll(limit, offset, condition);
            const total = await service.model.count();

            const pagination = {
                current_page: page,
                total: total,
                per_page: limit,
            };
            if (rows.length) {
                ((pagination.from = offset + 1),
                    (pagination.to = offset + rows.length));
            }

            return {
                rows,
                pagination,
            };
        };
    }
    // async apply(model, page = 1, limit = 20) {
    //
    // }
}

module.exports = new PaginationService();
