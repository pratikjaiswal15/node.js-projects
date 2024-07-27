const AWS = require("aws-sdk");
const axios = require("axios");
const crypto = require("crypto");

const region = "eu-central-1";
AWS.config.update({
  region: region, // Replace with your API Gateway region
});

const accessKeyId = "my-access-key";
const secretAccessKey = "my-secret-key";

const credentials = new AWS.Credentials({
  accessKeyId: accessKeyId, // Replace with your access key ID
  secretAccessKey: secretAccessKey, // Replace with your secret access key
});

const endpoint =
  "https://apiId.execute-api.eu-central-1.amazonaws.com/Stage/v1/sitewise-edge/create-source";
const method = "POST"; // Replace with your HTTP method
const service = "execute-api";
const host = endpoint.split("/")[2];
const path = endpoint.split(host)[1];
const canonicalUri = path;

const now = new Date();
const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
const dateStamp = now.toISOString().split("T")[0].replace(/-/g, "");

const canonicalQuerystring = ""; // Add query parameters if any
const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
const signedHeaders = "host;x-amz-date";
const payloadHash = crypto
  .createHash("sha256")
  .update("", "utf8")
  .digest("hex");
const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

const algorithm = "AWS4-HMAC-SHA256";
const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto
  .createHash("sha256")
  .update(canonicalRequest, "utf8")
  .digest("hex")}`;

const kDate = crypto
  .createHmac("sha256", `AWS4${credentials.secretAccessKey}`)
  .update(dateStamp)
  .digest();
const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
const kSigning = crypto
  .createHmac("sha256", kService)
  .update("aws4_request")
  .digest();

const signature = crypto
  .createHmac("sha256", kSigning)
  .update(stringToSign)
  .digest("hex");

const authorizationHeader = `${algorithm} Credential=${credentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

const body = {
  account: {
    accountId: "96323971490",
  },
  region: "eu-central-1",
  gatewayId: "gduwisgdigd",
  dataSource: {
    id: "nfjkebjkbehjkbhjebh",
    name: "data source name latest",
  },
};
const requestOptions = {
  method,
  url: endpoint,
  data: JSON.stringify(body),
  headers: {
    "x-amz-date": amzDate,
    Authorization: authorizationHeader,
  },
};

axios(requestOptions)
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Headers:", error.response.headers);
    } else if (error.request) {
      // No response received from the server
      console.error("Error Request Data:", error.request);
    } else {
      // Something else happened while setting up the request
      console.error("Error Message:", error.message);
    }
    console.error("Error Config:", error.config);
  });
