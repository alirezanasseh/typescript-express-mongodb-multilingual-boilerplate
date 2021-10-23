export default function MultilingualFields(entity: string): Array<string> {
    let fields: Array<string> = [];
    switch (entity) {
        case 'User':
            fields = ['bio'];
            break;
    }
    return fields;
}