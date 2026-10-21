import type {
  DeleteEmailaddressRequest,
  EmailAddressDTO,
  SaveEmailAddress1Request,
  SaveEmailAddressRequest,
} from "@/api/client";

import { Configuration, EmailAddressControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class EmailAddressService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new EmailAddressControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static save(data: EmailAddressDTO): Promise<EmailAddressDTO> {
    const request = { emailAddressDTO: data } as SaveEmailAddressRequest;

    return handleOpenApiError(
      this.API.saveEmailAddressRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Speichern der Email-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static update(data: EmailAddressDTO): Promise<EmailAddressDTO> {
    const request = { emailAddressDTO: data } as SaveEmailAddress1Request;
    return handleOpenApiError(
      this.API.saveEmailAddress1Raw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Aktualisieren der Email-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getEmailAddresses(): Promise<Array<EmailAddressDTO>> {
    return handleOpenApiError(
      this.API.getEmailAddressesRaw().then((response) => response.raw.json()),
      "Beim Laden der Email-Adressen ist ein Fehler aufgetreten."
    );
  }

  static delete(data: EmailAddressDTO): Promise<any> {
    const request = { id: data.id } as DeleteEmailaddressRequest;

    return handleOpenApiError(
      this.API.deleteEmailaddress(request),
      "Beim Löschen der E-Mail-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }
}
