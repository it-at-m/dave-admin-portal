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

  function isDateAfter(dateToCheck: string, dateAfter: Date | string): boolean {
    return new Date(dateToCheck).valueOf() > new Date(dateAfter).valueOf();
  }

  function formatDateForBackend(date: string): string {
    if (!date) {
      return "";
    }

    const time = new Date().toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return new Date(date + "T" + time).toISOString();
  }

  return {
    sortDatesDescAsStrings,
    formatDate,
    isDateAfter,
    formatDateForBackend,
  };
}
