import { useRef, useState } from "react";
import { ragService } from "../../services/rag-service";
import { appConfig } from "../../utils/app-config";
import "./ask.css";

export function Ask() {

    const [language, setLanguage] = useState<string>("en");
    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [followUps, setFollowUps] = useState<string[]>([]);
    const [suggesting, setSuggesting] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<string[]>(appConfig.text.en.defaults);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [chapter, setChapter] = useState<string>("");

    // Chapters already used, so a round never repeats one until all eighteen
    // have had their turn.
    const usedTopics = useRef<string[]>([]);

    // Chapters already opened, so coming back to one is instant instead of
    // waiting on the model again. Keyed by chapter and language together,
    // because the same chapter reads differently in each.
    const chapterCache = useRef<Record<string, string[]>>({});

    const text = language === "he" ? appConfig.text.he : appConfig.text.en;

    function nextTopics(): string[] {

        const everyTopic = appConfig.introTopics
            .concat(appConfig.handbookTopics)
            .map(topic => topic.en);

        let pool = everyTopic.filter(topic => !usedTopics.current.includes(topic));

        // Every chapter has been covered, so the book opens again from the top.
        if (pool.length < appConfig.suggestionsPerRound) {
            usedTopics.current = [];
            pool = everyTopic;
        }

        const picked: string[] = [];

        while (picked.length < appConfig.suggestionsPerRound) {
            const topic = pool[Math.floor(Math.random() * pool.length)];
            if (!picked.includes(topic)) picked.push(topic);
        }

        usedTopics.current = usedTopics.current.concat(picked);

        return picked;
    }

    async function send(event: React.FormEvent): Promise<void> {

        event.preventDefault();

        try {
            setLoading(true);
            setAnswer("");
            setFollowUps([]);

            const result = await ragService.ask(question, language);

            setAnswer(result);
        }
        catch (err: any) {
            setAnswer(text.failed + (err.response?.data?.message ?? err.message));
        }
        finally {
            setLoading(false);
        }
    }

    // Picking a chapter opens it: three ways into that chapter, ready to send.
    async function openChapter(topic: string): Promise<void> {

        const key = topic + "|" + language;

        setChapter(topic);
        setAnswer("");
        setFollowUps([]);

        // Seen before: no request, no wait.
        if (chapterCache.current[key]) {
            setSuggestions(chapterCache.current[key]);
            return;
        }

        try {
            setRefreshing(true);

            const result = await ragService.suggestForTopic(topic, language);

            chapterCache.current[key] = result;
            setSuggestions(result);
        }
        catch { setSuggestions([]); }
        finally { setRefreshing(false); }
    }

    async function refreshSuggestions(): Promise<void> {

        try {
            setChapter("");
            setRefreshing(true);

            const result = await ragService.suggestOpeners(nextTopics(), language);

            setSuggestions(result);
        }
        catch { /* the current questions stay as they are */ }
        finally { setRefreshing(false); }
    }

    async function suggest(): Promise<void> {

        try {
            setSuggesting(true);

            const result = await ragService.suggestFollowUps(question, language);

            setFollowUps(result);
        }
        catch { setFollowUps([]); }
        finally { setSuggesting(false); }
    }

    function pick(item: string): void {
        setQuestion(item);
        setFollowUps([]);
    }

    function switchLanguage(): void {
        const next = language === "he" ? "en" : "he";
        setLanguage(next);
        setSuggestions(next === "he" ? appConfig.text.he.defaults : appConfig.text.en.defaults);
        setFollowUps([]);
        setChapter("");
    }

    return (
        <div className="Ask" dir={language === "he" ? "rtl" : "ltr"} lang={language}>

            <div>
                <h1>{text.title}</h1>

                <button type="button" onClick={switchLanguage}>{text.other}</button>

                <p>{text.source}</p>

                <div>
                    <ol>
                        {appConfig.introTopics.map(topic => (
                            <li key={topic.en}>
                                <button type="button"
                                        data-open={topic.en === chapter ? "" : undefined}
                                        onClick={() => openChapter(topic.en)}>
                                    {language === "he" ? topic.he : topic.en}
                                </button>
                            </li>
                        ))}
                    </ol>

                    <ol>
                        {appConfig.handbookTopics.map(topic => (
                            <li key={topic.en}>
                                <button type="button"
                                        data-open={topic.en === chapter ? "" : undefined}
                                        onClick={() => openChapter(topic.en)}>
                                    {language === "he" ? topic.he : topic.en}
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div>

                {answer && <p>{answer}</p>}

                {!answer && !loading && (suggestions.length > 0 || !refreshing) &&
                    <div>
                        <button type="button" disabled={refreshing} onClick={refreshSuggestions}>
                            {refreshing ? text.suggesting : text.suggest}
                        </button>

                        {suggestions.map(item => (
                            <button key={item} type="button" onClick={() => pick(item)}>
                                {item}
                            </button>
                        ))}
                    </div>}

                {answer && !loading &&
                    <section>
                        {followUps.length === 0 &&
                            <button type="button" disabled={suggesting} onClick={suggest}>
                                {suggesting ? text.findingFollowUps : text.followUps}
                            </button>}

                        {followUps.map(item => (
                            <button key={item} type="button" onClick={() => pick(item)}>
                                {item}
                            </button>
                        ))}
                    </section>}

                <form onSubmit={send}>

                    <input type="text" required dir="auto"
                           value={question}
                           onChange={event => setQuestion(event.target.value)}
                           placeholder={text.placeholder} />

                    <button disabled={loading}>
                        {loading ? text.thinking : text.ask}
                    </button>

                </form>

            </div>

        </div>
    );
}
