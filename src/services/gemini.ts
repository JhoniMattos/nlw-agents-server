import { GoogleGenerativeAI } from "@google/generative-ai"
import { env } from "../env.ts"

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
})

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await model.generateContent([
    {
      text: "Transcreva o áudio para português do Brasil. Seja preciso e natural.",
    },
    {
      inlineData: {
        mimeType,
        data: audioAsBase64,
      },
    },
  ])

  const text = response.response.text()

  if (!text) {
    throw new Error("Erro ao transcrever áudio")
  }

  return text
}

export async function generateEmbeddings(text: string) {
  const embeddingModel = genAI.getGenerativeModel({
    model: "text-embedding-004",
  })

  const result = await embeddingModel.embedContent(text)

  return result.embedding.values
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join("\n\n")

  const prompt = `
  CONTEXTO:
  ${context}

  PERGUNTA:
  ${question}

  INSTRUÇÕES: 
  - Use apenas informações contidas no contexto enviado; 
  - Se a resposta não for encontrada no contexto, apenas responsa que não possui informações sufuciente para responder; 
  - Seja objetivo; - Mantenha um tom educativo e profissional; 
  - Cite trechos relevantes do contexto se apropriado; 
  - Se for citar o contexto, utilize o termo "conteúdo da aula";
  `.trim()

  const response = await model.generateContent(prompt)

  const text = response.response.text()

  if (!text) {
    throw new Error("Erro ao gerar resposta")
  }

  return text
}
