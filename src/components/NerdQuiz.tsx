import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import shirtAsset from "@/assets/nerd-shirt.png.asset.json";
import logoUrl from "@/assets/nerd-logo.svg?url";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PspScene } from "./PspScene";

type TopicKey = "cinema" | "games" | "comics";
type Phase = "landing" | "quiz" | "celebration" | "reward";

const QUIZ = {
  cinema: {
    label: "Кино",
    questions: [
      { text: 'Кто играл Джокера в «Тёмном рыцаре»?', answers: ["хит леджер", "heath ledger"] },
      { text: 'Как называется существо, которое имплантирует зародыша ксеноморфа в человека в «Чужом»?', answers: ["лицехват", "facehugger", "фейсхаггер"] },
      { text: "Фильм Нолана, где время идёт с разной скоростью на разных уровнях?", answers: ["начало", "inception"] },
    ],
  },
  games: {
    label: "Игры",
    questions: [
      { text: "Как зовут дочь Гарри Мейсона в Silent Hill?", answers: ["шерил", "cheryl"] },
      { text: "Как называется проклятие бессмертия, которым отмечена нежить в Dark Souls?", answers: ["темное клеймо", "тёмное клеймо", "темная метка", "тёмная метка", "darksign"] },
      { text: "Как зовут ИИ-антагониста в Portal?", answers: ["glados", "гладос", "gla dos"] },
    ],
  },
  comics: {
    label: "Комиксы",
    questions: [
      { text: "Кто настоящий автор графического романа Watchmen?", answers: ["алан мур", "alan moore"] },
      { text: "Как называется секретная организация, на которую работает Ник Фьюри в Marvel?", answers: ["щит", "shield", "s h i e l d"] },
      { text: "Родная планета Супермена?", answers: ["криптон", "krypton"] },
    ],
  },
} satisfies Record<TopicKey, { label: string; questions: { text: string; answers: string[] }[] }>;

function normalize(value: string) {
  return value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").replace(/[^a-zа-я0-9]+/gi, " ").trim();
}

export function NerdQuiz() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [topic, setTopic] = useState<TopicKey>("cinema");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [motion, setMotion] = useState<"enter" | "exit" | "wrong">("enter");
  const [word, setWord] = useState("GOOD");
  const [notice, setNotice] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, delay: number) => {
    const timer = setTimeout(fn, delay);
    timers.current.push(timer);
  };

  const selectTopic = (key: TopicKey) => {
    setTopic(key);
    setQuestionIndex(0);
    setAnswer("");
    setMotion("enter");
    setPhase("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
    later(() => inputRef.current?.focus(), 520);
  };

  const submitAnswer = (event: FormEvent) => {
    event.preventDefault();
    const question = QUIZ[topic].questions[questionIndex];
    if (!question || !answer.trim()) return;
    const correct = question.answers.some((variant) => normalize(variant) === normalize(answer));
    if (!correct) {
      setMotion("wrong");
      later(() => {
        setAnswer("");
        setMotion("enter");
        inputRef.current?.focus();
      }, 520);
      return;
    }

    setMotion("exit");
    later(() => {
      if (questionIndex === 2) {
        setPhase("celebration");
        setWord("GOOD");
        later(() => setWord("JOB"), 1050);
        later(() => setPhase("reward"), 2150);
        return;
      }
      setQuestionIndex((current) => current + 1);
      setAnswer("");
      setMotion("enter");
      later(() => inputRef.current?.focus(), 50);
    }, 470);
  };

  if (phase === "quiz") {
    const question = QUIZ[topic].questions[questionIndex];
    if (!question) return null;
    return (
      <main className="grid min-h-svh place-items-center overflow-hidden bg-background px-5 py-10">
        <section className="w-full max-w-5xl" aria-live="polite">
          <div className="mb-10 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground sm:mb-16 sm:text-xs">
            <span>{QUIZ[topic].label}</span>
            <span>0{questionIndex + 1} / 03</span>
          </div>
          <div key={questionIndex} className={cn("question-panel", motion === "exit" && "question-exit", motion === "wrong" && "question-wrong")}>
            <h1 className="max-w-4xl text-3xl font-medium leading-[1.12] sm:text-5xl lg:text-6xl">{question.text}</h1>
            <form onSubmit={submitAnswer} className="mt-14 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:mt-20 sm:gap-7">
              <label className="min-w-0">
                <span className="sr-only">Ваш ответ</span>
                <input
                  ref={inputRef}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  autoComplete="off"
                  className="h-12 w-full border-0 border-b border-input bg-transparent px-0 text-lg text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/50 focus:border-primary focus:shadow-[0_5px_16px_-12px_var(--primary)] sm:text-xl"
                  placeholder="Введите ответ"
                />
              </label>
              <Button type="submit" variant="ghost" size="icon" aria-label="Ответить" className="h-12 w-12 shrink-0 rounded-full border border-border text-foreground hover:border-primary hover:bg-transparent hover:text-primary">
                <ArrowRight strokeWidth={1.25} />
              </Button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "celebration") {
    return (
      <main className="grid min-h-svh place-items-center overflow-hidden bg-background">
        <p key={word} className="celebration-word" aria-live="assertive">{word}</p>
      </main>
    );
  }

  if (phase === "reward") {
    return (
      <main className="grid min-h-svh place-items-center overflow-hidden bg-background px-5 py-10">
        <section className="reward-enter flex w-full max-w-3xl flex-col items-center text-center">
          <img src={shirtAsset.url} alt="Чёрная футболка NERD" className="h-auto max-h-[58svh] w-full object-contain" />
          <h1 className="mt-3 max-w-[18rem] text-2xl font-medium leading-tight sm:max-w-none sm:text-5xl">Молодец, ты заслужил</h1>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setNotice(true);
              later(() => setNotice(false), 2200);
            }}
            className="group mt-7 rounded-none px-0 text-sm font-normal uppercase text-foreground hover:bg-transparent hover:text-primary"
          >
            Заказать <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={1.2} />
          </Button>
          <p className={cn("mt-3 font-mono text-[10px] uppercase text-muted-foreground transition-opacity", notice ? "opacity-100" : "opacity-0")} aria-live="polite">Скоро в продаже</p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground">
      <section className="relative flex min-h-svh flex-col overflow-hidden">
        <header className="absolute inset-x-0 top-0 z-10 flex justify-center px-6 pt-7 sm:pt-9">
          <img src={logoUrl} alt="NERD" className="h-auto w-24 sm:w-28" />
        </header>
        <div className="flex flex-1 items-center pt-14">
          <PspScene />
        </div>
        <a href="#topics" className="group relative z-10 mx-auto mb-7 flex flex-col items-center gap-2 font-mono text-[10px] uppercase text-muted-foreground transition-colors hover:text-primary sm:mb-9">
          <span>Пройти тест</span>
          <ArrowDown className="nfs-arrow h-6 w-6" strokeWidth={1} />
        </a>
      </section>

      <section id="topics" className="grid min-h-svh place-items-center border-t border-border/50 px-5 py-24">
        <div className="w-full max-w-6xl">
          <p className="mb-16 text-center font-mono text-[10px] uppercase text-muted-foreground sm:mb-24">Выбери тему</p>
          <div className="grid gap-10 text-center sm:grid-cols-3 sm:gap-6">
            {(Object.keys(QUIZ) as TopicKey[]).map((key) => (
              <Button
                key={key}
                type="button"
                variant="ghost"
                onClick={() => selectTopic(key)}
                className="topic-button h-auto rounded-none bg-transparent py-4 text-2xl font-normal hover:bg-transparent sm:text-3xl lg:text-4xl"
              >
                «{QUIZ[key].label}»
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}