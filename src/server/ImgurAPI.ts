import { Client } from "@rmp135/imgur";

export interface ImgurConfig {
  accessToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface UploadedImage {
  id: string;
  link: string;
}

export default class ImgurAPI {
  private readonly client: Client;

  public constructor(config: ImgurConfig) {
    this.client = new Client({
      access_token: config.accessToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken
    });
  }

  public async uploadImage(
    title: string,
    contents: Buffer
  ): Promise<UploadedImage> {
    const base64 = contents.toString("base64");
    const result = await this.client.Image.upload(base64, {
      type: "base64",
      title
    });

    if (!result.success) {
      throw new Error("The request to upload the file failed.");
    }

    return {
      id: result.data.id,
      link: result.data.link
    };
  }
}
