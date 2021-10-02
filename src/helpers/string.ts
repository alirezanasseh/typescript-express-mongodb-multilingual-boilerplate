export const UpperFirst = (str: string) => {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};

export const SnakeToPascal = (str: string) => {
    return str.split('_').map(part => {
        return UpperFirst(part);
    }).join('');
};