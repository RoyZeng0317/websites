"""
LinguaPath — CEFR Audio Generator
===================================
Generates 18 American-English MP3 files (3 per CEFR level, A1–C2)
using Microsoft Edge TTS (edge-tts).  No API key required.

SETUP (run once in your terminal):
    pip install edge-tts

RUN:
    python generate_audio.py

Output: frontend/audio/*.mp3  (created automatically)
"""

import asyncio
import os
from pathlib import Path

# American English voices (edge-tts)
# AriaNeural  = female, clear and natural — great for educational content
VOICE = "en-US-AriaNeural"
OUT_DIR = Path(__file__).parent / "audio"

SCRIPTS: list[tuple[str, str, str]] = [
    # (filename_stem, CEFR_level, script_text)

    # ── A1 ──────────────────────────────────────────────────────────────
    (
        "a1_01_world_cup", "A1",
        "The World Cup is here. Many countries play soccer. "
        "The games are in the United States, Canada, and Mexico. "
        "Forty-eight teams play this year. That is a lot of teams. "
        "People watch the games on TV. People also go to the stadiums. "
        "It is very exciting. Do you like soccer?"
    ),
    (
        "a1_02_earthquake", "A1",
        "A big earthquake hit the Philippines. It was very strong. "
        "Many buildings shook. People were scared. "
        "Rescue workers helped people. An earthquake moves the ground. "
        "It can be very dangerous. We hope everyone is safe."
    ),
    (
        "a1_03_knicks", "A1",
        "The New York Knicks won the NBA Championship. "
        "Basketball is a popular sport in America. Five games were played. "
        "The Knicks beat the San Antonio Spurs. Jalen Brunson played very well. "
        "He was the Most Valuable Player. The fans are very happy."
    ),

    # ── A2 ──────────────────────────────────────────────────────────────
    (
        "a2_01_world_cup", "A2",
        "The 2026 FIFA World Cup has started. For the first time, "
        "forty-eight national teams are competing. "
        "The host countries are the United States, Canada, and Mexico. "
        "The opening ceremony took place at the Estadio Azteca in Mexico City. "
        "Millions of fans around the world are watching the matches on television. "
        "Which team do you think will win the championship?"
    ),
    (
        "a2_02_iran_deal", "A2",
        "The United States and Iran signed an important agreement "
        "called the Islamabad Memorandum. The two countries agreed to stop fighting. "
        "They also agreed to open the Strait of Hormuz again. "
        "This is an important shipping route for oil. "
        "The two countries will talk more over the next sixty days. "
        "Many people hope this agreement will bring lasting peace."
    ),
    (
        "a2_03_sagrada_familia", "A2",
        "A famous church in Barcelona, Spain, is finally complete. "
        "It is called the Sagrada Familia. "
        "The architect Antoni Gaudi designed it over one hundred years ago. "
        "Pope Leo the Fourteenth visited Barcelona for a special ceremony. "
        "He blessed the tallest tower of the church. "
        "The tower is dedicated to Jesus Christ. This is a historic moment for Spain."
    ),

    # ── B1 ──────────────────────────────────────────────────────────────
    (
        "b1_01_world_cup", "B1",
        "The 2026 FIFA World Cup officially kicked off this month, "
        "marking the first edition to feature forty-eight teams. "
        "The expanded format means more countries have the chance to compete on the world stage. "
        "Matches are being held across cities in the United States, Canada, and Mexico. "
        "The opening ceremony was held at the historic Estadio Azteca in Mexico City, "
        "drawing a massive crowd. Soccer fans from around the world have traveled to "
        "North America to support their nations. The tournament is expected to generate "
        "billions of dollars in revenue and boost tourism significantly in the host cities."
    ),
    (
        "b1_02_iran_deal", "B1",
        "The United States and Iran have reached a significant diplomatic breakthrough. "
        "The two nations signed the Islamabad Memorandum, a fourteen-point interim agreement. "
        "Under the deal, both sides agreed to end the 2026 Iran conflict and reopen the "
        "Strait of Hormuz, a critical waterway through which a large percentage of the "
        "world's oil supply passes. The United States has also agreed to lift its blockade "
        "of Iranian ports. The two governments will now enter a sixty-day negotiation period "
        "focused on Iran's nuclear program. "
        "Many international observers are cautiously optimistic about the agreement."
    ),
    (
        "b1_03_philippines_quake", "B1",
        "A powerful magnitude seven point eight earthquake struck the Philippines this month, "
        "making it the strongest quake to hit the country since nineteen seventy-six. "
        "The earthquake caused widespread damage to buildings and infrastructure. "
        "Emergency rescue teams were quickly deployed to affected areas to search for survivors. "
        "The government has declared a state of calamity in several provinces. "
        "International aid organizations have offered assistance. "
        "Earthquakes are common in the Philippines because the country sits along the "
        "Pacific Ring of Fire, a zone of high seismic and volcanic activity."
    ),

    # ── B2 ──────────────────────────────────────────────────────────────
    (
        "b2_01_world_cup_economy", "B2",
        "The 2026 FIFA World Cup represents not only a sporting spectacle but also a major "
        "economic opportunity for its three host nations. With forty-eight competing teams, "
        "the expanded format ensures greater global participation and viewership. "
        "Economists project that the tournament will generate tens of billions of dollars "
        "in economic activity across the United States, Canada, and Mexico. "
        "However, hosting such a massive event also comes with significant costs, including "
        "stadium upgrades, infrastructure development, and security logistics. "
        "Critics have raised concerns about cost overruns and the long-term utility of "
        "purpose-built facilities. Supporters argue that the tourism boost and international "
        "exposure provide lasting benefits for the host cities and their communities."
    ),
    (
        "b2_02_us_iran_diplomacy", "B2",
        "The signing of the Islamabad Memorandum between the United States and Iran marks "
        "a potentially pivotal moment in Middle Eastern geopolitics. "
        "The fourteen-point interim agreement addresses several flashpoints, including the "
        "reopening of the Strait of Hormuz and the lifting of American port blockades on Iran. "
        "These measures are expected to ease global oil supply concerns and stabilize energy markets. "
        "The agreement also initiates a sixty-day diplomatic window to address Iran's nuclear "
        "ambitions, a longstanding source of international tension. "
        "Analysts caution that while the memorandum is a positive step, the underlying "
        "disagreements are deeply entrenched, and translating this interim deal into a lasting "
        "framework will require sustained political will on both sides."
    ),
    (
        "b2_03_uk_defence", "B2",
        "The resignation of the United Kingdom's Secretary of State for Defence, John Healey, "
        "has triggered a significant political debate about British defense spending priorities. "
        "Healey stepped down in protest over what he described as insufficient government "
        "funding for the armed forces. His departure comes at a time of heightened security "
        "concerns across Europe, with ongoing conflicts and growing pressure on NATO members "
        "to meet their defense spending commitments. "
        "Critics of the government argue that underfunding the military sends a damaging "
        "signal to allies. The Prime Minister's office has defended the current spending levels, "
        "citing broader fiscal constraints. The resignation is likely to intensify parliamentary "
        "scrutiny of the defense budget in the coming weeks."
    ),

    # ── C1 ──────────────────────────────────────────────────────────────
    (
        "c1_01_world_cup_geopolitics", "C1",
        "The 2026 FIFA World Cup's expansion to forty-eight teams reflects a broader geopolitical "
        "recalibration within international football governance. By distributing more slots to "
        "underrepresented confederations, FIFA has acknowledged the shifting balance of soft "
        "power in global sport. The joint hosting arrangement between the United States, Canada, "
        "and Mexico carries its own diplomatic symbolism, having been conceived during a period "
        "of significant trade tensions between the three nations. The tournament thus functions "
        "simultaneously as a commercial enterprise, a soft power instrument, and a barometer of "
        "international cooperation. Whether the event delivers on its promise of inclusivity will "
        "depend not only on results on the pitch, but on how equitably the economic benefits are "
        "distributed across host communities, many of which have voiced concerns about "
        "displacement and the prioritization of corporate interests over local needs."
    ),
    (
        "c1_02_iran_nuclear", "C1",
        "The Islamabad Memorandum's most consequential provision may ultimately prove to be the "
        "sixty-day negotiation window it establishes around Iran's nuclear program. Previous "
        "attempts to constrain Iranian nuclear development, most notably the Joint Comprehensive "
        "Plan of Action, collapsed amid mutual accusations of bad faith, leaving the diplomatic "
        "architecture in tatters. The current agreement benefits from a different geopolitical "
        "context, with both Washington and Tehran facing domestic constituencies skeptical of "
        "prolonged military engagement. Nevertheless, the fundamental asymmetry persists: the "
        "United States seeks verifiable, permanent constraints on Iranian enrichment capacity, "
        "while Tehran frames its nuclear program as an existential sovereign right. The interim "
        "nature of the memorandum reflects this unresolved tension, and observers would do well "
        "to calibrate their optimism accordingly."
    ),
    (
        "c1_03_sagrada_familia", "C1",
        "The completion of the Sagrada Familia's central tower represents an architectural and "
        "cultural landmark that transcends mere construction. Antoni Gaudi's vision, begun in "
        "eighteen eighty-two, was always conceived as an act of devotion as much as design, "
        "blending Gothic structure with Art Nouveau organicism in ways that continue to resist "
        "easy categorization. The papal blessing by Pope Leo the Fourteenth, timed precisely "
        "one hundred years after Gaudi's death, carries deliberate symbolic weight, situating "
        "the church within a longer arc of Catholic cultural renewal at a moment when "
        "institutional religion faces significant credibility challenges across Europe. "
        "For Barcelona, the completed basilica is simultaneously a tourist magnet, a civic "
        "symbol, and a testing ground for questions about heritage, urban space, and the "
        "commercialization of sacred architecture."
    ),

    # ── C2 ──────────────────────────────────────────────────────────────
    (
        "c2_01_world_cup_soft_power", "C2",
        "Mega-sporting events have long served as vehicles for the projection of national "
        "identity and geopolitical ambition, and the 2026 FIFA World Cup is no exception. "
        "The joint hosting arrangement between the United States, Canada, and Mexico functions "
        "as a carefully choreographed exercise in North American multilateralism, designed in "
        "part to rehabilitate a trilateral relationship that had been strained by years of "
        "trade disputes and immigration tensions. Yet the instrumentalization of sport for "
        "political purposes invariably generates contradictions. FIFA's expansion to forty-eight "
        "teams, justified on grounds of inclusivity, simultaneously dilutes competitive quality "
        "and extends the commercial footprint of a governing body whose record on transparency "
        "and financial accountability remains deeply contested. The tournament thus encapsulates "
        "a broader tension in contemporary international relations: the gap between the "
        "universalist rhetoric of global institutions and the particular interests that animate them."
    ),
    (
        "c2_02_iran_us_strategic", "C2",
        "The Islamabad Memorandum invites analysis through the lens of structural realism as much "
        "as through conventional diplomatic history. Both the United States and Iran have arrived "
        "at this juncture constrained by the limits of coercive strategy: American military "
        "dominance has proven insufficient to alter Iranian strategic behavior, while Iran's "
        "capacity for regional disruption has not translated into meaningful leverage over its "
        "core security concerns. The memorandum's fourteen points effectively codify a mutual "
        "recognition of these constraints. Reopening the Strait of Hormuz addresses the most "
        "immediate systemic risk — namely oil market volatility with its cascading effects on "
        "global inflation and emerging market debt sustainability. The nuclear negotiation window, "
        "however, remains the agreement's most precarious element, requiring both parties to "
        "reconcile maximalist positions under the scrutiny of domestic audiences with little "
        "appetite for compromise. The history of arms control suggests that durable agreements "
        "emerge not from trust, but from the credible alignment of mutual self-interest."
    ),
    (
        "c2_03_uk_defence_nato", "C2",
        "John Healey's resignation from the British Cabinet crystallizes a tension that has been "
        "building within the United Kingdom's strategic posture since the post-Brexit "
        "recalibration of its international role. The United Kingdom's long-standing claim to a "
        "Tier One military capability is increasingly difficult to sustain against a backdrop of "
        "fiscal austerity, an overstretched procurement budget, and a strategic environment that "
        "demands both high-intensity warfighting capacity and the persistent engagement missions "
        "characteristic of gray-zone competition. Healey's departure signals that this "
        "contradiction can no longer be managed through rhetorical commitment to the NATO two "
        "percent spending target alone. More fundamentally, the episode illustrates the degree "
        "to which European security architecture post-2022 has rendered defense spending a "
        "first-order political issue rather than a technocratic budget line, with implications "
        "that extend well beyond Westminster to every NATO capital wrestling with the same "
        "inescapable arithmetic of strategic ambition and fiscal reality."
    ),
]


async def synthesize(stem: str, text: str) -> None:
    import edge_tts
    path = OUT_DIR / f"{stem}.mp3"
    comm = edge_tts.Communicate(text, voice=VOICE)
    await comm.save(str(path))
    print(f"  OK  {path.name}")


async def main() -> None:
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        print("edge-tts not found.  Run:  pip install edge-tts")
        return

    OUT_DIR.mkdir(exist_ok=True)
    print(f"Saving {len(SCRIPTS)} audio files to {OUT_DIR}\n")

    for stem, level, text in SCRIPTS:
        dest = OUT_DIR / f"{stem}.mp3"
        if dest.exists():
            print(f"  SKIP {dest.name}  (already exists)")
            continue
        try:
            await synthesize(stem, text)
        except Exception as exc:
            print(f"  ERR  {stem}: {exc}")

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
