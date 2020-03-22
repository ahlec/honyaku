// import { resolve as dnsResolve } from "dns";
import { setServers as setDnsServers } from "dns";
import { IncomingMessage } from "http";
import { request, RequestOptions as NativeRequestOptions } from "https";

import Logger from "@server/Logger";

setDnsServers(["8.8.8.8"]);

// function resolveHostnameWithRetries(
//   hostname: string,
//   retriesRemaining: number
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     dnsResolve(hostname, "A", async (err, addresses) => {
//       if (err) {
//         Logger.error("[HttpsRequester]", err);

//         if (retriesRemaining <= 0) {
//           reject(new Error("Could not resolve hostname."));
//           return;
//         }

//         try {
//           const recursiveRetries = retriesRemaining - 1;
//           Logger.info(
//             `[HttpsRequester] Received error with resolving '${hostname}'. Retrying with ${recursiveRetries} more retries.`
//           );
//           const recursiveResult = await resolveHostnameWithRetries(
//             hostname,
//             recursiveRetries
//           );
//           resolve(recursiveResult);
//         } catch (e) {
//           reject(e);
//         }

//         return;
//       }

//       const [address] = addresses;
//       Logger.log("alec>", addresses);
//       if (!address) {
//         reject(new Error("Resolved to no addresses."));
//       }

//       resolve(address);
//     });
//   });
// }

async function makeHttpsRequest(
  options: NativeRequestOptions
): Promise<IncomingMessage> {
  console.log(options);
  return new Promise((resolve, reject) => {
    const req = request(options, resolve);
    req.on("error", reject);
    req.end();
  });
}

interface RequestOptions {
  method?: string;
  path?: string | null;
}

export interface RequesterResponse {
  body: string;
}

export default class HttpsRequester {
  private cachedIpAddress: string | null = "182.22.28.252";

  public constructor(private readonly hostname: string) {}

  public async request(options: RequestOptions): Promise<RequesterResponse> {
    const ipAddress = await this.getIpAddress();

    let response: IncomingMessage;
    try {
      response = await makeHttpsRequest({
        ...options,
        host: ipAddress,
        port: 443,
        servername: this.hostname
      });
    } catch (e) {
      this.cachedIpAddress = null;
      throw e;
    }

    if (response.statusCode !== 200) {
      throw new Error(`Received status code of ${response.statusCode}.`);
    }

    return new Promise(resolve => {
      const chunks: string[] = [];
      response.on("data", chunk => chunks.push(chunk));
      response.on("end", () =>
        resolve({
          body: chunks.join("")
        })
      );
    });
  }

  private async getIpAddress(): Promise<string> {
    // if (this.cachedIpAddress) {
    //   return this.cachedIpAddress;
    // }

    // Logger.info(
    //   `[HttpsRequester] Do not have IP for '${this.hostname}' cached. Looking up.`
    // );
    // const resolved = await resolveHostnameWithRetries(this.hostname, 5);
    // Logger.info(
    //   `[HttpsRequester] Resolved '${this.hostname}' to '${resolved}'.`
    // );

    // this.cachedIpAddress = resolved;
    // return resolved;
    return this.hostname;
  }
}
