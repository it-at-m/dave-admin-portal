import type Verkehrsart from "@/domain/enums/Verkehrsart";

export default interface SearchAndFilterOptionsDTO {
  searchInMessstellen: boolean;
  searchInZaehlstellen: boolean;

  messstelleVerkehrsart: Array<Verkehrsart>;
}
