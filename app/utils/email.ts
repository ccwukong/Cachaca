export default async function sendEmail({
  endpoint,
  apiToken,
  subject,
  body,
  from,
  sender,
  to,
}: {
  endpoint: string
  apiToken: string
  subject: string
  body: string
  from: string
  sender: string
  to: string
}) {
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      from: { email: from, name: sender },
      to: [{ email: to }],
      subject,
      html: body,
    }),
  })
}
