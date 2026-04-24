import { shallowMount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import VerkehrsartForm from "@/components/zaehlung/form/VerkehrsartForm.vue";
import { usePkweinheitStore } from "@/store/PkweinheitStore";
import Fahrzeug from "@/types/enum/Fahrzeug";
import Zaehlart from "@/types/enum/Zaehlart";

const pinia = createPinia();

describe("VerkehrsartForm.vue - Funktionen", () => {
  let vuetify: ReturnType<typeof createVuetify>;

  beforeAll(() => {
    createPinia();
    createVuetify();
  });

  beforeEach(() => {
    vuetify = createVuetify({ components, directives });
  });

  function createWrapper(zaehlungProp: any) {
    // Sicherstellen, dass der Store existiert und sinnvolle Standardwerte hat
    const wrapper = shallowMount(VerkehrsartForm, {
      global: {
        plugins: [pinia, vuetify],
      },
      props: {
        // Die Komponente erwartet ein Model (defineModel) - das wird als modelValue prop übergeben
        modelValue: zaehlungProp,
        height: "Dummy",
      },
    });

    // Setze eine sinnvolle PkwEinheit im Store, damit die berechneten Labels nicht auf undefined zugreifen
    const pkStore = usePkweinheitStore();
    pkStore.setPkwEinheit({
      pkw: 1,
      lkw: 2,
      lastzuege: 3,
      busse: 4,
      kraftraeder: 0.5,
      fahrradfahrer: 0.2,
      fussgaenger: 0.1,
    } as any);

    return wrapper;
  }

  it("checkIfZaehlartOfZaehlungAllowsAllCategories gibt false zurück für restriktive Zählarten", () => {
    const restricted = [Zaehlart.QJS, Zaehlart.QU, Zaehlart.FJS];
    restricted.forEach((z) => {
      const wrapper = createWrapper({ zaehlart: z, kategorien: [] });
      // Funktion ist auf vm verfügbar
      const result = (
        wrapper.vm as any
      ).checkIfZaehlartOfZaehlungAllowsAllCategories();
      expect(result).toBe(false);
    });
  });

  it("checkIfZaehlartOfZaehlungAllowsAllCategories gibt true zurück für nicht-restriktive Zählart", () => {
    const wrapper = createWrapper({ zaehlart: Zaehlart.N, kategorien: [] });
    const result = (
      wrapper.vm as any
    ).checkIfZaehlartOfZaehlungAllowsAllCategories();
    expect(result).toBe(true);
  });

  it("updateKategorieWith... fügt Kategorien hinzu und entfernt sie basierend auf dem Checkbox-Ref-Status", () => {
    const wrapper = createWrapper({ zaehlart: Zaehlart.N, kategorien: [] });
    const vm: any = wrapper.vm;

    // Pkw hinzufügen
    vm.pkw = true;
    vm.updateKategorieWithPkw();
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.PKW);

    // Pkw entfernen
    vm.pkw = false;
    vm.updateKategorieWithPkw();
    expect(vm.zaehlung.kategorien).not.toContain(Fahrzeug.PKW);

    // Rad hinzufügen
    vm.rad = true;
    vm.updateKategorieWithRad();
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.RAD);

    // Rad entfernen
    vm.rad = false;
    vm.updateKategorieWithRad();
    expect(vm.zaehlung.kategorien).not.toContain(Fahrzeug.RAD);
  });

  it("selectOrDeselectAll wählt alle verfügbaren Kategorien aus, wenn aktiviert und die Zählart alle erlaubt", () => {
    const wrapper = createWrapper({ zaehlart: Zaehlart.N, kategorien: [] });
    const vm: any = wrapper.vm;

    // Ensure zaehlart allows all categories
    vm.zaehlung.zaehlart = Zaehlart.N;

    vm.selectOrDeselectAll(); // simuliert das Klicken des 'Alles auswählen'-Buttons

    // Wenn alle wählbar sind, sollten diese true sein
    expect(vm.pkw).toBe(true);
    expect(vm.lkw).toBe(true);
    expect(vm.lz).toBe(true);
    expect(vm.bus).toBe(true);
    expect(vm.krad).toBe(true);
    expect(vm.rad).toBe(true);
    expect(vm.fuss).toBe(true);

    // Und zaehlung.kategorien sollte alle diese Einträge enthalten
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.PKW);
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.LKW);
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.LZ);
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.BUS);
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.KRAD);
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.RAD);
    expect(vm.zaehlung.kategorien).toContain(Fahrzeug.FUSS);
  });

  it("selectOrDeselectAll wählt nur Rad und Fuss aus, wenn die Zählart Kategorien einschränkt", () => {
    const wrapper = createWrapper({ zaehlart: Zaehlart.QJS, kategorien: [] });
    const vm: any = wrapper.vm;

    vm.zaehlung.zaehlart = Zaehlart.QJS;

    vm.selectOrDeselectAll(); // simuliert das Klicken des 'Alles auswählen'-Buttons

    // Restriktive Kategorien sollten false sein
    expect(vm.pkw).toBe(false);
    expect(vm.lkw).toBe(false);
    expect(vm.lz).toBe(false);
    expect(vm.bus).toBe(false);
    expect(vm.krad).toBe(false);

    expect(vm.rad).toBe(true);
    expect(vm.fuss).toBe(true);

    // Und zaehlung.kategorien sollte nur RAD und FUSS enthalten
    expect(vm.zaehlung.kategorien).toEqual(
      expect.arrayContaining([Fahrzeug.RAD, Fahrzeug.FUSS])
    );
    expect(vm.zaehlung.kategorien.length).toBe(2);
  });

  it("addKategorieToZaehlung fügt Duplikate hinzu, wenn mehrfach aufgerufen (erwartetes Verhalten) und removeKategorie entfernt nur eine Instanz", () => {
    const wrapper = createWrapper({ zaehlart: Zaehlart.N, kategorien: [] });
    const vm: any = wrapper.vm;

    vm.addKategorieToZaehlung(Fahrzeug.PKW);
    vm.addKategorieToZaehlung(Fahrzeug.PKW);
    expect(
      vm.zaehlung.kategorien.filter((k: any) => k === Fahrzeug.PKW).length
    ).toBe(2);

    // removeKategorie sollte nur das erste Vorkommen entfernen
    vm.removeKategorie(Fahrzeug.PKW);
    expect(
      vm.zaehlung.kategorien.filter((k: any) => k === Fahrzeug.PKW).length
    ).toBe(1);

    // Das Entfernen einer nicht vorhandenen Kategorie sollte keinen Fehler werfen und das Array unverändert lassen
    const before = [...vm.zaehlung.kategorien];
    vm.removeKategorie(Fahrzeug.LKW);
    expect(vm.zaehlung.kategorien).toEqual(before);
  });

  it("resetForm setzt Checkbox-Refs entsprechend zaehlung.kategorien und setzt selectOrDeselectAllVmodel basierend auf der Anzahl wählbarer Kategorien", () => {
    // Unbeschränkte Zählart: choosableCategories.length = 7
    const wrapper1 = createWrapper({
      zaehlart: Zaehlart.N,
      kategorien: [
        Fahrzeug.PKW,
        Fahrzeug.LKW,
        Fahrzeug.LZ,
        Fahrzeug.BUS,
        Fahrzeug.KRAD,
        Fahrzeug.RAD,
        Fahrzeug.FUSS,
      ],
    });
    const vm1: any = wrapper1.vm;
    vm1.resetForm();
    expect(vm1.pkw).toBe(true);
    expect(vm1.lkw).toBe(true);
    expect(vm1.lz).toBe(true);
    expect(vm1.bus).toBe(true);
    expect(vm1.krad).toBe(true);
    expect(vm1.rad).toBe(true);
    expect(vm1.fuss).toBe(true);
    expect(vm1.selectOrDeselectAllVmodel).toBe(true);

    // Restriktive Zählart: choosableCategories.length = 2
    const wrapper2 = createWrapper({
      zaehlart: Zaehlart.QJS,
      kategorien: [Fahrzeug.RAD, Fahrzeug.FUSS],
    });
    const vm2: any = wrapper2.vm;
    vm2.resetForm();
    expect(vm2.pkw).toBe(false);
    expect(vm2.lkw).toBe(false);
    expect(vm2.lz).toBe(false);
    expect(vm2.bus).toBe(false);
    expect(vm2.krad).toBe(false);
    expect(vm2.rad).toBe(true);
    expect(vm2.fuss).toBe(true);
    expect(vm2.selectOrDeselectAllVmodel).toBe(true);
  });
});
