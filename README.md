# LIA Match

En app för studenter på Yrkeshögskolan i Borås som letar LIA-plats. Appen listar företagen från skolans LIA-lista och matchar dem mot din profil.

- Skapa en profil med ort och tekniker – företagen som matchar bäst visas rangordnat.
- Markera företag du sökt till och sätt en deadline – du får en notis när ansökan ska vara inne.
- Profil och valt tema sparas lokalt på enheten, så du slipper fylla i allt igen.

Projektet består av två delar: `expo-app` (React Native/Expo) och `Match_API` (ASP.NET Core Web API med SQLite).

## Så kör du

```bash
git clone https://github.com/04luknie-nemo/lia_match.git
cd lia_match
```

**API:t** (starta först):

```bash
cd Match_API
dotnet build
dotnet run
```

Databasen (`lia.db`) skapas och fylls med data automatiskt vid första start.

**Appen** (i en ny terminal):

```bash
cd expo-app
npm install
npx expo start
```

Skanna QR-koden med Expo Go, eller tryck `a` för Android-emulator. Webben (`w`) fungerar men inte så bra. Telefonen och datorn måste vara på samma nätverk – appen hittar API:ts IP automatiskt via `expo-constants`.

## RN-komponenter

| Komponent | Används till |
| --- | --- |
| `FlatList` | Listor över företag, matchningar och notiser |
| `TextInput` | Fält för ort och tekniker i profilformuläret |
| `Pressable` | Knappar och klickbara företagskort |
| `View` / `Text` | Grundlayout och text överallt |
| `Modal` | Temaväljaren |

## Expo SDK-moduler

| Modul | Används till |
| --- | --- |
| `expo-router` | Navigering med tabbar, detaljsidan tar emot `shownId` som parameter |
| `expo-secure-store` | Sparar profil-id och valt tema lokalt |
| `expo-notifications` | Schemalägger påminnelse inför ansökningsdeadline |
| `expo-haptics` | Vibration när profilen sparas, vid fel och vid kopiering |
| `expo-clipboard` | Kopierar kontaktuppgifter från detaljsidan |
| `expo-checkbox` | Markera att man sökt till ett företag |
| `expo-constants` | Hämtar datorns IP så API-adressen inte är hårdkodad |

Utöver det används `@tanstack/react-query` för att hämta och cacha data från API:t.

## AI-dokumentation

OBS: jag har inte vibe-kodat i den formen att AI skrivit och tagit över! Jag har bett om tips och jobbat med "pusha mig i rätt riktning utan att ge mig svaret". Koden har jag verifierat genom att köra appen och testa flödena själv.

- **workplaces/index** – diskuterade med Claude hur man hämtar profilen, matchar den mot företagen och bara listar de som matchar. Claude tyckte att nästa steg är att flytta matchningen till API:t, men får se.
- **Techstack-data** – Claude i webbläsaren hjälpte mig hitta företagens techstack så att demo-matchningen blir bättre.
- **Web API** – Claude knuffade mig i rätt riktning med endpoints, var länge sen men det kommer tillbaka.
- **expo-constants** – Claude Code tog fram koden så att IP:t är flexibelt och fungerar oavsett nätverk under utveckling. Ska appen lanseras måste API:t ligga på en riktig server.
- **Notifications och haptics** – smidigt att lägga till, bollade lite med Claude om hur koden skulle se ut.

## Uppfyllda krav

### Godkänt (G)

- [x] Minst 4 RN-komponenter
- [x] Minst 4 moduler från Expo SDK
- [x] Komponenter och moduler antecknade i README
- [x] Expo Router används, och minst en skärm tar emot en parameter
- [x] Git och GitHub har använts med commits över arbetets gång
- [x] README enligt beskrivningen
- [x] Inlämnad i tid
- [ ] Muntlig presentation genomförd

### Väl godkänt (VG)

- [x] Ytterligare en valfri extern modul från reactnative.directory
- [x] Appen hämtar data från ett Web-API
- [x] Användningen av AI-verktyg dokumenterad i README
