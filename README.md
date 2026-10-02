LIA MATCHNINGS APP

BESKRIVNING: 
    - Appen låter studenter att se en lista på företag, baserat på listan som yrkeshögskolan i Borås ger ut.
    - Skapa en profil som matchas mot företagen, där de företagen man matchas mot bäst visas rangordnat.
    - Få notiser på de företagen, när ansökning senast ska vara inne.
    - Vibrerar när notisen kommer, eller när man skapat en profil, välj själv, profilen sparas i minnet lokalt hos din enhet, så att du slipper skriva profilen på nytt.

SÅ KÖR DU:
    - git clone: https://github.com/04luknie-nemo/lia_match.git 
    - inne i expo-app kör du:
        - npx install
        - npx expo start
        - a, eller w, beror på vad du vill köra
    - inne i Match_API kör du: 
        - dotnet build
        - dotnet run
# Komponenter och moduler

[x] 4 RN-komponenter, klart (FlatList, TextInput, Pressable, View/Text, Switch).
[x] 4 Expo-moduler, 5 av 4 klar (secure-store, haptics, notifications, clipboard, checkbox).

## Inlämning

Inlämningen sker via läroplattformen. Zippa projektmappen **utan `node_modules`**. Mappen `.git` måste följa med så att jag hittar till ditt publika repo.

### README.md

I projektmappen ska det, utöver all kod, finnas en `README.md` som innehåller:

1. [x] **Titel** på projektet
2. [x] **Beskrivning** – vad appen gör och vem den är för
3. [x] **Så bygger och kör du projektet** – steg för steg, från `git clone` till appen igång i Expo Go
4. [x] **Använda RN-komponenter** – lista dem och skriv en rad om vad var och en används till
5. [] **Använda Expo SDK-moduler** – samma sak
6. [] **Uppfyllda krav** – kryssa av listorna längst ner i det här dokumentet

Skriv README:n för någon som aldrig sett projektet. Det är den jag läser först.

---

## Presentation

Du ska presentera din applikation för klassen på presentationsdagen. Presentationerna sker i mindre grupper och du har **ca 12 minuter**.

Presentationen ska innehålla:

- **Appen** – visa den körandes, inte bara skärmdumpar
- **Moduler** – vilka 4 expo moduler du använt, till vad och hur de används (dvs i koden).
- **Arbetsprocessen** – hur du planerat, genomfört och strukturerat arbetet
- **En reflekterande del** – vad var svårt? Vad skulle du gjort annorlunda? Vad tar du med dig?

---

## Krav för godkänt (G)

1.  [x] Projektet använder minst **4 RN-komponenter** och 
1b. [x]  minst **4 moduler från Expo SDK**
2.  []  De använda komponenterna och modulerna är **antecknade i README.md**, tillsammans med en lista över uppfyllda krav
3.  [x] **Expo Router** används för navigering i appen, och minst en skärm tar emot en parameter
4.  [x] **Git och GitHub** har använts, med commits spridda över arbetets gång
5.  [x]  Projektmappen innehåller en **README.md** enligt beskrivningen ovan
6.  [x]  Uppgiften är **inlämnad i tid**
7.  []  **Muntlig presentation** är genomförd

## Krav för väl godkänt (VG)

1. Alla punkter för godkänt är uppfyllda
2. [] **Ytterligare en valfri extern modul** används i projektet från [reactnative.directory](https://reactnative.directory)
3. [x] Appen **hämtar data från ett Web-API**
4. [x]  **Användningen av AI-verktyg dokumenteras i README** – vilka verktyg du använt, till vad, och hur du verifierat att koden gör det du tror. Ta även upp det i presentationens reflekterande del.

# AI DOKUMENTATION - OBS jag har inte vibe kodat i den form att ai skrivit och tagit över!
- Ber om tips, försöker att jobba med "Pusha mig i rätt riktning utan att ge mig svaret"

- workplaces/index diskuterade jag och claude väg framåt med koden om att hämta profile, matcha den mot företag och lista företagen som matchar, istället för hela listan, som skulle kunna ligga nån annanstans. Claude tycker att nästa steg är att flytta kollen till apiet för att det hör bättre hemma där, men får se.

- Claude i webbläsaren hjälpte mig med att hitta techstack från företagen så att demo matchningen blir bättre :D.

- Claude hjälpte mig lite med att knuffa mig i rätt riktning angående web apiet med endpoints, var så länge sen, men det kommer tillbaka. 

- Claude code fick fram lite kod angående expo-constants, så att ip är flexibelt, inte hårdkodat, och blir olika/fungerar oavset nätverk under utveckling, ska appen lanseras? då "måste API:t ligga på en riktig server."

- Det var smidigt att lägga till notifications och haptics, bollade lite med claude om hur man fick fram koden, 