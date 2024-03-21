import _ from "lodash";

export function useValidationUtils() {
    function pflichtfeld(value: string): boolean | string {
        if (!_.isEmpty(value)) {
            return true;
        }
        return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
    }

    return {
        pflichtfeld,
    };
}
