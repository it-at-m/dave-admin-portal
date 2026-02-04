export default interface ConfigurationItemDTO {
  id: string;
  createdTime: string;
  version: number;
  keyname: string;
  valuefield: string;
  category: string;
  datatype: "DOUBLE" | "STRING" | "INTEGER" | "BOOLEAN";
  entityVersion: number;
}