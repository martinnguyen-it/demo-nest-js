export interface IQueryString {
    page: string
    limit: string
    sort: string
    fields: string
}

class APIFeatures {
    constructor(
        public query: any,
        private queryString: IQueryString
    ) {}

    filter() {
        const queryObj = { ...this.queryString }
        const excludedFields = ['page', 'limit', 'sort', 'fields']
        excludedFields.forEach(field => delete queryObj[field])

        const queryStr = JSON.stringify(queryObj).replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        )
        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    sort() {
        if (this.queryString && this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields() {
        if (this.queryString && this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    pagination() {
        const page = Number(this.queryString && this.queryString.page) || 1
        const limit = Number(this.queryString && this.queryString.limit) || 10
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)

        return this
    }
}

export default APIFeatures
