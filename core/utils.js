export const formatDate = date => {
    if (typeof date === 'string') return date;
    const words = date.toString().split(' ');
    let time = words[4].split(':');
    return `${time[0]}:${time[1]} on ${words[0]}, ${words[1]} ${words[2]} ${words[3]}`;
}

export const transformData = records => {
    const data = [];
    for (let i = 0; i < records.x.length; i++) {
        data.push({x: records.x[i], y: records.y[i]});
    }
    data.sort((a, b) => {
        const d1 = new Date(a.x);
        const d2 = new Date(b.x);
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return 0;
    });
    return data;
}