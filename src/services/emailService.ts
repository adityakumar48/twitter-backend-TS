import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
require("dotenv").config();
const ses = new SESClient({});

const createSendEmailCommand = (
  toAddresses: string,
  fromAddress: string,
  message: string
) => {
  return new SendEmailCommand({
    Destination: { ToAddresses: [toAddresses] },
    Source: fromAddress,
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Your One-time  password",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
    },
  });
};

export async function sendEmailToken(email: string, token: string) {
  console.log("email: ", email, token);
  const message = `Your one-time password is ${token}`;
  const command = createSendEmailCommand(
    email,
    "adityakumarverified@gmail.com",
    message
  );
  try {
    return await ses.send(command);
  } catch (error) {
    console.log(error);
  }
}
