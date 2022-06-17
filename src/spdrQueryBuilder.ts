import {
    DateOperator,
    OrderOperator,
    PageOperator,
    RangeOperator,
    SpdrDate,
    SpdrExists,
    SpdrOrder,
    SpdrPageIdx,
    SpdrPageSize,
    SpdrPagination,
    SpdrParamInterface,
    SpdrRange,
    SpdrSearch
} from './spdrParam';


export class SpdrQueryBuilder {

    private static readonly _DEFAULT_OPERAND = '&';

    private _query: string;
    private _operand: string;
    private _history: string[] = [];

    private _params: SpdrParamInterface[] = [];
    private _sortParams: SpdrParamInterface[] = [];
    private _paginationParams: SpdrParamInterface[] = [];

    constructor(operand?: string) {
        this._query = '';
        this._operand = operand ?? SpdrQueryBuilder._DEFAULT_OPERAND;
    }

    public operand(value: string): SpdrQueryBuilder {
        this._operand = value;

        return this;
    }

    public clearHistory(): SpdrQueryBuilder {
        this._history = [];

        return this;
    }

    public search(property: string, values: string[], operand: string = this._operand): SpdrQueryBuilder {
        this._addParam(new SpdrSearch(property, values, operand));

        return this;
    }

    public exists(property: string, value: boolean = true): SpdrQueryBuilder {
        this._addParam(new SpdrExists(property, value));

        return this;
    }

    public range(property: string, operator: RangeOperator, value: number, secondValue?: number): SpdrQueryBuilder {
        this._addParam(new SpdrRange(property, operator, value, secondValue));

        return this;
    }

    public date(property: string, operator: DateOperator, value: Date): SpdrQueryBuilder {
        this._addParam(new SpdrDate(property, operator, value));

        return this;
    }

    public order(property: string, direction: OrderOperator): SpdrQueryBuilder {
        this._addSortParam(new SpdrOrder(property, direction));

        return this;
    }

    public enablePagination(value: boolean = true, property: string = PageOperator.pagination): SpdrQueryBuilder {
        this._addPaginationParam(new SpdrPagination(value, property));

        return this;
    }

    public pageIndex(value: number, property: string = PageOperator.page): SpdrQueryBuilder {
        this._addPaginationParam(new SpdrPageIdx(value, property));

        return this;
    }

    public pageSize(value: number, property: string = PageOperator.itemsPerPage): SpdrQueryBuilder {
        this._addPaginationParam(new SpdrPageSize(value, property));

        return this;
    }

    /**
     * Clears the query builder according to the type passed
     * Clears completely if no type is passed
     *
     * @param type
     */
    public clear(type?: SpdrParamType): SpdrQueryBuilder {
        switch (type) {
            case SpdrParamType.param:
                this._params = [];
                break;
            case SpdrParamType.sort:
                this._sortParams = [];
                break;
            case SpdrParamType.pagination:
                this._paginationParams = [];
                break;
            default:
                this._params = [];
                this._sortParams = [];
                this._paginationParams = [];
                break;
        }

        this._history.push(this.query);
        this._buildQuery();

        return this;
    }

    /**
     * Removes all params of the passed type matching the passed property from the query builder
     * If no type is passed, all params matching the passed property will be removed
     *
     * @param property
     * @param type
     */
    public remove(property: string, type?: SpdrParamType): SpdrQueryBuilder {
        switch (type) {
            case SpdrParamType.param:
                this._params = this._params.filter((param: SpdrParamInterface) => param.property !== property);
                break;
            case SpdrParamType.sort:
                this._sortParams = this._sortParams.filter((param: SpdrParamInterface) => param.property !== property);
                break;
            case SpdrParamType.pagination:
                this._paginationParams = this._paginationParams.filter((param: SpdrParamInterface) => param.property !== property);
                break;
            default:
                this._params = this._params.filter((param: SpdrParamInterface) => param.property !== property);
                this._sortParams = this._sortParams.filter((param: SpdrParamInterface) => param.property !== property);
                this._paginationParams = this._paginationParams.filter((param: SpdrParamInterface) => param.property !== property);
                break;
        }

        this._buildQuery();

        return this;
    }

    private _addParam(param: SpdrParamInterface) {
        this._params.push(param);
        this._buildQuery();
    }

    private _addSortParam(param: SpdrParamInterface) {
        this._sortParams.push(param);
        this._buildQuery();
    }

    private _addPaginationParam(param: SpdrParamInterface) {
        this._paginationParams.push(param);
        this._buildQuery();
    }

    private _append(param: SpdrParamInterface, operand: string = this._operand) {
        const query = param.query ?? (param['_query'] || param['query'])
        // todo : find a way to cast params as SpdrSpdrParamInterface and keep getters
        this._query += `${operand}${query}`;
    }

    private _buildQuery() {
        this._query = '';
        [...this._params, ...this._sortParams, ...this._paginationParams].forEach(param => this._append(param));
    }

    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query(): string {
        return this._query.slice(this._operand.length);
    }

    get history(): string[] {
        return this._history;
    }

    get previousQuery(): string {
        return this._history[this._history.length - 1];
    }


    get params(): SpdrParamInterface[] {
        return this._params;
    }

    set params(value: SpdrParamInterface[]) {
        this._params = value;
        this._buildQuery();
    }

    get sortParams(): SpdrParamInterface[] {
        return this._sortParams;
    }

    set sortParams(value: SpdrParamInterface[]) {
        this._sortParams = value;
        this._buildQuery();
    }

    get paginationParams(): SpdrParamInterface[] {
        return this._paginationParams;
    }

    set paginationParams(value: SpdrParamInterface[]) {
        this._paginationParams = value;
        this._buildQuery();
    }
}

export enum SpdrParamType {
    param, sort, pagination
}