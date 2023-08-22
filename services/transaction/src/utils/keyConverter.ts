import { Str } from "@supercharge/strings"

interface Map {
    [key: string]: string | undefined
}

export const camelCaseKeys = (input: any): any => {
    if (Array.isArray(input)) {
        return input.map(item => camelCaseKeys(item));
    } else if (typeof input === 'object' && input !== null) {
        const result: any = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                const camelKey = key.replace(/_(\w)/g, (_, match) => match.toUpperCase());
                if (key === 'created_at' || key === 'updated_at') {
                    result[camelKey] = new Date(input[key]);
                } else {
                result[camelKey] = camelCaseKeys(input[key]);
                }
            }
        }
        return result;
    }
    return input;
}

export const snakeCaseKeys = (data: object) => {
    return Object
        .entries(data)
        .reduce((acc:Map, [key, value]) => {
            acc[Str(key).snake().get()] = value
            return acc;
        }, {});
}