const upperFirst = (str: string) => {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};

const snakeToPascal = (str: string) => {
    return str.split('_').map(part => {
        return upperFirst(part);
    }).join('');
};

export const stringHelpers = {
    upperFirst,
    snakeToPascal
};