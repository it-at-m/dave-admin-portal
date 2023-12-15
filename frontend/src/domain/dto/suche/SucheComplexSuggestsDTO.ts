import SucheWordSuggestDTO from "@/domain/dto/suche/SucheWordSuggestDTO";
import SucheZaehlstelleSuggestDTO from "@/domain/dto/suche/SucheZaehlstelleSuggestDTO";
import SucheZaehlungSuggestDTO from "@/domain/dto/suche/SucheZaehlungSuggestDTO";
import SucheMessstelleSuggestDTO from "@/domain/dto/suche/SucheMessstelleSuggestDTO";

export default interface SucheComplexSuggestsDTO {
    wordSuggests: SucheWordSuggestDTO[];
    zaehlstellenSuggests: SucheZaehlstelleSuggestDTO[];
    zaehlungenSuggests: SucheZaehlungSuggestDTO[];
    messstellenSuggests: SucheMessstelleSuggestDTO[];
}
