/* eslint-disable no-console */

import { PangeaConfig, UserIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const userIntel = new UserIntelService(String(token), config);

(async () => {
  console.log("Checking user breached by username...");

  const request = { username: "shortpatrick", verbose: true, raw: true };
  try {
    const response = await userIntel.userBreached(request);
    console.log("Result: ", response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
