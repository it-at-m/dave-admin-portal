import type BaseEntity from "../common/BaseEntity";

export default interface CityDistrictDTO extends BaseEntity {
    name: string;
    city: string;
    number: number;
}