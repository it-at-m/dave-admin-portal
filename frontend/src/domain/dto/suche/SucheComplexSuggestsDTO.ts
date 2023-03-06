import SucheWordSuggestDTO from "@/domain/dto/suche/SucheWordSuggestDTO";
import SucheZaehlstelleSuggestDTO from "@/domain/dto/suche/SucheZaehlstelleSuggestDTO";
import SucheZaehlungSuggestDTO from "@/domain/dto/suche/SucheZaehlungSuggestDTO";

export default interface SucheComplexSuggestsDTO {
  wordSuggests: SucheWordSuggestDTO[];
  zaehlstellenSuggests: SucheZaehlstelleSuggestDTO[];
  zaehlungenSuggests: SucheZaehlungSuggestDTO[];
}