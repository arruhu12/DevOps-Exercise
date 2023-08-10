import { Str } from "@supercharge/strings"

interface Map {
    [key: string]: string | undefined
}

export const camelCaseKeys = (data: object) => {
    return Object
        .entries(data)
        .reduce((acc:Map, [key, value]) => {
            acc[Str(key).camel().get()] = value
            return acc;
        }, {});
}

export const snakeCaseKeys = (data: object) => {
    return Object
        .entries(data)
        .reduce((acc:Map, [key, value]) => {
            acc[Str(key).snake().get()] = value
            return acc;
        }, {});
}