"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpdrQueryBuilder = void 0;
class SpdrQueryBuilder {
    /**
     * Constructing a new SpdrQueryBuilder builds the query if you pass params.
     * In this case, the query will be built with the default operand '&'.
     * To override this behavior, you can construct an empty builder and manually append each SpdrParam according to your needs.
     * @param params SpdrParam[]
     */
    constructor(params) {
        this._query = '';
        params && this.build(params);
    }
    /**
     * Builds the query from the provided SpiderParams. The returned string should be placed right after the question mark in your url.
     * Provided params must implement SpdrParamInterface.
     * @param params SpdrParamInterface[]
     * @param operand string
     */
    build(params, operand = '&') {
        params.forEach((param) => {
            this.append(param, operand);
        });
        this._query = this._query.slice(1);
    }
    /**
     * Appends a SpdrParam to the query. The default operand is '&' but you can pass your own to the second param.
     * Provided param must implement SpdrParamInterface
     * @param param SpdrParamInterface
     * @param operand string
     */
    append(param, operand = '&') {
        this._query += `${operand}${param.query}`;
    }
    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query() {
        return this._query;
    }
}
exports.SpdrQueryBuilder = SpdrQueryBuilder;
//# sourceMappingURL=spdrQueryBuilder.js.map