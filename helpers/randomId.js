export function randomId(arr) {
    let maxId = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id > maxId) maxId = arr[i].id;
    }
    return maxId + 1;
}