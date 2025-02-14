const ACRONYMS = ['rrhh']

export const capitalize = (string: string) => {
    if(ACRONYMS.includes(string)) return string.toUpperCase();

    return string.charAt(0).toUpperCase() + string.slice(1);
}