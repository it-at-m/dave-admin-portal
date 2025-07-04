import type DetektierteVerkehrsart from "@/domain/enums/DetektierteVerkehrsart";
import type MessstelleStatus from "@/types/enum/MessstelleStatus";

export default interface SearchAndFilterOptionsDTO {
  searchInMessstellen: boolean;
  searchInZaehlstellen: boolean;

  messstelleStatus: MessstelleStatus;
  messstelleVerkehrsart: DetektierteVerkehrsart;
}
