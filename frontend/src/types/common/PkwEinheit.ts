import type BaseEntity from "@/types/common/BaseEntity";

export default interface PkwEinheit extends BaseEntity {
  pkw: number;
  lkw: number;
  lastzuege: number;
  busse: number;
  kraftraeder: number;
  fahrradfahrer: number;
  fussgaenger: number;
}
