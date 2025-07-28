import type Verkehrsart from "@/domain/enums/Verkehrsart";
import type MessstelleStatus from "@/types/enum/MessstelleStatus";

export default interface SearchAndFilterOptionsDTO {
  searchInMessstellen: boolean;
  searchInZaehlstellen: boolean;

  messstelleStatus: MessstelleStatus;
  messstelleVerkehrsart: Verkehrsart;
}
