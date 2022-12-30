export const formatDate = date => {
    if (typeof date === 'string') return date;
    const words = date.toString().split(' ');
    let time = words[4].split(':');
    return `${time[0]}:${time[1]} on ${words[0]}, ${words[1]} ${words[2]} ${words[3]}`
}

export const transformData = records => {
    const data = [];
    for (let i = 0; i < records.x.length; i++) {
        data.push({x: records.x[i], y: records.y[i]});
    }
    return data;
}