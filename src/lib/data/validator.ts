import Joi, { SchemaMap } from "joi";


export interface ValidateSchema {
    body?: SchemaMap,
    query?: SchemaMap,
    params?: SchemaMap,
    onError?: any
}

export function validate(obj: ValidateSchema) {

    return (req, res, next) => {
        try {
            for (let key of Object.keys(obj)) {
                if (['body', 'params', 'query'].includes(key)) {
                    const schema = Joi.object(obj[key])
                    req[key] = Joi.attempt(req[key], schema, { abortEarly: false, convert: true })
                    console.log(req[key])
                }
            }
            next()
        } catch (e) {
            console.log(e)
            if (obj.onError) {
                obj.onError(e, req, res, next);
            } else {
                next(e)
            }
        }
    }

}