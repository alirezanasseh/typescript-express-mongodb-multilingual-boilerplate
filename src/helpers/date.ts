function addMonths(inputDate: Date, months: number): Date {
    try {
        let date = new Date(inputDate.getTime());
        const d = date.getDate();
        date.setMonth(date.getMonth() + months);
        if (date.getDate() !== d) {
            date.setDate(0);
        }
        return date;
    } catch (e) {
        throw e;
    }
}

function subtractMonths(inputDate: Date, months: number): Date {
    try {
        let date = new Date(inputDate.getTime());
        const d = date.getDate();
        date.setMonth(date.getMonth() - months);
        if (date.getDate() !== d) {
            date.setDate(0);
        }
        return date;
    } catch (e) {
        throw e;
    }
}

function getSunday(d: Date) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day;
    let sunday = new Date(d.setDate(diff));
    sunday.setUTCHours(0, 0, 0, 0);
    return sunday;
}

function changeDate(targetDate: Date, amount: number, type: 'second' | 'minute' | 'hour' | 'day' | 'week', action: 'add' | 'subtract') {
    const target = new Date(targetDate);
    let multiplier: number = 1;
    switch (type) {
        case 'second':
            multiplier *= 1000;
            break;
        case 'minute':
            multiplier *= 1000 * 60
            break;
        case 'hour':
            multiplier *= 1000 * 60 * 60;
            break;
        case 'day':
            multiplier *= 1000 * 60 * 60 * 24;
            break;
        case 'week':
            multiplier *= 1000 * 60 * 60 * 24 * 7;
            break;
    }
    const milliSeconds = amount * multiplier;
    if (action === 'add') {
        return new Date(target.getTime() + milliSeconds);
    } else if (action === 'subtract') {
        return new Date(target.getTime() - milliSeconds);
    } else {
        return target;
    }
}

export const dateHelpers = {
    addMonths,
    subtractMonths,
    getSunday,
    changeDate
};