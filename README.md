<h1 align="center">
League of Legends <br>
Item Finder
</h1>

<br>

<h6  align="center">

<a href="https://www.leagueoflegends.com/">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/img/LOL_header1.webp"
    alt="LOL_header" />
</a>

<br><br>

</h6>

## Table of Contents
- I. [Purposes](https://github.com/RomulusMirauta/LOL_ItemFinder#i-purpose) <br>
- II. [Link for live app](https://github.com/RomulusMirauta/LOL_ItemFinder#ii-check-out-the-live-app-here) <br>
- III. [Main features]() <br>
- IV. [AI info]() <br>
- V. [Main technologies]() <br>
- VI. [SW info]() <br>
- VII. [App screenshots]() <br>
  - VII. a. [Main app screenshots]() <br>
  - VII. b. [Feature app screenshots]() <br>
- VIII. [Note]() <br>

<br>

## I. Purposes <br>
### - Self-training - creating my second web app. <br> - Creating an app that helps League of Legends players find the desire item, even when searching for keywords like "tenacity" *(not indexed in the actual game)*

<br>

## II. Check out the live app here: [https://lol-item-finder.vercel.app/](https://lol-item-finder.vercel.app/)

<br>

## III. Main features
I have also added features that ***are not present in the actual game*** and that allow the user to:
- Filter items by:
  - Being `Purchasable` *(useful to search for old items or old item stats; e.g.: Duskblade of Draktharr, Goredrinker)*
  - Being `Champion-Specific` *(e.g.: Fiddlesticks' Scarecrow Effigy, Kalista's Black Spear, Gangplank's Ultimate Upgrades)*
  - Stat = `Lethality` *(flat armor penetration, scales with enemy champion level; e.g.: The Collector, Youmuu's Ghostblade)*
  - Stat = `Tenacity` *(reduces CC (including hard CC) duration; e.g.: Mercury's Treads, Wit's End)*
  - Effect = `Active` *(item has an activatable effect; e.g.: Zhonya's Hourglass, Ravenous Hydra)*
  - Effect = `Anti-Heal` *(aka Grievous Wounds; e.g.: Morellonomicon, Mortal Reminder)*
  - Effect = `Anti-Shield` *(only Serpent's Fang is available atm 🥹)*
  - Effect = `All Shield` Types *(all items that give any type of shield(s))*
  - Effect = `Omni-Shield` *(only items that give an 'all-purpose' shield, being able to sustain any type of damage; e.g.: Bloodthirster, Eclipse, Sterak's Gage)*
  - Effect = `Physical Damage Shield` *(only item(s) that give(s) a physical damage shield; only Armored Advance (upgrade of boots Plated Steelcaps) is available atm 🥹)*
  - Effect = `Magic Damage Shield` *(only items that give a magic damage shield; e.g.: Hexdrinker, Maw of Malmortius)*
  - Effect = `Spell Shield` *(; e.g.: Banshee's Veil, Edge of Night)*

<br>

| Filter Category | Filter Type                | Description                                                                                                   | Example Items                                      |
|-------------|---------------------------|---------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| Misc        | `Purchasable`                | Useful to search for old items or old item stats                                                              | Duskblade of Draktharr, Goredrinker                |
| Misc        | `Champion-Specific`          | Items only usable by specific champions                                                                       | Fiddlesticks' Scarecrow Effigy, Kalista's Black Spear, Gangplank's Ultimate Upgrades |
| Stat        | `Lethality`            | Flat armor penetration, scales with enemy champion level                                                      | The Collector, Youmuu's Ghostblade                 |
| Stat        | `Tenacity`             | Reduces CC (including hard CC) duration                                                                       | Mercury's Treads, Wit's End                        |
| Effect      | `Active`             | Item has an activatable effect                                                                                | Zhonya's Hourglass, Ravenous Hydra                 |
| Effect      | `Anti-Heal`          | Applies Grievous Wounds                                                                                       | Morellonomicon, Mortal Reminder                    |
| Effect      | `Anti-Shield`        | Counters shields (only Serpent's Fang is available atm 🥹)                                                    | Serpent's Fang                                     |
| Effect      | `All Shield Types`   | All items that give any type of shield(s)                                                                     | Various                                            |
| Effect      | `Omni-Shield`        | Items that give an 'all-purpose' shield, sustaining any type of damage                                        | Bloodthirster, Eclipse, Sterak's Gage              |
| Effect      | `Physical Damage Shield` | Only item(s) that give(s) a physical damage shield (only Armored Advance is available atm 🥹)             | Armored Advance                                    |
| Effect      | `Magic Damage Shield` | Only items that give a magic damage shield                                                                    | Hexdrinker, Maw of Malmortius                      |
| Effect      | `Spell Shield`       | Items that give a spell shield                                                                                | Banshee's Veil, Edge of Night                      |
| Game Mode      | `Doom Bots`       | Only items specific to latest Doom Bots game mode version (2025)                                                                             | Hextech Gunblade, Atma's Reckoning, Zephyr                    |
| Game Mode      | `Arena`      | Only items specific to latest Arena game mode version (2025)                                                                             | Talisman Of Ascension, Wooglet's Witchcap, The Golden Spatula                    |

- Filter items by special Game Modes, like:
  - `Doom Bots`
  - `Arena`

<br>

## IV. AI info

- The code was written with the help of Copilot, along with these LLMs:
  - GPT-4o
  - GPT-4.1
  - GPT-5 (Preview)
  - Claude Sonnet 3.7 Thinking
  - Gemini 2.5 Pro
  - Grok Code Fast 1 (Preview)

<br>

## V. Main technologies used in building this app

- **React** with **TypeScript** – for robust, type-safe UI development
- **Vite** – fast development server and optimized production builds
- **HTML5 & CSS3** – custom styles, modular CSS files, and inline styling
- **JavaScript/TypeScript** – for all app logic, filtering, and data management
- **Node.js** – development environment and tooling
- **npm** – package management and scripts
- **Modern ES6+ features** – hooks, functional components, and modular architecture
- **Custom component structure** – including `ItemCard`, `ItemGrid`, `Filters`, `SearchBar` and `SortBar`

<br>

## VI. SW info

- Microsoft Visual Studio Code + extensions:
  - GitHub Copilot
  - GitHub Copilot Chat
  - HTML Format
  - Markdown All in One
  - PowerShell
- Git Bash
- GitHub Desktop
- Microsoft PowerToys - modules: Workspaces, Color Picker, Text Extractor
- Google Chrome - DevTools
- Notepad++

<br>

## VII. App screenshots

### VII. a. Main app screenshots

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/main/app_screenshot1.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/main/app_screenshot1.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/main/app_screenshot2.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/main/app_screenshot2.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/main/app_screenshot3.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/main/app_screenshot3.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/main/app_screenshot4.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/main/app_screenshot4.png"
    alt="ss" />
</a>

<br><br>

### VII. b. Feature app screenshots

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature1.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature1.png"
    alt="ss" />
</a

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature2.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature2.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature3.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature3.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature4.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature4.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature5.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature5.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature6.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature6.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature7.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature7.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature8.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature8.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature9.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature9.png"
    alt="ss" />
</a>

<br>

<hr>

<br>

<a href="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature10.png">
  <img align="center"
    src="https://raw.githubusercontent.com/RomulusMirauta/LOL_ItemFinder/refs/heads/main/github/img/features/app_screenshot_feature10.png"
    alt="ss" />
</a>

<br><br>

### VIII. Note

> [!NOTE]
> "League of Legends - Item Finder" is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc
