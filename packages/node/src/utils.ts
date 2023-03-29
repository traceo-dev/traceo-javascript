const currentUnix = (): number => {
    return Math.floor(Date.now() / 1000);
}

export const utils = {
    currentUnix
};
