import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
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

const model = new ChatOpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY,
    modelName: "gpt-4o"
});

//----------------------------//

export async function generateDocs(docId) {
    try {
        const {userId} = await auth();

        if(!userId){
          throw new Error("No User Founc")
        }

        // download downloadUrl that is link saved in firebase 
        console.log("Downloading url from firebase");
        const firebaseRef = await adminDb.collection("users").doc(userId).collection("files").doc(docId).get();
        const downloadUrl = firebaseRef.data()?.downloadUrl;

        if(!downloadUrl) throw new Error("Download url is currupted");

        // feth pdf from specified url
        const response = await fetch(downloadUrl);

        // load the pdf into pdf doc object == it will not be in text format
        const data = await response.blob();
        const loader = new PDFLoader(data);
        const docs = await loader.load();

        // spliting the document 
        console.log("--splitting the documents into chunks---",)

        const splitter = new RecursiveCharacterTextSplitter();
        const splitDocs = await splitter.splitDocuments(docs);

        console.log(`--- Split into ${splitDocs.length} parts ---`);

        return splitDocs;




    } catch (error) {
        console.error(error)
    }
}

//---------------------------//

const namespaceExists = async(index,namespace)=>{
  try {
    if(namespace === null) throw new Error("No namespace value provided")
        const {namespaces} = await index.describeIndexStats();
        console.log("Status-checked of pinecone vector stor")
        return namespaces?.[namespace] !== undefined
  } catch (error) {
    console.error(error)
  }
}



const indexName = 'saaszaib';

export async function generateEmbeddingsInPineconeVectorStore(docId){
  const {userId} = await auth();

  if(!userId){
    throw new Error("No User Founc")
  }

  let pineconeVectorStore;

   console.log("-----Generating Embeddings form the split documents ----")

   const embeddings = new OpenAIEmbeddings();

   //connect to pinecone
   const index = await pineconeClient.index(indexName);
   const namespaceAlreadyExist = await namespaceExists(index, docId)

   // if the pdf that the client is trying to use if it already exist in the database
   // so we will use the store one will not go to create new embeddings because this process will
   //can be cost us huge amout of bill at the end of month 
   
   if(namespaceAlreadyExist){
    console.log(`---Namespace ${docId} already exists, reusing existing embeddings..----`)
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: docId,
    })
    return pineconeVectorStore;
   }else{

    // if hte namespce ain't exist take the file from firebase download it form firebase, generate embeddings and store to the pinecone vecotor store.
    
    const splitDocs = await generateDocs(docId)
    
    // know we have to store the embeddings into the database 
    console.log(`---Storing the embeddings in namespace ${docId} in the ${indexName}---`);
    pineconeVectorStore = await PineconeStore.fromDocuments(
        splitDocs,
        embeddings, {
        pineconeIndex: index,
        namespace: docId,
    })
    return pineconeVectorStore;
   }
  
  
}


