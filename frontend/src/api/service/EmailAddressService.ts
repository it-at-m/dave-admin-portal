import type { EmailAddressDTO } from "@/api/client";

import { Configuration, EmailAddressControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class EmailAddressService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new EmailAddressControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static save(data: EmailAddressDTO): Promise<EmailAddressDTO> {
    return handleOpenApiError(
      this.API.saveEmailAddress({ emailAddressDTO: data }).then(
        (response) => response
      ),
      "Beim Speichern der Email-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static update(data: EmailAddressDTO): Promise<EmailAddressDTO> {
    return handleOpenApiError(
      this.API.saveEmailAddress({ emailAddressDTO: data }).then(
        (response) => response
      ),
      "Beim Aktualiseren der Email-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getEmailAddresses(): Promise<Array<EmailAddressDTO>> {
    return handleOpenApiError(
      this.API.getEmailAddresses().then((response) => response),
      "Beim Laden der Email-Adressen ist ein Fehler aufgetreten."
    );
  }

  static delete(data: EmailAddressDTO): Promise<object> {
    if (!data.id) {
      throw new Error("Adresse mit leerer ID kann nicht gelöscht werden.");
    }
    return handleOpenApiError(
      this.API.deleteEmailaddress({ id: data.id }).then((response) => response),
      "Beim Löschen der E-Mail-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }
}
