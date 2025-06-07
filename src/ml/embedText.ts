import * as ort from 'onnxruntime-node'
import { BertTokenizer } from 'bert-tokenizer'

const tokenizer = new BertTokenizer('models/vocab.txt', true)

function tokenizeText(text: string): { inputIds: number[]; attentionMask: number[] } {
  const maxLen = 128
  const tokens = tokenizer.tokenize(text)

  let inputIds = tokenizer.convertTokensToId(tokens.toString())

  if (inputIds.length > maxLen) {
    inputIds = inputIds.slice(0, maxLen)
  }

  const attentionMask = Array(inputIds.length).fill(1)

  while (inputIds.length < maxLen) {
    inputIds.push(0)
    attentionMask.push(0)
  }

  return { inputIds, attentionMask }
}


export async function embedText(text: string): Promise<number[]> {
  const session = await ort.InferenceSession.create(
    process.env.SBERT_ONNX_PATH || 'models/sbert.onnx',
    { executionProviders: ['CUDAExecutionProvider'] }
  )

  const { inputIds, attentionMask } = tokenizeText(text)
  const inputIds64 = BigInt64Array.from(inputIds.map(v => BigInt(v)))
  const mask64     = BigInt64Array.from(attentionMask.map(v => BigInt(v)))

  const feeds: Record<string, ort.Tensor> = {
    input_ids      : new ort.Tensor('int64', inputIds64,  [1, inputIds.length]),
    attention_mask : new ort.Tensor('int64', mask64,     [1, attentionMask.length])
  }

  const results = await session.run(feeds)
  const output  = results['pooled_output'] as ort.Tensor
  return Array.from(output.data as Float32Array)
}
