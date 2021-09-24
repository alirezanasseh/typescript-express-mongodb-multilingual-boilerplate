import mongoose, {Schema} from 'mongoose';
import {IPermission} from '../interfaces';

const permissionSchema = new Schema({
    role: {
        type: String,
        default: 'user'
    },
    entity: String,
    allowed: [String],
    create: Schema.Types.Mixed,
    read: Schema.Types.Mixed,
    update_filter: Schema.Types.Mixed,
    update_update: Schema.Types.Mixed,
    delete: Schema.Types.Mixed
});

const Permission = mongoose.model<IPermission>('Permission', permissionSchema);

export default Permission;