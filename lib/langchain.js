import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";

import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

// ----------------------------//

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2",
});

// ----------------------------//

export async function generateDocs(docId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("No User Found");

    console.log("Downloading url from firebase");
    const firebaseRef = await adminDb
      .collection("users")
      .doc(userId)
      .collection("files")
      .doc(docId)
      .get();
    const downloadUrl = firebaseRef.data()?.downloadUrl;

    if (!downloadUrl) throw new Error("Download URL is corrupted");

    const response = await fetch(downloadUrl);
    const data = await response.blob();

    const loader = new PDFLoader(data);
    const docs = await loader.load();

    console.log("--splitting the documents into chunks---");

    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);

    console.log(`--- Split into ${splitDocs.length} parts ---`);
    return splitDocs;
  } catch (error) {
    console.error(error);
  }
}

// ---------------------------//

const namespaceExists = async (index, namespace) => {
  try {
    if (namespace === null) throw new Error("No namespace value provided");

    const { namespaces } = await index.describeIndexStats();
    console.log("Status-checked of pinecone vector store");
    return namespaces?.[namespace] !== undefined;
  } catch (error) {
    console.error(error);
  }
};

const indexName = "saaszaib";

export async function generateEmbeddingsInPineconeVectorStore(docId) {
  const { userId } = await auth();
  if (!userId) throw new Error("No User Found");

  let pineconeVectorStore;

  console.log("-----Generating Embeddings from the split documents ----");

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExist = await namespaceExists(index, docId);

  if (namespaceAlreadyExist) {
    console.log(
      `---Namespace ${docId} already exists, reusing existing embeddings..----`
    );
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
    return pineconeVectorStore;
  } else {
    const splitDocs = await generateDocs(docId);
    console.log(
      `---Storing the embeddings in namespace ${docId} in the ${indexName}---`
    );
    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );
    return pineconeVectorStore;
  }
}
