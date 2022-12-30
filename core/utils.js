export const formatDate = date => {
    if (typeof date === 'string') return date;
    const words = date.toString().split(' ');
    let time = words[4].split(':');
    return `${time[0]}:${time[1]} on ${words[0]}, ${words[1]} ${words[2]} ${words[3]}`
}