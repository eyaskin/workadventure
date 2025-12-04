import type { Express, Request, Response } from "express";
import { ENABLE_OPENAI_DIALOGUE, OPENAI_API_KEY, OPENAI_MODEL } from "../Enum/EnvironmentVariable";

export class DialogueController {
    constructor(app: Express) {
        app.post("/api/dialogue", async (req: Request, res: Response) => {
            try {
                console.info("[DialogueController] /api/dialogue called");
                console.info(
                    "[DialogueController] ENABLE_OPENAI_DIALOGUE=%s, OPENAI_MODEL=%s, API_KEY_SET=%s",
                    ENABLE_OPENAI_DIALOGUE,
                    OPENAI_MODEL,
                    Boolean(OPENAI_API_KEY)
                );
                if (!ENABLE_OPENAI_DIALOGUE || !OPENAI_API_KEY) {
                    console.warn("[DialogueController] OpenAI disabled or API key missing");
                    res.status(400).json({ error: "OpenAI dialogue disabled" });
                    return;
                }
                const { npcName, history, demographics, role } = req.body || {};
                console.info("[DialogueController] npcName=%s, role=%s, history.len=%s", npcName, role, history?.length ?? 0);
                if (demographics) {
                    console.info("[DialogueController] demographics=%j", demographics);
                }
                const sys = [
                    "You are an NPC in a motivation/attrition simulation.",
                    "Keep replies short (1-2 sentences) and empathetic.",
                    "Return STRICT JSON with fields: npcLine (string) and choices (array of objects with 'text' and 'motivationDelta' numbers).",
                    "No extra prose. JSON only.",
                ].join(" ");
                const user = JSON.stringify({
                    npcName,
                    role,
                    demographics,
                    history,
                });
                console.info("[DialogueController] Sending request to OpenAI model=%s", OPENAI_MODEL);
                const body = {
                    model: OPENAI_MODEL,
                    messages: [
                        { role: "system", content: sys },
                        { role: "user", content: user },
                    ],
                    temperature: 0.7,
                    max_tokens: 200,
                    response_format: { type: "json_object" },
                };
                const resp = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                    body: JSON.stringify(body),
                });
                console.info("[DialogueController] OpenAI status=%s", resp.status);
                if (!resp.ok) {
                    const txt = await resp.text();
                    console.error("[DialogueController] OpenAI error body=%s", txt);
                    res.status(502).json({ error: "OpenAI error", details: txt });
                    return;
                }
                const data = await resp.json();
                const content = data.choices?.[0]?.message?.content;
                let parsed;
                try {
                    parsed = JSON.parse(content);
                } catch (e) {
                    console.error("[DialogueController] Invalid JSON from model: %s", content);
                    res.status(500).json({ error: "Invalid JSON from model" });
                    return;
                }
                console.info(
                    "[DialogueController] Parsed response ok. npcLine.len=%s choices=%s",
                    parsed?.npcLine?.length ?? 0,
                    parsed?.choices?.length ?? 0
                );
                res.json(parsed);
            } catch (e) {
                console.error(e);
                res.status(500).json({ error: "Server error" });
            }
        });
    }
}


