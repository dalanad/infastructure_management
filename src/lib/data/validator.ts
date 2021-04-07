import Joi, { SchemaMap } from "joi";

export function validate(obj: { body?: SchemaMap, query?: SchemaMap, params?: SchemaMap, onError?: any }) {

    return (req, res, next) => {
        try {
            for (let key of Object.keys(obj)) {
                if (['body', 'params', 'query'].includes(key)) {
                    const schema = Joi.object(obj[key])
                    req[key] = Joi.attempt(req[key], schema, { abortEarly: false, convert: true })
                }
            }
            next()
        } catch (e) {
            if (obj.onError) {
                obj.onError(e, req, res, next);
            } else {
                next(e)
            }
        }
    }

}