export const formatDate = (startTime: Date | string, endTime: Date | string) => {
    const currentDate = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffStartTime = start.getTime() - currentDate.getTime();
    const diffEndTime = end.getTime() - currentDate.getTime();

    const diffStartHours = diffStartTime / (1000 * 60 * 60);
    const diffEndHours = diffEndTime / (1000 * 60 * 60);
    const diffStartDays = diffStartTime / (1000 * 60 * 60 * 24);

    // If the event is currently going on
    if (currentDate >= start && currentDate <= end) {
        return "currently going on";
    }

    // If the event has ended
    if (currentDate > end) {
        return "ended";
    }

    // If the event is in less than 1 hour
    if (diffStartHours > 0 && diffStartHours < 1) {
        return "next up...";
    }

    // If the event is in 2-6 hours
    if (diffStartHours >= 2 && diffStartHours < 6) {
        return `starts in ${Math.round(diffStartHours)} hrs.`;
    }

    // If the event is today but in more than 6 hours
    if (currentDate.toDateString() === start.toDateString() && diffStartHours >= 6) {
        return "today";
    }

    // If the event is tomorrow
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.toDateString() === start.toDateString()) {
        return "tomorrow";
    }

    // Else return the date in the format like "15 May 2024"
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return start.toLocaleDateString('en-GB', options);
}

export const numericDate = (timestamp: string | Date) => {
    let date = new Date(timestamp)

    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    let day = date.getUTCDate()
    let monthName = months[date.getUTCMonth()]
    let year = date.getUTCFullYear()

    return `${day} ${monthName} ${year}`
}

export const formatTime = (date: string | Date): string => {
    const now = new Date();
    const givenDate = new Date(date);

    const diffInMs = now.getTime() - givenDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
        return "now";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hr' : 'hrs'} ago`;
    } else {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
};


export const getDate = (date: string | Date) => {
    date = new Date(date);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}