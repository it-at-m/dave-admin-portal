import type { ChatMessageDTO } from "@/api/client";

import { ChatMessageControllerApi, Configuration } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class ChatMessageService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new ChatMessageControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static save(data: ChatMessageDTO): Promise<ChatMessageDTO> {
    return handleOpenApiError(
      this.API.saveChatMessage({
        chatMessageDTO: data,
      }).then((response) => response),
      "Beim Speichern der ChatMessage ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAllByZaehlungId(id: string): Promise<ChatMessageDTO[]> {
    return handleOpenApiError(
      this.API.getAllChatMessagesByZaehlungId({
        zaehlungId: id,
      }).then((response) => response),
      "Beim Holen der ChatMessages ist ein Fehler aufgetreten."
    );
  }

  static updateUnreadMessages(zaehlungId: string, participantId: number) {
    return handleOpenApiError(
      this.API.updateUnreadMessages({
        zaehlungId,
        callingParticipantId: participantId,
      }).then((response) => response),
      "Beim Updaten des ViewStatus der Chat Messages ist ein Fehler aufgetreten."
    );
  }
}
