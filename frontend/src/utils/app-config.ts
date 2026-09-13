import { TopicModel } from "../models/topic-model";

class AppConfig {
    private readonly baseUrl = "http://localhost:4300";

    public readonly chunksUrl = this.baseUrl + "/api/chunks";
    public readonly askUrl = this.baseUrl + "/api/ask";

    public readonly suggestionsPerRound = 3;

    // Part A of the handbook, which sets up the two chapters everything else
    // rests on. It carries its own numbering in the book, so it is kept apart.
    public readonly introTopics: TopicModel[] = [
        new TopicModel("Security architectures for network and information systems", "ארכיטקטורות אבטחה למערכות רשת ומידע"),
        new TopicModel("Assessing the risk", "הערכת הסיכון")
    ];

    // Part B: the eighteen control chapters, taken from the handbook's own table
    // of contents. Suggestions are drawn from the whole book, both parts, so
    // they never circle the same few pages.
    public readonly handbookTopics: TopicModel[] = [
        new TopicModel("Inventory of hardware and software assets", "מצאי נכסי חומרה ותוכנה"),
        new TopicModel("Secure configuration of devices and applications", "תצורה מאובטחת של מכשירים ויישומים"),
        new TopicModel("Application and services execution control", "בקרת הרצה של יישומים ושירותים"),
        new TopicModel("Access control", "בקרת גישה"),
        new TopicModel("User authentication", "אימות משתמשים"),
        new TopicModel("Network security", "אבטחת רשת"),
        new TopicModel("Malware protection", "הגנה מפני תוכנות זדוניות"),
        new TopicModel("Maintenance and analysis of event logs", "תחזוקה וניתוח של יומני אירועים"),
        new TopicModel("Web application security", "אבטחת יישומי ווב"),
        new TopicModel("Teleworking", "עבודה מרחוק"),
        new TopicModel("Use of cryptography", "שימוש בהצפנה"),
        new TopicModel("Cybersecurity skills and awareness training", "הכשרה ומודעות לאבטחת מידע"),
        new TopicModel("Supply chain risk management", "ניהול סיכוני שרשרת אספקה"),
        new TopicModel("Cybersecurity technical assessments", "הערכות טכניות של אבטחת מידע"),
        new TopicModel("Physical security measures", "אמצעי אבטחה פיזיים"),
        new TopicModel("Data backups", "גיבויי נתונים"),
        new TopicModel("Incident handling", "טיפול באירועי אבטחה"),
        new TopicModel("Business continuity and disaster recovery", "המשכיות עסקית והתאוששות מאסון")
    ];

    // Every string the interface shows, in both languages.
    public readonly text = {
        en: {
            title: "Cybersecurity Q&A",
            source: "Hellenic Republic National Cybersecurity Authority. 76 pages, 20 chapters.",
            chapters: "CHAPTERS",
            tryAsking: "TRY ASKING",
            suggest: "Suggest questions",
            suggesting: "Asking the handbook...",
            followUps: "Suggest follow-up questions",
            findingFollowUps: "Finding related questions...",
            placeholder: "Ask the handbook anything...",
            ask: "Ask",
            thinking: "Thinking...",
            grounded: "GROUNDED IN THE HANDBOOK",
            empty: "Answers are drawn from the handbook, never invented.",
            failed: "Something went wrong. ",
            other: "עברית",
            defaults: [
                "What makes a strong user authentication policy?",
                "How should we handle a security incident?",
                "What are the best practices for data backups?"
            ]
        },
        he: {
            title: "שאלות ותשובות · אבטחת מידע",
            source: "רשות הסייבר הלאומית של יוון. 76 עמודים, 20 פרקים.",
            chapters: "פרקים",
            tryAsking: "אפשר לשאול",
            suggest: "הצע שאלות",
            suggesting: "שואל את הספר...",
            followUps: "הצע שאלות המשך",
            findingFollowUps: "מחפש שאלות קשורות...",
            placeholder: "שאל כל שאלה על הספר...",
            ask: "שאל",
            thinking: "חושב...",
            grounded: "מבוסס על הספר",
            empty: "כל התשובות נשענות על הספר, אף אחת לא מומצאת.",
            failed: "משהו השתבש. ",
            other: "English",
            defaults: [
                "מה מרכיב מדיניות אימות משתמשים חזקה?",
                "כיצד יש לטפל באירוע אבטחה?",
                "מהן שיטות העבודה המומלצות לגיבויים?"
            ]
        }
    };
}

export const appConfig = new AppConfig();
