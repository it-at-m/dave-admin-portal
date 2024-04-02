export function useValidationUtils() {
    function pflichtfeld(value: string): boolean | string {
        if (value) {
            return true;
        }
        return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
    }

    return {
        pflichtfeld,
    };
}
