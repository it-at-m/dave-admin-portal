import type {
  ChatMessageDTO,
  GetAllChatMessagesByZaehlungIdRequest,
  SaveChatMessageRequest,
  UpdateUnreadMessagesRequest,
} from "@/api/client";

import { ChatMessageControllerApi, Configuration } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class ChatMessageService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new ChatMessageControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static save(data: ChatMessageDTO): Promise<ChatMessageDTO> {
    const request = { chatMessageDTO: data } as SaveChatMessageRequest;
    return handleOpenApiError(
      this.API.saveChatMessageRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Speichern der ChatMessage ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAllByZaehlungId(id: string): Promise<ChatMessageDTO[]> {
    const request = { zaehlungId: id } as GetAllChatMessagesByZaehlungIdRequest;
    return handleOpenApiError(
      this.API.getAllChatMessagesByZaehlungIdRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Holen der ChatMessages ist ein Fehler aufgetreten."
    );
  }

  static updateUnreadMessages(zaehlungId: string, participantId: number) {
    const request = {
      zaehlungId: zaehlungId,
      callingParticipantId: participantId,
    } as UpdateUnreadMessagesRequest;
    return handleOpenApiError(
      this.API.updateUnreadMessagesRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Updaten des ViewStatus der Chat Messages ist ein Fehler aufgetreten."
    );
  }
}
