import {IPopulate} from "../interfaces/system";
import * as mongoose from "mongoose";

interface MPProps {
    model: mongoose.Model<any>;
    populate?: IPopulate;
}

interface MPResult {
    [x: string]: string;
}

export default function MultilingualPopulate(props: MPProps): MPResult {
    let result: MPResult = {};

    if (!props.populate) return result;

    for (let i = 0; i < props.populate.length; i++) {
        const field = props.populate[i].path;
        const options = props.model.schema.path(field).options;
        let ref = options.ref;
        if (!ref && options.type) {
            ref = options.type[0].ref;
        }
        if (field.indexOf('.') > -1) {
            const innerField = field.substr(field.lastIndexOf('.') + 1);
            result[innerField] = ref;
        } else {
            result[field] = ref;
        }
    }

    return result;
}