import Status from "@/types/enum/Status";

export default interface UpdateStatus {
  zaehlungId: string;
  status: Status;
  dienstleisterkennung: string;
}
