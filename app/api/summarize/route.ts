export async function POST(req: Request) {

  const { text } = await req.json()

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: `Summarize this text in simple bullet points:\n\n${text}`
        }
      ]
    })
  })

  const data = await response.json()

  return Response.json({
    summary: data.choices[0].message.content
  })
}