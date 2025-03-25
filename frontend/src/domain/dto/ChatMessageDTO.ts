import type BaseEntity from "@/domain/BaseEntity";
import type MessageTime from "@/domain/chat/MessageTime";

export default interface ChatMessageDTO extends BaseEntity {
  zaehlungId: string;
  messageId: string; //Wird diese ID benötigt (evtl. zum Sortieren)?
  content: string;
  participantId: number;
  messageTimeDTO: MessageTime;
  type: string;
  uploaded: boolean;
  viewed: boolean;
}
