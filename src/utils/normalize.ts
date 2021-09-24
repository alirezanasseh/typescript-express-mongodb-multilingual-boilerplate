export default function Normalize(modelName: string, userProjection: string | undefined) {
    let privateFields: Array<string> = [];
    switch (modelName) {
        case 'User':
            privateFields = ['password', 'salt'];
            break;
    }
    privateFields.push('__v');
    let defaultProjection = privateFields.map(field => '-' + field);

    let safeProjection: Array<string> = [];

    // Handling user projection
    if (userProjection) {
        let upArray = userProjection.split(' ');
        let projectionType: 'include' | 'exclude' | '' = '';
        let complexType: boolean = false;
        for (let i = 0; i < upArray.length; i++) {
            if (upArray[i].substr(0, 1) === '-') {
                if (projectionType === 'include') {
                    // Mixing include and exclude fields in projection produce error in MongoDB
                    complexType = true;
                    break;
                }
                projectionType = 'exclude';
                safeProjection.push(upArray[i]);
            } else {
                if (projectionType === 'exclude') {
                    // Mixing include and exclude fields in projection produce error in MongoDB
                    complexType = true;
                    break;
                }
                projectionType = 'include';
                if (privateFields.indexOf(upArray[i]) === -1) {
                    safeProjection.push(upArray[i]);
                }
            }
        }

        if (complexType) {
            /**
             * If user projection is mix of include and exclude
             * it is invalid, so we use default projection
             */
            safeProjection = defaultProjection;
        } else {
            /**
             * If user projection is valid and it is exclude
             * we add exclusion of private fields to it
             */
            if (projectionType === 'exclude') {
                safeProjection = safeProjection.concat(defaultProjection);
            }
        }
    } else {
        safeProjection = defaultProjection;
    }

    return safeProjection.join(' ');
}