export function useDateUtils() {
    function formatDate(date: string): string {
        if (!date) {
            return "";
        }
        const [year, month, day] = date.split("-");
        return `${day}.${month}.${year}`;
    }

    function sortDatesDescAsStrings(arrayToSort: string[]): string[] {
        return arrayToSort.sort(function (a, b) {
            return new Date(b).valueOf() - new Date(a).valueOf();
        });
    }

    function isDateAfter(
        dateToCheck: string,
        dateAfter: Date | string
    ): boolean {
        return new Date(dateToCheck).valueOf() > new Date(dateAfter).valueOf();
    }

    return {
        sortDatesDescAsStrings,
        formatDate,
        isDateAfter,
    };
}
