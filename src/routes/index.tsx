import { createFileRoute } from "@tanstack/react-router";
import { NerdQuiz } from "@/components/NerdQuiz";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "NERD — Квиз для своих" },
      { name: "description", content: "Проверь знания кино, игр и комиксов и заслужи награду NERD." },
      { property: "og:title", content: "NERD — Квиз для своих" },
      { property: "og:description", content: "Три вопроса. Одна тема. Награда для настоящих нердов." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NerdQuiz,
});
