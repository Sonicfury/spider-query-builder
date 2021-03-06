/*
 * Copyright (c) 2021 Théo Lambert
 */

/**
 * SpdrParamInterface must be implemented by all SpiderParams
 */
export interface SpdrParamInterface {
    query: string;
    property: string;
    value: any;
    operator: Operator | RangeOperator | DateOperator;
}

/**
 * Spdr Abstract Class
 * You should extend this for your custom purposes.
 * The SpdrQueryBuilder expects SpdrParamInterface[] as a parameter, though.
 * This means you can create your own abstract implementation.
 */
export abstract class SpdrParam implements SpdrParamInterface {
    private readonly _property;
    private readonly _operator: Operator | RangeOperator | DateOperator;
    private readonly _value: any;
    private _query: string = '';

    /**
     * Spdr SpdrParam base constructor
     * @param property string
     * @param operator Operator | RangeOperator | DateOperator
     * @param value any
     * @protected
     */
    protected constructor(property: string, operator: Operator | RangeOperator | DateOperator, value: any) {
        this._property = property;
        this._operator = operator;
        this._value = value;
    }

    get property(): string {
        return this._property;
    }

    get value(): any {
        return this._value;
    }

    get query(): string {
        return this._query;
    }

    set query(value: string) {
        this._query = value;
    }

    get operator(): Operator | RangeOperator | DateOperator {
        return this._operator;
    }
}


export class SpdrExists extends SpdrParam {

    /**
     * @param property string
     * @param value boolean
     */
    constructor(property: string, value: boolean) {
        super(property, Operator.exists, value);
        this.query = `${this.operator}[${property}]=${value.toString()}`;
    }
}

export class SpdrSearch extends SpdrParam {

    /**
     *
     * @param property
     * @param values
     * @param operand
     */
    constructor(property: string, values: string[], operand: string = '&') {
        super(property, Operator.equals, values);

        this.query = '';

        if (values.length === 1) {
            this.query = `${property}${this.operator}${values[0]}`;
        } else {
            values.forEach((value, i) => {
                let str = `${property}[]${this.operator}${value}${operand}`;

                if (i === values.length - 1) {
                    str = `${property}[]${this.operator}${value}`;
                }

                this.query += str;
            })
        }
    }
}

export class SpdrDate extends SpdrParam {

    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new Spdr if you need another formatting.
     * @param property string
     * @param operator DateOperator
     * @param value Date
     */
    constructor(property: string, operator: DateOperator, value: Date) {
        super(property, operator, value);
        this.query = `${property}[${operator}]=${value.toISOString().slice(0, 10)}`; // date formatting like YYYY-MM-DD
    }
}

export class SpdrRange extends SpdrParam {

    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator RangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property: string, operator: RangeOperator, value: number, secondValue?: number) {
        super(property, operator, value);
        this.query = !!secondValue && operator === RangeOperator.between ?
            `${property}[${operator}]=${value.toString()}..${secondValue.toString()}`
            : `${property}[${operator}]=${value.toString()}`;
    }
}

export class SpdrOrder extends SpdrParam {

    /**
     * @param property string
     * @param value OrderOperator
     */
    constructor(property: string, value: OrderOperator) {
        super(property, Operator.sort, value);
        this.query = `${this.operator}[${property}]=${value}`;
    }
}

export class SpdrPagination extends SpdrParam {
    /**
     * @param value boolean
     * @param property string ('pagination' by default)
     */
    constructor(value: boolean = true, property: string = PageOperator.pagination) {
        super(property, Operator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

export class SpdrPageIdx extends SpdrParam {
    /**
     * @param value number
     * @param property string ('page' by default)
     */
    constructor(value: number, property: string = PageOperator.page) {
        super(property, Operator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

export class SpdrPageSize extends SpdrParam {
    /**
     * @param value number
     * @param property string ('itemsPerPage' by default)
     */
    constructor(value: number, property: string = PageOperator.itemsPerPage) {
        super(property, Operator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

/**
 * Base operators
 * @enum string
 */
export enum Operator {
    exists = 'exists',
    equals = '=',
    sort = 'order'
}

/**
 * Sort values
 * @enum string
 */
export enum OrderOperator {
    asc = 'asc',
    desc = 'desc'
}

/**
 * Range and comparison operators
 * @enum string
 */
export enum RangeOperator {
    lt = 'lt',
    lte = 'lte',
    gt = 'gt',
    gte = 'gte',
    between = 'between'
}

/**
 * Date comparison operators
 * @enum string
 */
export enum DateOperator {
    after = 'after',
    before = 'before',
    strictlyAfter = 'strictly_after',
    strictlyBefore = 'strictly_before'
}

/**
 * Pagination properties
 * @enum string
 */
export enum PageOperator {
    pagination = 'pagination',
    page = 'page',
    itemsPerPage = 'itemsPerPage'
}
