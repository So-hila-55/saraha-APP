export const create = async ({ model, data, options = {} } = {}) => {
    return await model.create([data], options)
}

export const findOne = async ({ model, filter = {}, select = "", options = {} } = {}) => {
    return await model.findOne(filter).select(select).setOptions(options)
}

export const findById = async ({ model, id, select = "", options = {} } = {}) => {
    return await model.findById(id).select(select).setOptions(options)
}

export const find = async ({ model, filter = {}, select = "", options = {} } = {}) => {
    return await model.find(filter).select(select).setOptions(options)
}