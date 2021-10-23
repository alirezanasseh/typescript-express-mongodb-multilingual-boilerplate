const removeValueFromArray = <T>(array: Array<T> | undefined, value: T | undefined) => {
    if (!array) return [];
    let tempArray = [...array];
    if (value) {
        let index = tempArray.findIndex(item => item === value);
        if (index > -1) {
            tempArray.splice(index, 1);
        }
    }
    return tempArray;
};

export const arrayHelpers = {
    removeValueFromArray
};