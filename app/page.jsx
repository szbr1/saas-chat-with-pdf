import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function Home() {
  const features = [
    {
      name: "Intelligent Chat Memory",
      description:
        "Our AI remembers past conversations to deliver a seamless, personalized chat experience.",
      icon: BrainCogIcon,
    },
    {
      name: "Rapid Response System",
      description:
        "Enjoy instant, accurate answers with our fast and reliable response engine.",
      icon: ZapIcon,
    },
    {
      name: "Interactive PDF Experience",
      description:
        "View and interact with PDFs like never before using our dynamic, user-friendly viewer.",
      icon: EyeIcon,
    },
    {
      name: "Secure Cloud Storage",
      description:
        "Keep your PDF documents safe and accessible anytime with secure cloud storage.",
      icon: GlobeIcon,
    },
    {
      name: "Automated Cloud Backup",
      description:
        "Your documents are automatically backed up to the cloud, ensuring complete data protection.",
      icon: ServerCogIcon,
    },
  ];

  return (
    <>
      <div className="h-full bg-gradient-to-bl overflow-y-scroll  from-blue-600/80 to-blue-100 p-2 lg:p-5 ">
        <div className="md:flex md:justify-center flex-col w-full md:px-42 md:py-22 py-16 px-4 bg-white rounded-sm ">
          <span className="text-blue-700 font-semibold text-sm md:text-lg md:flex justify-center">
            Your interactive Document Companion
          </span>
          <h2 className="font-bold text-2xl md:text-6xl md:flex justify-center">
            Transform Your PDFs into <br /> Interactive Conversation
          </h2>
          <div className="py-4 text-lg md:flex min-w-full justify-center ">
            Introducing{" "}
            <span className="text-blue-700 font-semibold">
              &nbsp;Chat with PDF.
            </span>
          </div>
          <article className="py-8 text-md md:text-xl font-mono">
            Upload your doucument, and our <br className="md:hidden" /> chatbot
            will answer questions, summarize content and answers all your Qs.
            Ideal for everyone ,{" "}
            <span className="text-blue-700"> Chat with PDF</span> turns static
            documents into{" "}
            <span className="font-semibold">dynamic converstation</span>,
            enchancing productivity 10x fold effortlessly.
          </article>

          <div className="w-full flex justify-center items-center">
            <Button> <SignInButton>Get Started</SignInButton></Button>
          </div>
          <div className="relative h-auto mt-18 ">
            <Image
              src={"https://i.imgur.com/VciRSTI.jpeg"}
              height={2432}
              width={1442}
            />
            <div className="absolute bottom-0 w-full h-12 backdrop:blur-sm bg-gradient-to-t from-white"></div>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 ">
            {features?.map((ch) => {
              return (
                <div key={ch.icon} className="flex items-start  gap-2">
                  <span className="mt-1">
                    {" "}
                    <ch.icon className="size-5  text-blue-700" />
                  </span>
                  <span>
                    <span className="font-semibold">{ch.name}</span>{" "}
                    {ch.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
