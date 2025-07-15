import { Pinecone } from "@pinecone-database/pinecone";

if(!process.env.PINECONE_SECURE_KEY) {
  throw new Error("Pinecone api key is missing")
}

const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_SECURE_KEY
})

export default pineconeClient;
