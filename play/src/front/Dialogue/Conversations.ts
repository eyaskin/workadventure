export interface Choice {
    text: string;
    motivationDelta: number; // can be negative or positive
    next?: string; // next node id; if undefined, conversation ends
    statistic?: string; // optional educational stat to display after this choice
}

export interface DialogueNode {
    id: string;
    npcLine: string;
    choices: Choice[];
}

export interface Conversation {
    start: string; // node id
    nodes: Record<string, DialogueNode>;
}

export type ConversationMap = Record<string, Conversation>; // keyed by NPC name

export const conversations: ConversationMap = {
    Marisa: {
        start: "intro",
        nodes: {
            intro: {
                id: "intro",
                npcLine: "I’m feeling stretched. Workloads pile up and it’s hard to stay engaged.",
                choices: [
                    { text: "Ask to prioritize and adjust workload", motivationDelta: +12, next: "prioritize" },
                    { text: "Tell them to push through it", motivationDelta: -10, next: "wrap" },
                ],
            },
            prioritize: {
                id: "prioritize",
                npcLine: "If we clarify priorities and drop low‑value tasks, that would help a lot.",
                choices: [
                    { text: "Set clear goals and tradeoffs together", motivationDelta: +15, next: "growth" },
                    { text: "Keep everything as is", motivationDelta: -12, next: "wrap" },
                ],
            },
            growth: {
                id: "growth",
                npcLine: "I’d like more growth—mentoring, feedback, maybe a skill goal to work toward.",
                choices: [
                    { text: "Offer mentoring and a growth plan", motivationDelta: +18, next: "recognition" },
                    { text: "Postpone development indefinitely", motivationDelta: -10, next: "wrap" },
                ],
            },
            recognition: {
                id: "recognition",
                npcLine: "Small wins often go unnoticed. Recognition would boost morale.",
                choices: [
                    { text: "Create a practice to celebrate wins weekly", motivationDelta: +14, next: "safety" },
                    { text: "Recognition isn't necessary", motivationDelta: -8, next: "wrap" },
                ],
            },
            safety: {
                id: "safety",
                npcLine: "I speak up less when mistakes are punished. I want a safe place to learn.",
                choices: [
                    { text: "Normalize learning and blameless post‑mortems", motivationDelta: +16, next: "wrap" },
                    { text: "Enforce zero‑tolerance for mistakes", motivationDelta: -14, next: "wrap" },
                    {
                        text: "Misgender or use the wrong pronouns",
                        motivationDelta: -25,
                        next: "wrap",
                        statistic:
                            "Research shows misgendering severely harms retention — about 35% of misgendered employees quit or consider quitting.",
                    },
                ],
            },
            wrap: {
                id: "wrap",
                npcLine: "Thanks. With priorities, growth, and recognition, I feel more committed.",
                choices: [
                    { text: "Reinforce next steps and follow‑up", motivationDelta: +6 },
                ],
            },
        },
    },
    Arielle: {
        start: "intro",
        nodes: {
            intro: {
                id: "intro",
                npcLine: "Great managers reduce attrition by supporting autonomy, competence, and belonging.",
                choices: [
                    { text: "Ask for a concrete next step", motivationDelta: +12, next: "step" },
                    { text: "Say people just need to toughen up", motivationDelta: -12, next: "wrap" },
                ],
            },
            step: {
                id: "step",
                npcLine: "Pick one practice now: small wins, regular 1:1s, or removing a blocker.",
                choices: [
                    { text: "Plan a small win this week", motivationDelta: +14, next: "wrap" },
                    { text: "Schedule recurring 1:1s", motivationDelta: +12, next: "wrap" },
                    { text: "Remove one team blocker", motivationDelta: +10, next: "wrap" },
                ],
            },
            wrap: {
                id: "wrap",
                npcLine: "Keep iterating—clear goals, feedback, and recognition compound over time.",
                choices: [
                    { text: "Thanks", motivationDelta: +4 },
                ],
            },
        },
    },
    "DEI Advisor": {
        start: "intro",
        nodes: {
            intro: {
                id: "intro",
                npcLine: "Let’s talk about everyday behaviors that build (or break) belonging at work.",
                choices: [
                    { text: "Ask about pronouns and respectful language", motivationDelta: +14, next: "pronouns" },
                    { text: "Say it's not a manager's job", motivationDelta: -12, next: "wrap" },
                ],
            },
            pronouns: {
                id: "pronouns",
                npcLine: "Using correct names and pronouns signals respect. Mistakes happen—correct yourself and move on.",
                choices: [
                    {
                        text: "Model sharing pronouns and correct mistakes",
                        motivationDelta: +18,
                        next: "microaggressions",
                        statistic:
                            "Teams that normalize correct names/pronouns report higher belonging and lower turnover intention.",
                    },
                    {
                        text: "Dismiss pronouns as unnecessary",
                        motivationDelta: -20,
                        next: "microaggressions",
                        statistic:
                            "Misgendering erodes trust; about 35% of affected employees quit or consider quitting.",
                    },
                ],
            },
            microaggressions: {
                id: "microaggressions",
                npcLine:
                    "Microaggressions add up. Address them early and privately; focus on impact and how to do better.",
                choices: [
                    {
                        text: "Acknowledge impact and set a team norm",
                        motivationDelta: +16,
                        next: "wrap",
                        statistic:
                            "Psychological safety correlates with lower attrition and higher performance in multiple org studies.",
                    },
                    {
                        text: "Ignore it to avoid conflict",
                        motivationDelta: -16,
                        next: "wrap",
                    },
                ],
            },
            wrap: {
                id: "wrap",
                npcLine: "Small, consistent habits—respectful language, quick repairs, recognition—build a healthy culture.",
                choices: [{ text: "Got it", motivationDelta: +6 }],
            },
        },
    },
};


