export const map2obj = (map: Map<string, any>) => {
    const obj = Object.create(null);
    map.forEach((val, k) => {
        obj[k] = val;
    });
    return obj;
};