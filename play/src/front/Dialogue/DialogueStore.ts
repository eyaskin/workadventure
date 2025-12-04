import { writable } from "svelte/store";
import { conversations, type Conversation, type DialogueNode } from "./Conversations";
import { increaseMotivation, decreaseMotivation } from "../Stores/MotivationStore";
import { ENABLE_OPENAI_DIALOGUE } from "../Enum/EnvironmentVariable";
import { get } from "svelte/store";
import { demographicsStore } from "../Stores/DemographicsStore";
import { completeManagerTask } from "../Stores/ManagerTasks";
import { sendJitsiChatMessage } from "../WebRtc/JitsiChatBridge";
import { showInsightStat } from "../Stores/InsightStatStore";

export interface ActiveDialogue {
    npcName: string;
    node: DialogueNode;
}

const visible = writable<boolean>(false);
const active = writable<ActiveDialogue | null>(null);

export const dialogueVisibleStore = visible;
export const activeDialogueStore = active;

// A simple hook provided by the clicked NPC so we can display speech bubbles over it
let currentSpeaker: ((text: string) => void) | null = null;
export function setCurrentSpeaker(sayFn: (text: string) => void) {
    currentSpeaker = sayFn;
}

// Player speech bubble (to display selectable options) - currently unused but may be needed later
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentPlayerSpeaker: ((text: string) => void) | null = null;
export function setPlayerSpeaker(sayFn: (text: string) => void) {
    currentPlayerSpeaker = sayFn;
}

// Renderer for multiple choice bubbles near the player (registered by GameScene)
let renderPlayerChoices: (node: DialogueNode | undefined) => void = () => {};
export function setPlayerChoicesRenderer(fn: (node: DialogueNode | undefined) => void) {
    renderPlayerChoices = fn;
}

// Track whether we've already completed the "Meet the Employee" task
let employeeFirstReplyCompleted = false;
// Track whether we've already completed the "Assess Motivation" task in the hardcoded conversation
let assessMotivationCompleted = false;

function showStatisticPopup(statText: string) {
    const match = statText.match(/(\d{1,3})\s*%/);
    const pct = match ? parseInt(match[1], 10) : 35;
    showInsightStat(isNaN(pct) ? 35 : pct, statText);
}
// Hardcoded first conversation with Marisa (to ensure DEI topic/statistic appears)
const firstEmployeeConversation = {
    start: "intro",
    nodes: {
        intro: {
            id: "intro",
            npcLine: "I’m feeling stretched. Workloads keep piling up and it’s hard to stay engaged.",
            choices: [
                { text: "Let's clarify priorities and adjust workload", motivationDelta: +12, next: "dei" },
                { text: "We just need to push through and keep pace", motivationDelta: -10, next: "dei" },
            ],
        },
        dei: {
            id: "dei",
            npcLine:
                "One more thing—using my correct name and pronouns matters a lot. It affects how included I feel.",
            choices: [
                {
                    text: "Thanks for telling me. I'll model correct pronouns and fix mistakes",
                    motivationDelta: +18,
                    next: "wrap",
                    statistic:
                        "Teams that normalize correct names/pronouns report higher belonging and lower turnover intention.",
                },
                {
                    text: "It's not a big deal if we get pronouns wrong",
                    motivationDelta: -25,
                    next: "wrap",
                    statistic:
                        "Misgendering erodes trust — about 35% of misgendered employees quit or consider quitting.",
                },
            ],
        },
        wrap: {
            id: "wrap",
            npcLine: "If we keep priorities clear and respect each other, I’m more likely to stay and do my best.",
            choices: [{ text: "Let's commit to those habits", motivationDelta: +6 }],
        },
    } as Record<string, DialogueNode & { statistic?: string }>,
};

let firstEmployeeConversationActive = false;
let firstEmployeeConversationDone = false;

export function startConversation(npcName: string) {
    // Force the first Marisa conversation to be hardcoded (with DEI/statistic)
    if (npcName === "Marisa" && !firstEmployeeConversationDone) {
        // Complete "Meet the Employee" task when conversation starts
        if (employeeFirstReplyCompleted === false) {
            completeManagerTask("Meet the Employee");
            employeeFirstReplyCompleted = true;
        }
        const node = firstEmployeeConversation.nodes[firstEmployeeConversation.start];
        active.set({ npcName, node });
        visible.set(true);
        firstEmployeeConversationActive = true;
        if (currentSpeaker) {
            currentSpeaker(node.npcLine);
        }
        queueMicrotask(() => {
            try {
                sendJitsiChatMessage(`${npcName}: ${node.npcLine}`);
            } catch {
                // ignore
            }
        });
        renderPlayerChoices(node);
        return;
    }

    if (ENABLE_OPENAI_DIALOGUE) {
        console.log("[Dialogue] starting OpenAI conversation for", npcName);
        fetchOpenAiNode(npcName, []).catch((e) => console.warn(e));
    } else {
        console.log("[Dialogue] starting scripted conversation for", npcName);
        const convo: Conversation | undefined = conversations[npcName];
        if (!convo) return;
        const node = convo.nodes[convo.start];
        active.set({ npcName, node });
        visible.set(true);
        if (currentSpeaker) {
            currentSpeaker(node.npcLine);
        }
        // Note: first completion happens on the first chosen reply to the Employee
        // Mirror NPC line to meeting chat if active (async to avoid blocking UI)
        queueMicrotask(() => {
            try {
                sendJitsiChatMessage(`${npcName}: ${node.npcLine}`);
            } catch {
                // ignore
            }
        });
        renderPlayerChoices(node);
    }
}

export function choose(index: number) {
    const snapshot = get(active);
    if (!snapshot) return;
    const npcName = snapshot.npcName;
    const node = snapshot.node;
    const choice = node.choices[index];
    if (!choice) return;

    // Handle hardcoded first Employee conversation path
    if (firstEmployeeConversationActive) {
        // Complete "Assess Motivation" task after first choice
        if (!assessMotivationCompleted) {
            completeManagerTask("Assess Motivation");
            assessMotivationCompleted = true;
        }
        
        if (choice.motivationDelta > 0) increaseMotivation(choice.motivationDelta);
        else if (choice.motivationDelta < 0) decreaseMotivation(-choice.motivationDelta);

        // Mirror manager choice and optional statistic
        queueMicrotask(() => {
            try {
                sendJitsiChatMessage(`Evelyn: ${choice.text}`);
            } catch {
                // Ignore chat errors
            }
        });
        // Check if choice has a statistic property (from Conversations.ts Choice interface)
        const stat = (choice as { statistic?: string }).statistic;
        if (stat) {
            queueMicrotask(() => {
                try {
                    sendJitsiChatMessage(`[Insight] ${stat}`);
                } catch {
                    // Ignore chat errors
                }
            });
            showStatisticPopup(stat);
        }

        if (choice.next) {
            const nextNode = firstEmployeeConversation.nodes[choice.next];
            if (nextNode) {
                active.set({ npcName, node: nextNode });
                if (currentSpeaker) currentSpeaker(nextNode.npcLine);
                renderPlayerChoices(nextNode);
                // When we reach the wrap node and there are no further choices next time, we will close below
                return;
            }
        }
        // End of hardcoded conversation
        visible.set(false);
        active.set(null);
        if (currentSpeaker) currentSpeaker("");
        renderPlayerChoices(undefined);
        firstEmployeeConversationActive = false;
        firstEmployeeConversationDone = true;
        return;
    }

    // After the first chosen reply to Marisa, complete the "Meet the Employee" task
    if (npcName === "Marisa" && employeeFirstReplyCompleted === false) {
        completeManagerTask("Meet the Employee");
        employeeFirstReplyCompleted = true;
    }

    if (choice.motivationDelta > 0) increaseMotivation(choice.motivationDelta);
    else if (choice.motivationDelta < 0) decreaseMotivation(-choice.motivationDelta);
    // Mirror manager's (Evelyn's) choice to meeting chat (async to avoid blocking UI)
    queueMicrotask(() => {
        try {
            sendJitsiChatMessage(`Evelyn: ${choice.text}`);
        } catch {
            // Ignore chat errors
        }
    });
    // Check if choice has a statistic property (from Conversations.ts Choice interface)
    const stat = (choice as { statistic?: string }).statistic;
    if (stat) {
        // Show educational statistic in chat
        queueMicrotask(() => {
            try {
                sendJitsiChatMessage(`[Insight] ${stat}`);
            } catch {
                // Ignore chat errors
            }
        });
        showStatisticPopup(stat);
    }

    if (ENABLE_OPENAI_DIALOGUE) {
        // Build short history with last npc line and selected choice
        const history = [{ speaker: "npc", text: node.npcLine }, { speaker: "player", text: choice.text }];
        // Pass fallbackNextNodeId so if OpenAI is slow/unavailable we continue locally
        fetchOpenAiNode(npcName, history, choice.next).catch((e) => {
            console.warn(e);
            // As a safety, also continue locally if error bubbles up
            if (choice.next) {
                const convo = conversations[npcName];
                if (convo) {
                    const nextNode = convo.nodes[choice.next];
                    if (nextNode) {
                        active.set({ npcName, node: nextNode });
                        if (currentSpeaker) currentSpeaker(nextNode.npcLine);
                        renderPlayerChoices(nextNode);
                    }
                }
            } else {
                visible.set(false);
                active.set(null);
                if (currentSpeaker) currentSpeaker("");
                renderPlayerChoices(undefined);
            }
        });
        return;
    } else {
        if (choice.next) {
            const convo = conversations[npcName];
            if (!convo) return;
            const nextNode = convo.nodes[choice.next];
            if (nextNode) {
                active.set({ npcName, node: nextNode });
                if (currentSpeaker) {
                    currentSpeaker(nextNode.npcLine);
                }
                renderPlayerChoices(nextNode);
                return;
            }
        }
        visible.set(false);
        active.set(null);
        if (currentSpeaker) {
            currentSpeaker("");
        }
        renderPlayerChoices(undefined);
    }
}

export function closeDialogue() {
    visible.set(false);
    active.set(null);
    if (currentSpeaker) {
        currentSpeaker("");
    }
    renderPlayerChoices(undefined);
}

/**
 * Try to fetch an AI-generated node. If it fails or times out, we fall back to scripted.
 * When fallbackNextNodeId is provided, we advance to that node instead of restarting.
 */
async function fetchOpenAiNode(
    npcName: string,
    history: { speaker: string; text: string }[],
    fallbackNextNodeId?: string
) {
    const demographics = get(demographicsStore);
    const role = undefined;
    console.log("[Dialogue] POST /api/dialogue payload", { npcName, historyLen: history.length, demographics });
    // Add an abortable timeout to keep UX snappy and fall back to scripted dialogue if slow
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    let resp: Response | undefined;
    try {
        resp = await fetch("http://api.workadventure.localhost/api/dialogue", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ npcName, history, demographics, role }),
            signal: controller.signal,
        });
    } catch (e) {
        console.warn("[Dialogue] OpenAI request failed/aborted; falling back to scripted", e);
        resp = undefined;
    } finally {
        clearTimeout(timer);
    }
    if (!resp || !resp.ok) {
        let txt = "";
        try {
            if (resp) {
                txt = await resp.text();
            }
        } catch {
            // ignore
        }
        console.warn(
            "[Dialogue] OpenAI dialogue disabled or error",
            resp ? resp.status : "no response",
            txt
        );
        // fallback to scripted path
        const convo: Conversation | undefined = conversations[npcName];
        if (!convo) return;
        let node: DialogueNode | undefined;
        if (fallbackNextNodeId) {
            node = convo.nodes[fallbackNextNodeId];
        }
        if (!node) {
            node = conversations[npcName].nodes[conversations[npcName].start];
        }
        active.set({ npcName, node });
        visible.set(true);
        if (currentSpeaker) currentSpeaker(node.npcLine);
        renderPlayerChoices(node);
        return;
    }
    const data = await resp.json();
    console.log("[Dialogue] OpenAI response", data);
    const node: DialogueNode = { id: "ai", npcLine: data.npcLine, choices: data.choices || [] };
    active.set({ npcName, node });
    visible.set(true);
    if (currentSpeaker) currentSpeaker(node.npcLine);
    renderPlayerChoices(node);
}

// Global numeric key handling for picking choices when overlay is hidden
function handleDialogueKeydown(e: KeyboardEvent) {
    if (!get(dialogueVisibleStore)) return;
    // Accept number keys 1..9
    const n = parseInt(e.key, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= 9) {
        const snap = get(active);
        const idx = n - 1;
        if (snap && snap.node.choices && snap.node.choices[idx]) {
            e.preventDefault();
            choose(idx);
        }
    }
}

if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleDialogueKeydown);
    // Note: In a real cleanup scenario, you'd remove this listener, but for a global dialogue handler
    // that persists for the app lifetime, leaving it attached is acceptable
}


