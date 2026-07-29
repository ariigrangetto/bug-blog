export type Status = "Open" | "Solved";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Category = "Runtime" | "Logic" | "UI" | "Performance" | "Security" | "Network" | "Other";
export type Filter = "All" | Severity | Status;
export type CodeLang =
    | "JavaScript"
    | "TypeScript"
    | "Python"
    | "Java"
    | "Go"
    | "Rust"
    | "C++"
    | "C#"
    | "CSS"
    | "HTML"
    | "SQL"
    | "Shell";

export type Bugs = {
    id: string;
    created_at: string;
    user_id: string;
    status: Status;
    code: string;
    solution: string;
    description: string;
    severity: Severity;
    category: Category;
    title: string;
    language: CodeLang;
};

export type BugInsert = {
    id?: string;
    created_at?: string;
    user_id: string;
    status: Status;
    code: string;
    solution: string;
    description: string;
    severity: Severity;
    category: Category;
    title: string;
    language: CodeLang;
};

export type BugUpdate = {
    id?: string;
    created_at?: string;
    user_id?: string;
    status?: Status;
    code?: string;
    solution?: string;
    description?: string;
    severity?: Severity;
    category?: Category;
    title?: string;
    language?: CodeLang;
};

export type Database = {
    public: {
        Tables: {
            Bugs: {
                Row: Bugs;
                Insert: BugInsert;
                Update: BugUpdate;
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
};
