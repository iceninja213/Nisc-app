// ─────────────────────────────────────────────────────────────
// NISC 2026 event data — edit this file to update the app.
// Facts marked VERIFIED come from nisc.bryant.edu.
// Agenda times are PLACEHOLDERS: replace them with the official
// schedule from the organizers before sharing the app.
// ─────────────────────────────────────────────────────────────
window.NISC = {
  name: "Northeast Intercollegiate Sales Competition",
  short: "NISC 2026",
  host: "Bryant University",
  partner: "Gartner",
  // VERIFIED: November 13–14, 2026, Bryant University, Smithfield, RI
  start: "2026-11-13T08:00:00-05:00",
  end: "2026-11-14T17:00:00-05:00",
  location: "Bryant University, 1150 Douglas Pike, Smithfield, RI 02917",
  mapUrl: "https://maps.google.com/?q=Bryant+University+Smithfield+RI",
  email: "nisc@bryant.edu",
  website: "https://nisc.bryant.edu/",

  competitions: [
    {
      id: "roleplay",
      title: "Role Play",
      icon: "🤝",
      limit: "Up to 10 competitors per school",
      summary:
        "Students run a live sales call with a buyer, built on the case provided by the Presenting Partner. Judges score discovery, value communication, objection handling and closing.",
      tips: [
        "Know the case cold: buyer, pains, product, pricing.",
        "Open with an agenda and confirm time.",
        "Ask layered discovery questions before pitching.",
        "Tie every feature to a stated buyer need.",
        "Handle objections: acknowledge, clarify, respond, confirm.",
        "Always ask for a clear next step.",
      ],
    },
    {
      id: "speedsell",
      title: "Speed Sell",
      icon: "⚡",
      limit: "Open to registered competitors",
      summary:
        "Short, rapid-fire pitches to recruiters and sponsor representatives. Make a memorable first impression and earn the next conversation.",
      tips: [
        "Lead with a hook, not your name and major.",
        "Keep it tight; practice with the timer below.",
        "Show you researched the company you're pitching.",
        "End with a specific ask.",
      ],
    },
    {
      id: "aicase",
      title: "AI Case Study",
      icon: "🧠",
      limit: "Up to 3 competitors per school",
      summary:
        "New for NISC 2026: teams analyze a business case and present how AI can drive sales outcomes.",
      tips: [
        "Frame the business problem before the technology.",
        "Quantify impact: revenue, time saved, win rate.",
        "Address risks, data and adoption.",
        "Close with a clear, phased recommendation.",
      ],
    },
  ],

  // PLACEHOLDER agenda — replace with the official schedule.
  agenda: [
    { day: "2026-11-13", start: "08:00", end: "09:00", title: "Check-in & Breakfast", place: "Main Lobby", tag: "general" },
    { day: "2026-11-13", start: "09:00", end: "09:45", title: "Opening Session & Case Briefing", place: "Main Hall", tag: "general" },
    { day: "2026-11-13", start: "10:00", end: "12:00", title: "Role Play — Round 1", place: "Sales Labs", tag: "roleplay" },
    { day: "2026-11-13", start: "10:00", end: "12:00", title: "AI Case Study — Team Work Session", place: "Breakout Rooms", tag: "aicase" },
    { day: "2026-11-13", start: "12:00", end: "13:00", title: "Lunch & Sponsor Networking", place: "Dining Hall", tag: "general" },
    { day: "2026-11-13", start: "13:15", end: "15:15", title: "Speed Sell", place: "Career Fair Floor", tag: "speedsell" },
    { day: "2026-11-13", start: "15:30", end: "17:00", title: "Role Play — Round 2", place: "Sales Labs", tag: "roleplay" },
    { day: "2026-11-13", start: "18:00", end: "20:00", title: "Evening Reception", place: "Main Hall", tag: "general" },
    { day: "2026-11-14", start: "08:00", end: "09:00", title: "Breakfast", place: "Dining Hall", tag: "general" },
    { day: "2026-11-14", start: "09:00", end: "11:00", title: "AI Case Study — Presentations", place: "Presentation Rooms", tag: "aicase" },
    { day: "2026-11-14", start: "09:00", end: "11:30", title: "Role Play — Semifinals", place: "Sales Labs", tag: "roleplay" },
    { day: "2026-11-14", start: "12:00", end: "13:00", title: "Lunch", place: "Dining Hall", tag: "general" },
    { day: "2026-11-14", start: "13:00", end: "15:00", title: "Role Play — Finals", place: "Main Hall", tag: "roleplay" },
    { day: "2026-11-14", start: "15:30", end: "17:00", title: "Awards Ceremony", place: "Main Hall", tag: "general" },
  ],

  links: [
    { label: "Official website", url: "https://nisc.bryant.edu/" },
    { label: "Competition details", url: "https://nisc.bryant.edu/competition/" },
    { label: "Registration", url: "https://nisc.bryant.edu/register" },
    { label: "Sponsorship", url: "https://nisc.bryant.edu/sponsorship/" },
    { label: "Past winners", url: "https://nisc.bryant.edu/competition-winners" },
    { label: "Gartner", url: "https://www.gartner.com/" },
  ],
};
