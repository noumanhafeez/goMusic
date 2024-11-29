export const convertTime = (minutes = 0) => {
    if (minutes) {
        const hrs = minutes / 60;
        const [min, percentPart] = hrs.toFixed(2).toString().split('.');
        const percent = parseInt(percentPart || '0', 10);
        const sec = Math.ceil((60 * percent) / 100);

        const formattedMin = parseInt(min) < 10 ? `0${min}` : min;
        const formattedSec = sec < 10 ? `0${sec}` : sec;

        return `${formattedMin}:${formattedSec}`;
    }
    return '00:00'; // Default time if duration is invalid or 0
};