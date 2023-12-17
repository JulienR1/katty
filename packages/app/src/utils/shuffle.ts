export function shuffle<T extends any>(array: T[]): T[] {
    const copy = [...array];
    for (let i = 1; i < copy.length - 1; i++) {
        const j = Math.floor(Math.random() * (copy.length - i) + i);
        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }
    return copy;
}
