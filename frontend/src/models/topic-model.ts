// A chapter of the handbook. The English title is what goes into the prompt,
// because the handbook itself is written in English; the Hebrew title is only
// ever shown on screen.
//
// The fields are declared in full rather than as constructor parameters: the
// frontend compiles with erasableSyntaxOnly, which forbids the shorthand the
// backend uses in ClientError.
export class TopicModel {

    public en: string;
    public he: string;

    public constructor(en: string, he: string) {
        this.en = en;
        this.he = he;
    }
}
