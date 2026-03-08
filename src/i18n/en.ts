export interface Dictionary {
  dir: "ltr" | "rtl";
  lang: string;
  nav: {
    about: string;
    projects: string;
    contact: string;
    langToggle: string;
  };
  hero: {
    greeting: string;
    name: string;
    title: string;
    subtitle: string;
    cta: string;
    scrollHint: string;
    discord: string;
    discordLabel: string;
    roleLines: string[];
  };
  about: {
    badge: string;
    title: string;
    paragraphs: string[];
    stats: Array<{ value: string; label: string }>;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      title: string;
      subtitle: string;
      version: string;
      logo?: string;
      description: string;
      tags: string[];
      color: string;
      changelog: Array<{
        version: string;
        date: string;
        changes: string[];
      }>;
    }>;
  };
  footer: {
    title: string;
    subtitle: string;
    discord: string;
    discordLabel: string;
    copyright: string;
    madeWith: string;
    backToTop: string;
  };
}

const en: Dictionary = {
  dir: "ltr",
  lang: "en",

  nav: {
    about: "About",
    projects: "Projects",
    contact: "Contact",
    langToggle: "HE",
  },

  hero: {
    greeting: "Hi, I'm",
    name: "Daniel",
    title: "I love building cool things with code.",
    subtitle:
      "A self-taught developer who builds automation tools, scripts, and full UI systems, simply because it's fun.",
    cta: "View My Work",
    scrollHint: "Scroll down",
    discord: ".daniel.33",
    discordLabel: "Discord",
    roleLines: [
      "Automation Developer",
      "Script Writer",
      "UI Systems Nerd",
    ],
  },

  about: {
    badge: "About Me",
    title: "Just a guy who loves to code.",
    paragraphs: [
      "I'm Daniel, 24 years old.",
      "I've been through a tough path in life. I lost my mom when I was eight and faced a lot of social struggles, but I really don't want this to be a sad story. What drives me today is the desire to build a good, stable life. My girlfriend Tehila is my anchor and gives me a reason to push forward, and I have great friends like Raz who believe in me, which means everything to me.",
      "I build scripts, complex automation tools, and systems that push the browser's capabilities to the limit, simply because it's fun.",
      "Right now, I'm working on my biggest project yet, called ScarSub. It's a full anime website I'm building from scratch. It's not live yet, but when it is, you'll be the first to know.",
      "Thanks for being here!"
    ],
    stats: [
      { value: "7+", label: "Projects" },
      { value: "50K+", label: "Lines of Code" },
      { value: "55", label: "Themes Built" },
      { value: "24/7", label: "Coding" },
    ],
  },

  projects: {
    badge: "My Work",
    title: "Projects & Logs",
    subtitle:
      "Automation tools, UI systems, and scripts. Everything was built from scratch just to see if I could do it.",
    items: [
      {
        id: "scarsub",
        title: "ScarSub",
        subtitle: "Hebrew Anime Community Platform",
        version: "In Development",
        logo: "/scarsub-logo.png",
        description:
          "This is by far my biggest project. It's a Hebrew anime community platform built with modern tech. It's not just an anime catalog, it's a complete social platform.\n\nIt features an anime catalog with search and reviews, a forum system, a blog platform, user profiles with avatars, real-time messaging, and a points-based shop where you earn from trivia. Everything is built RTL-first for Hebrew with full authentication, live updates, and an admin dashboard. This is the project where everything comes together, and I'm still working on it full force.",
        tags: [
          "Full-Stack",
          "Hebrew RTL",
          "Real-time",
          "Auth System",
          "Dashboard",
          "Forums",
          "Virtual Shop",
        ],
        color: "#ff6600",
        changelog: [
          {
            version: "In Development",
            date: "2025-03",
            changes: [
              "Built the anime catalog with filters and reviews.",
              "Added the forum system and blog platform.",
              "Created user profiles with custom frames and badges.",
              "Built a virtual shop based on trivia rewards.",
              "Added a real-time messaging system.",
              "Created a full admin dashboard to manage the site."
            ],
          },
        ],
      },
      {
        id: "amq-script",
        title: "Daniel AMQ Script",
        subtitle: "Quantum System",
        version: "v45.0.0",
        description:
          "This is probably my most feature-packed project. It's a massive script for an anime music trivia game that basically turns the game into its own OS inside the browser. It has a 3D HUD, real-time particles, and dozens of themes.\n\nThe part I'm most proud of is an engine I call Leviathan DB. It's a local database system I built that parses huge data files. We're talking tens of thousands of records containing direct video and audio source links for anime openings and endings. The engine loads all this data into the browser's memory, filters it by song or anime name, and plays it with zero latency without pinging an external server at all. Building a system that handles so many records in the browser without lagging was a serious technical challenge, and I'm really proud of the result.",
        tags: [
          "3D HUD",
          "Advanced UI",
          "Leviathan DB",
          "Local Database",
          "Data Processing",
        ],
        color: "#00f0ff",
        changelog: [
          {
            version: "v45.0.0",
            date: "2025-03",
            changes: [
              "Upgraded the Leviathan engine to load tens of thousands of records faster.",
              "Added five new themes with dynamic colors.",
              "Improved the 3D interface to look much deeper.",
              "Fixed a memory leak that happened after playing for a long time."
            ],
          },
          {
            version: "v44.0.0",
            date: "2025-02",
            changes: [
              "Added real-time album cover displays.",
              "Improved the theme engine to support custom code.",
              "Fixed an audio sync bug when skipping songs quickly."
            ],
          },
        ],
      },
      {
        id: "whatsapp-phantom",
        title: "WhatsApp Phantom OS",
        subtitle: "WhatsApp Automation Tool",
        version: "v12.0.0",
        description:
          "A WhatsApp Web automation tool with a clean OS-style UI. It has a bulk sending engine for messaging multiple contacts, a reusable message template system, a scheduler, and a privacy shield that hides sensitive info on the screen. It also has eight text mutators for cool text effects. I basically just wanted to see how far I could stretch WhatsApp's capabilities in the browser.",
        tags: [
          "Bulk Sending",
          "Templates",
          "Message Scheduler",
          "Privacy Shield",
          "Text Styling",
        ],
        color: "#25D366",
        changelog: [
          {
            version: "v12.0.0",
            date: "2025-03",
            changes: [
              "Redesigned the entire UI to look like OS windows.",
              "Added three new text styles, including upside-down text.",
              "Improved the sending engine to look more natural.",
              "Fixed the privacy shield to work in group chats as well."
            ],
          },
        ],
      },
      {
        id: "anilist-premium",
        title: "AniList Premium",
        subtitle: "UI Upgrade and Automation",
        version: "v16.1.0",
        description:
          "An automation and UI upgrade tool for AniList. It features an automated liker that runs based on filters you set, a brand new interface that completely changes how the site looks, real-time likes-per-minute tracking, and a built-in music player so you can listen to songs while browsing. It just makes the site a much better experience.",
        tags: [
          "Automation",
          "Smart Filters",
          "Premium UI",
          "Analytics",
          "Music Player",
        ],
        color: "#b400ff",
        changelog: [
          {
            version: "v16.1.0",
            date: "2025-03",
            changes: [
              "Added advanced filters to the liking system.",
              "Improved the stats display with graphs.",
              "Fixed a bug in the music player related to autoplay."
            ],
          },
        ],
      },
      {
        id: "youtube-downloader",
        title: "YouTube Direct Downloader",
        subtitle: "Video and Audio Downloader",
        version: "v9.0",
        description:
          "A tool that downloads video and audio directly from the YouTube interface. No external sites and no annoying popups. It sits right inside the page with smooth animations, a real-time progress display, and a download history section. The hardest part here was bypassing the browser's security blocks so everything runs smoothly.",
        tags: [
          "Direct Download",
          "Animations",
          "Security Bypass",
          "History",
        ],
        color: "#ff0033",
        changelog: [
          {
            version: "v9.0",
            date: "2025-03",
            changes: [
              "Rewrote the download engine to be much more stable.",
              "Added a nice animation during the download.",
              "Added a download history section.",
              "Fixed a bypass for new security blocks."
            ],
          },
        ],
      },
      {
        id: "telegram-tools",
        title: "Telegram Web Tools",
        subtitle: "Media Downloader",
        version: "v4.0.0",
        description:
          "A tool that injects download buttons directly into images and videos on Telegram Web. One click and you save any file. It works on both web versions of Telegram and detects them automatically. The UI blends in so well it looks like an official part of the site.",
        tags: [
          "Fast Download",
          "Auto Detection",
          "Native UI",
        ],
        color: "#0088cc",
        changelog: [
          {
            version: "v4.0.0",
            date: "2025-03",
            changes: [
              "Added full support for all Telegram Web versions.",
              "Added the ability to download groups of images together.",
              "Adjusted the button placement to look more natural.",
              "Fixed a bug that corrupted very large videos."
            ],
          },
        ],
      },
      {
        id: "buyee-oas",
        title: "Online Auction Scanner",
        subtitle: "Japan Deal Scanner",
        version: "v5.0.0",
        description:
          "An automation tool for the biggest Japanese proxy auction site. It scans auctions in real-time and finds deals on devices like phones, computers, and consoles. It has preset categories with Japanese keywords, price filtering, and a massive system that automatically filters out junk ads like screen protectors or cables. It runs in the background, cycles through searches, and pops up notifications with sound when it finds a good deal. I just wanted to buy cheap devices without scrolling for hours, so I built a bot to do it for me.",
        tags: [
          "Auto Scanning",
          "Junk Filtering",
          "Keywords",
          "Notifications",
        ],
        color: "#00e676",
        changelog: [
          {
            version: "v5.0.0",
            date: "2025-03",
            changes: [
              "Rebuilt the entire UI to float on the screen.",
              "Added many categories with Japanese language support.",
              "Created an autopilot mode that searches on its own.",
              "Added a huge filter that removes all the junk ads.",
              "Added popup notifications with sound when a deal is found."
            ],
          },
        ],
      },
    ],
  },

  footer: {
    title: "Let's Connect",
    subtitle: "Want to chat or work on something together? Send me a message.",
    discord: ".daniel.33",
    discordLabel: "Find me on Discord",
    copyright: "Daniel. All rights reserved.",
    madeWith: "Built with late nights and good music.",
    backToTop: "Back to top",
  },
};

export default en;