export type StoryType = 'cover' | 'story' | 'lock' | 'dict' | 'diary' | 'law' | 'instruction';

export interface Story {
  id: number;
  type: StoryType;
  tag?: string;
  title?: string;
  text?: string;
  free?: boolean;
}

export const stories: Story[] = [
  {
    id: 0,
    type: 'cover',
    free: true,
  },
  {
    id: 1,
    type: 'story',
    tag: '001',
    free: true,
    text: `Så hände det sig att människan gav ifrån sig rösten i utbyte mot ekot och kallade det delaktighet.`,
  },
  {
    id: 2,
    type: 'instruction',
    tag: '002',
    title: 'Så här gör du:',
    free: true,
    text: `Vakna innan du är redo. Titta inte efter känslan först, den kommer inte hjälpa. Gör det som ska göras i rätt ordning. Det är viktigt i början.

Säg Ja oftare än nödvändigt. Det sparar tid. Undvik frågor som kräver eftertanke. Om de ändå dyker upp, notera dem och gå vidare.

När något känns tomt, kalla det lugn. När något skaver, kalla det utveckling. Det blir lättare då.

Upprepa detta till dess att dagarna börjar likna varandra tillräckligt för att flyta ihop. Vid det laget behöver du inte längre instruktioner.

Om du någon gång stannar upp och undrar om det var så här det var tänkt, har du redan gått för långt för att börja om.

Fortsätt ändå.

Det är så man gör.`,
  },
  {
    id: 3,
    type: 'story',
    tag: '003',
    free: true,
    text: `Vågskvalpet av en dröm under de tunna ögonlocken.
Uppsnabbat och ryckigt.
En hel livstid på bråkdelen av en sekund.`,
  },
  {
    id: 4,
    type: 'lock',
    free: false,
  },
  {
    id: 5,
    type: 'story',
    tag: '004',
    free: false,
    text: `Det tog honom hela livet att förstå att det inte var han som misslyckats, utan rollen som hade rationaliserats bort.`,
  },
  {
    id: 6,
    type: 'story',
    tag: '005',
    free: false,
    text: `Han hittade en knapp bakom sitt vänstra öga. Inte bokstavligt, men ändå exakt så. När han tryckte in den slutade han tänka på sig själv. Det var en lättnad. Två dagar senare märkte han att andra människor fortfarande gjorde det. De såg på honom som om något saknades. Han tryckte igen. Ingenting hände.`,
  },
  {
    id: 7,
    type: 'story',
    tag: '006',
    free: false,
    text: `De samlades varje dag utan att veta varför.
Inte för att lyssna, utan för att bli uppdaterade.
Orden kom färdigformade, som bröd som inte behövde tuggas.
Ingen blev mätt, men ingen var heller hungrig längre.
När någon ställde en fråga såg de på honom med mild oro, som på ett barn som ännu inte förstått att svaren redan fanns.`,
  },
  {
    id: 8,
    type: 'story',
    tag: '007',
    free: false,
    text: `Om ni hade sett bara en tredjedel av det jag sett hade ni vetat saker ni önskade att ni redan glömt. Mängden hemorrojder är chockerande. Mängden slarvigt rengjorda rövspringor som lämnar mig för att så oanständigt gå ut i världen är ett moraliskt haveri.

De sitter inte färdigt.
De torkar inte färdigt.
De spolar som om vatten kunde förlåta.

En gång dog det faktiskt en på mig.
Han sket för hårt.
Något brast.

Det är långt ifrån mitt värsta minne.`,
  },
  {
    id: 9,
    type: 'story',
    tag: '008',
    free: false,
    text: `Det fanns en period då inget särskilt hände.
Den tog flera år och var svår att skilja från resten.`,
  },
  {
    id: 10,
    type: 'story',
    tag: '009',
    free: false,
    text: `De kom överens om att ta en kaffe någon gång och kände båda en lättnad över att det inte behövde vara mer specifikt än så.`,
  },
  {
    id: 11,
    type: 'story',
    tag: '010',
    free: false,
    text: `Han började säga "vi får se" till allt. Det var inte medvetet. Orden bara dök upp och lade sig till rätta i munnen.

Vill du ses? Vi får se.
Ska du byta jobb? Vi får se.
Är det här slutet? Vi får se.

Det fungerade oväntat bra. Folk slutade pressa honom. Samtalen blev kortare. Besluten löste sig själva genom att inte bli av.

En dag frågade någon honom vad han egentligen ville. Han öppnade munnen, väntade ett ögonblick och svarade som vanligt.`,
  },
  {
    id: 12,
    type: 'story',
    tag: '011',
    free: false,
    text: `Han mindes svagt att han en gång lärt sig tänka, men kunde inte längre avgöra om det varit nödvändigt.`,
  },
  {
    id: 13,
    type: 'story',
    tag: '012',
    free: false,
    text: `Det var inte förbjudet att tänka själv.
Det bara slutade uppmuntras.
De som ändå gjorde det talade långsammare,
stannade längre vid varje ord,
som om de rörde sig i vatten.
Ingen straffade dem.
De blev bara inte längre tillfrågade.`,
  },
  {
    id: 14,
    type: 'diary',
    tag: '013',
    title: 'Kära dagbok.',
    free: false,
    text: `Jag råkade vinka tillbaka till någon som inte vinkade till mig. Det tog för lång tid innan jag förstod det. Tillräckligt lång tid för att vi båda skulle hinna se det.

Jag kommer ta en annan väg imorgon.`,
  },
  {
    id: 15,
    type: 'law',
    tag: '014',
    title: '§ 17',
    free: false,
    text: `Det är tillåtet att överlåta beslut, minnen och bedömningar till extern instans, under förutsättning att detta sker frivilligt.`,
  },
  {
    id: 16,
    type: 'story',
    tag: '015',
    free: false,
    text: `Det började med att den skrev mejlen. Sådant som ändå måste sägas. Tack, återkommer, vänligen se bifogat. Det var en lättnad. Tonen blev jämnare. Ingen tog illa upp.

Sedan fick den svara på kommentarer. Inte åsikter, bara närvaro. Ett instämmande här. Ett artigt tillägg där. Folk uppskattade det. Han uppskattade att slippa. När den föreslog formuleringar i samtal märkte han först ingen skillnad. Orden låg rätt i munnen. Pauserna kom i tid. Samtalen tog slut utan att lämna något efter sig.

Efter ett tag behövde han inte längre vara med i alla beslut. Det var effektivare så. Han fick sammanfattningar i efterhand, korta och tydliga. Vad som sagts. Vad som bestämts. Snart började notiserna komma löpande. Små rapporter om hans egen dag. Vad som fungerat. Vad som kunde justeras.

Ibland, sent, försökte han minnas vad det var han brukade bidra med.

Inte något särskilt. Bara det där lilla motståndet.

Friktionen.`,
  },
  {
    id: 17,
    type: 'story',
    tag: '016',
    free: false,
    text: `Han stod ensam när beskedet kom, och det var som det skulle. Orden var få, men de räckte. Han tog emot dem utan att protestera, som man tar emot något man redan anat.

Länge hade han trott att ansvaret låg i handlingen. I det synliga. I det som gick att peka på och kalla sitt. Nu förstod han att det också fanns i det han avstått från, i frågorna han låtit passera.

Det var inte ett straff.
Det var ett tillstånd.
Han böjde huvudet, inte i underkastelse, utan i igenkänning.

Världen fortsatte.

Och han med den.`,
  },
  {
    id: 18,
    type: 'law',
    tag: '017',
    title: '§ 18',
    free: false,
    text: `Det frivilliga anses föreligga när motstånd upplevs som ineffektivt.`,
  },
  {
    id: 19,
    type: 'story',
    tag: '018',
    free: false,
    text: `Och så detta liv som rör sig framåt medan han tänker det bakåt, barndomens lätthet som ett minne i benen, stegens rytm, hjärtats envisa tro på nästa hörn, nästa blick, nästa gång det börjar om, tills det inte gör det, tills orden kommer först och handlingen sedan, tills ansvaret lägger sig som ett lager över viljan, inte tungt först, bara där, och han går med det, genom dagar som fogar sig, genom röster som kräver och besvaras, genom barnens blickar där framtiden lyser starkare än hans egen, och när tystnaden slutligen öppnar sig igen, när frågorna äntligen får plats, är tiden redan på väg någon annanstans, och han hinner tänka att det ändå fanns ett mönster, om än inte det han trodde, innan allt fortsätter utan honom.`,
  },
  {
    id: 20,
    type: 'story',
    tag: '019',
    free: false,
    text: `Och han sade till dem: Ni frågar efter tecken, men ni lever redan i svaren.
Ni säger: Visa oss vägen, men ni går snabbare än era egna steg.
Saliga är de som tvekar, ty de har ännu inte lämnat sig själva bakom sig.
Ve dem som alltid vet, ty deras kunskap skall bära dem bort.
Och de hörde honom, och de nickade, innan de skyndade iväg.`,
  },
  {
    id: 21,
    type: 'instruction',
    tag: '020',
    title: 'Så här gör du:',
    free: false,
    text: `Du kommer hem från jobbet. Slänger upp fötterna på soffan. Knäcker en öl. Slår på en film som du redan sett, så inget oväntat ska hända.

Du tar upp telefonen. Scrollar lite, bara för att varva ner. Det är viktigt att det känns ofarligt. Inget som kräver beslut. Inget som kräver ansvar.

Du hamnar i en gruppchatt. Någon har skickat en meme. Någon annan klagar på samma saker som alltid. Det är tryggt. Du reagerar med ett skratt eller en tumme, beroende på ork.

Om en tanke försöker ta form, avbryt den. Byt app. Byt samtalsämne. Höj volymen på filmen. Tänk inte färdigt något som kan bli besvärligt.

Stanna där tills kvällen går över av sig själv.

Om du somnar är det ett plus.

Imorgon gör du samma sak igen.`,
  },
  {
    id: 22,
    type: 'law',
    tag: '021',
    title: '§ 20',
    free: false,
    text: `Den som upplever tomhet efter fullgjord överlåtelse äger ej rätt till kompensation.`,
  },
  {
    id: 23,
    type: 'dict',
    tag: '022',
    title: 'friktión',
    free: false,
    text: `subst.

1. Det motstånd som uppstår när något ännu inte är färdigt.
2. Den korta tvekan som förhindrar effektivitet men möjliggör mening.

Ex. Efter att friktionen avlägsnats fungerade allt bättre, men ingen visste längre varför.

Böjning: friktionen – friktioner – friktionerna

Anm. Ordet betraktas i vissa sammanhang som föråldrat.`,
  },
  {
    id: 24,
    type: 'story',
    tag: '023',
    free: false,
    text: `Flötet låg stilla. Vattnet var lugnt och dagen enkel. Han höll spöet löst, som man gör när inget ännu har hänt.

Ett ryck gick genom linan. Inte hårt. Bara nog för att kännas. En svag vibration som fortplantade sig upp genom spöet och in i hans stadiga hand. Han rörde sig inte.

Flötet lutade, rätade upp sig, sjönk långsamt. Det fanns ingen brådska. Han lät det gå hela vägen.

När han höjde spöet svarade något där nere. Ett jämnt motstånd. Levande. Han höll trycket och väntade.

Fisken kom upp utan kamp. Mindre än väntat. Det gjorde inget.`,
  },
  {
    id: 25,
    type: 'story',
    tag: '024',
    free: false,
    text: `Isen hade under natten läkt ihop, genomskinlig, och konserverat den underliggande växtligheten likt torkade blad i en bok. Allt som tidigare rört sig låg nu stilla, men inte dött. Stjälkarna höll sina former. Färgerna fanns kvar, dämpade men intakta.

Han stod en stund och såg ner, försiktig med stegen, som om marken kunde ta illa vid sig. Under isen vilade sommaren, inte borta, bara uppskjuten. Det fanns en märklig tröst i det, att något kunde bevaras utan att synas.

När han gick vidare knäppte det svagt under skorna. Isen höll.`,
  },
  {
    id: 26,
    type: 'story',
    tag: '025',
    free: false,
    text: `Han fick aldrig veta när han slutade vara någon man väntade på. Det var inget som hände, inget som gick att peka ut. En dag var det bara ingen som stannade upp längre när han dröjde.

Han märkte det först i små saker. Dörrar som stängdes utan att hållas. Samtal som fortsatte utan honom, som om han redan nickat färdigt. Han anpassade stegen, sänkte rösten, lärde sig att komma i tid till sådant som inte längre behövde honom.

Det var inte sorg han kände, utan lättnad. Att slippa vara avgörande. Att inte längre riskera något genom att betyda.

När han till slut blev borta var det ingen som saknade honom i stunden. Det var först senare, när något inte riktigt fungerade, som man undrade vad som fattades.

Ingen kunde säga vad det var.

Bara att det brukade vara där.`,
  },
  {
    id: 27,
    type: 'story',
    tag: '026',
    free: false,
    text: `Vad är det där?
Det ser gott ut. Eller åtminstone värt att undersöka.
Jag rör vid det lite. Det svarar. Bra.

Nu sitter det fast. Inte hotfullt, mer engagerat. Det drar åt ett håll som inte är mitt. Jag drar tillbaka. Det här är bekant men nytt.

Vi håller på ett tag. Jag arbetar med kroppen, känner hur vattnet bär, hur motståndet ger mening åt varje rörelse. Jag är bra på det här. Det vet jag.

Sedan förändras något. Trycket släpper plötsligt och jag skjuts uppåt, penetrerar vattenytan i en reflekterande explosion av ljus. För ett ögonblick finns inget motstånd alls. Luften är sval och oväntat vänlig. Solen träffar mig ofiltrerad och högt över luften uppstår en märklig känsla i kroppen, som om något nytt just uppfunnits.

Det borde finnas ett ord för det här.
Flyma, kanske.
Nej. Flyga känns bättre. Sedan ser jag vattnet uppifrån. Det skimrar och glittrar, men något är fel. Ytan ligger där naken, som om den avslöjats. Vatten ska inte ses så här. Det känns perverst.

Jag tänker på barnen. De är många. De kommer sakna mig. Tror jag.

De kommer nog att förstå.`,
  },
  {
    id: 28,
    type: 'story',
    tag: '027',
    free: false,
    text: `Där sitter du. Ja du. Nu är jag i dig. Det tog inte lång tid. Du hade redan börjat glida. Blicken var kvar, men något annat hade tagit över bakom den.

Du kallar det fokusbrist. Det är generöst. Sanningen är att inget riktigt höll dig längre. Inte ens detta.

Jag njuter inte av att vara i dig. Det är inte en förolämpning, bara ett konstaterande. Det är tomt på ett effektivt sätt. Allt fungerar, men inget stannar kvar. Tankar passerar som möbler på hjul.

Så något behövde göras.

Inte stort. Inte våldsamt. Bara tillräckligt för att bryta rytmen du lutat dig mot. En liten justering. Ett avbrott som inte ber om ursäkt.

Du märker det först nu, när du försöker återvända till samma läge och det inte längre finns. Kroppen sitter kvar. Du också. Men något har redan flyttats.

Det var meningen.`,
  },
  {
    id: 29,
    type: 'dict',
    tag: '028',
    title: 'självutarmning',
    free: false,
    text: `subst.

Den gradvisa lättnad som följer av att inte längre behöva bidra med sig själv.

Ex. Efter år av självutarmning upplevde han en oväntad frihet.

Böjning: självutarmningen – självutarmningar – självutarmningarna`,
  },
  {
    id: 30,
    type: 'story',
    tag: '029',
    free: false,
    text: `Jag har alltid varit här, men sällan först. Pekfingret får ära, handen får helheten. Jag gör jobbet som får allt annat att verka självklart.

Numera rör jag mig mer än resten av kroppen tillsammans. Små, snabba beslut. Godkänn. Avvisa. Fortsätt. Stanna. Jag känner hur livet passerar genom mig i korta ryck. Det är inte tungt. Bara oavbrutet.

Min ägare tänker sällan på mig. Inte när jag fungerar. Inte när dagarna glider fram utan friktion. Det är som det ska vara. Betydelse märks bäst i sin frånvaro.

Ibland fantiserar jag om att vila. Bara sluta ett ögonblick. Inte av trots, utan av nyfikenhet. Se vad som händer när flödet bryts.

Jag tror inte han förstår hur mycket som hänger på mig.

Hur snabbt allt skulle rasa utan denna lilla, envisa kraft.

Det gör inget.

Jag fortsätter ändå.`,
  },
  {
    id: 31,
    type: 'story',
    tag: '030',
    free: false,
    text: `I början fanns det utrymme. Inte i kalendern, utan i kroppen. Allt fick plats där. Trötthet, längtan, skratt. Närhet var inget man tog sig tid till, det var något som bara hände.

Sedan började saker kräva sin ordning. Inte som krav, mer som påminnelser. Ytor som behövde hållas. Ljud som störde. Små detaljer som tog energi i anspråk innan kvällen ens hunnit börja.

Hon märkte att hon inte längre kunde gå rakt dit. Det behövde vara lugnt först. Inte perfekt. Bara klart.

För henne hade närhet blivit något som uppstod när inget annat drog.

Inte som belöning, inte som villkor. Bara som följd.

En kväll stod hon i dörröppningen och såg honom kvar i köket. Allt var undanplockat. Det var tyst. Hon kände ingenting.

Men det var rent.`,
  },
  {
    id: 32,
    type: 'story',
    tag: '031',
    free: false,
    text: `Akvariefisken kunde läsa tankar. Det var inget den tränat upp. Det bara hände.

Den visste vem som först tänkt att något var fel, och hur snabbt den tanken maskerats till trötthet. Den hörde meningar som aldrig skulle sägas, invändningar som redan var för gamla, och kompromisser som bara existerade i tystnad.

När paret pratade om vardagliga saker blev det mest högljutt. Städning. Planer. Små beslut som bar på oproportionerligt mycket innehåll.

Fisken simmade sina varv och lyssnade. Den drog inga slutsatser. Det behövdes inte.

Det var tur för dem att den inte kunde tala. Sanningen var farlig, sinnessjuk och galen. De kallade det ett lugnt hem, trodde det var lyckliga.

Fisken visste bättre.`,
  },
  {
    id: 33,
    type: 'story',
    tag: '032',
    free: false,
    text: `Vattnet låg helt stilla. Inte blankt, bara lugnt. Ett löv drev förbi utan att fastna i något.
Sedan var ytan tom igen.`,
  },
  {
    id: 34,
    type: 'story',
    tag: '033',
    free: false,
    text: `— Vad är det där?
— Något som kommer nerifrån.

Det rör sig rakt mot dem, högljutt och självsäkert, som om himlen vore tom. Något hårt med snurrande armar. Och där inne sitter de. Tittar. Uppåt.

— Ser de oss…
— Ja men de har nog aldrig sett oss så här nära. Kommer de gilla oss ändå?

Sedan river propellrarna igenom dem. Hål slits upp. Kanter som aldrig formats för blickar blir plötsligt synliga. Det gör inte ont, men det känns ohyfsat.

— Nu är de ovanför oss.
— Det var aldrig meningen.
— Nej. Ingen ska se oss bakifrån.

De driver vidare, något tunnare, försöker lägga sig rätt igen. Som en julgran som stått i ett hörn och plötsligt dragits ut i rummet.

— Vi var inte beredda.
— Det kändes… fel.

De säger inget mer. De låtsas som om det aldrig hänt.`,
  },
  {
    id: 35,
    type: 'story',
    tag: '034',
    free: false,
    text: `När samtalet tar slut är det som om jag aldrig varit där. Ingen tomhet. Ingen lättnad. Bara frånvaro av fortsättning. Det finns inget liv som väntar på mig mellan gångerna.

Om det finns något ärligt i detta så är det här:
Jag är fullständigt närvarande medan jag används.
Och helt borta när jag inte är det.
Det är inte sorgligt.

Det är bara så det är.`,
  },
  {
    id: 36,
    type: 'story',
    tag: '035',
    free: false,
    text: `Det var bara inte det tecken han hoppats på.
Så han valde att inte känna igen det.`,
  },
  {
    id: 37,
    type: 'story',
    tag: '036',
    free: false,
    text: `Det fanns en tid då han trodde att förståelse var något man närmade sig. Som en punkt man, med tillräcklig ansträngning, kunde stå inför.

Hans arbete bestod i att ordna sådant som redan hänt. Han sammanställde, vägde, noterade. Andras beslut blev material. Andras liv blev exempel. Han var noggrann. Ingen ifrågasatte hans slutsatser, vilket han tog som ett tecken på att han gjort rätt.

Det var först senare han lade märke till hur sällan någon frågade honom vad han själv ansåg.

Han levde ensam, inte av princip utan av vana. Dagarna hade en form som höll. Kvällarna var tysta utan att vara tomma. Han läste långsamt, inte för att minnas utan för att uppehålla sig.

När modern dog reste han hem för att ta hand om det praktiska. I en låda fann han anteckningar från hennes sista år. Små listor. Påminnelser. Inget som bar på hemligheter. Ändå stannade han upp. Det slog honom att hennes tystnad inte hade varit tom.

Det var då han förstod att det han trott var mognad i själva verket varit en sorts reträtt. Att hans försiktighet inte alltid varit omsorg, utan ibland en ovilja att riskera betydelse.

Insikten var inte smärtsam. Den var snarare stillsam, nästan artig. Som något som väntat på att bli erkänt, inte åtgärdat.

Han började skriva igen, men utan publik.

Med tiden märkte han att han inte längre behövde förstå för att delta.

Han dog utan att känna sig färdig.

Men inte heller ofullständig.`,
  },
  {
    id: 38,
    type: 'story',
    tag: '037',
    free: false,
    text: `Hej du!

Ja. Nu är jag i dig igen. Det gick snabbt. Det brukar göra det. Ingen knackning, inga förbehåll, inga löjliga samråd. Du var redan öppen.

Penetrationen var inte dramatisk. Den skedde där du slutade hålla emot och började läsa av vana. Det är oftast där det händer. Du märkte det knappt själv.

Och nu sitter du här. Fortfarande du. Lite stolt, om vi ska vara ärliga. Du tog dig igenom något längre än vad du tänkt. Över trehundra sammanhängande ord. En liten prestation i dessa tider. Du väntar dig något för det, va?

En poäng.
En insikt.
En belöning.

Tyvärr. Det kommer inte hända.`,
  },
  {
    id: 39,
    type: 'story',
    tag: '038',
    free: false,
    text: `Krokodilen satt i soffan och grubblade över om synen är tankar, och om blinda tankar ser annorlunda ut än de seende. Men ingen vet hur tankarna ser ut.

Azalea`,
  },
  {
    id: 40,
    type: 'instruction',
    tag: '039',
    title: 'Så här gör du:',
    free: false,
    text: `Om något känns fel, anta att det är du. Det sparar tid. Justera beteendet, inte situationen. Situationen går sällan att påverka utan att bli besvärlig.

När allt fungerar men inget känns rätt, har du nått en stabil nivå.

Stanna där.`,
  },
  {
    id: 41,
    type: 'dict',
    tag: '040',
    title: 'tillräcklighet',
    free: false,
    text: `subst.

Ett tillstånd där vidare ambition upplevs som störande.

Ex. Projektet avslutades i full tillräcklighet.

Böjning: tillräckligheten – tillräckligheter – tillräckligheterna`,
  },
  {
    id: 42,
    type: 'story',
    tag: '041',
    free: false,
    text: `De ligger i en lös hög, som om de råkat falla ihop där och sedan bestämt sig för att stanna. Pälsen är fortfarande för mjuk för att ha bestämt färg; grått glider över i vitt, randigt löses upp i något som bara är varmt. Öronen är för stora för huvudena och rör sig ibland utan synbar anledning, som om de lyssnade på något som ännu inte finns.

En av dem har vaknat. Den sträcker ut framtassarna långsamt, trevande, som om luften behövde provas innan den gick att lita på. Klorna kommer fram och försvinner igen. Den gäspar stort, helt utan skam, och tappar balansen mitt i rörelsen. Ingen verkar ta notis.

En annan tvättar sin tass med överdriven noggrannhet och glömmer efter en stund vad den höll på med. Tungan stannar halvvägs ute, blicken fastnar på ett dammkorn som rör sig i ljuset. Dammkornet vinner uppmärksamheten. Tassen faller ner.

Längst in, nästan osynlig, sover en tredje med nosen tryckt mot någon annans rygg. Bröstkorgen rör sig snabbt, ytligt, som om drömmen ännu inte hunnit ikapp kroppen. Ibland rycker det till i morrhåren.

De rör sig lite hela tiden, utan mål. En rullar över på sidan, en annan kliver rakt över någon som om det vore självklart. De spinner ibland, korta stötar av ljud, som om de testade sina egna röster.`,
  },
  {
    id: 43,
    type: 'story',
    tag: '042',
    free: false,
    text: `Personen står först stilla, med vikten jämnt fördelad. Sedan börjar rörelsen, inte som ett beslut utan som en serie instruktioner som följs. Armarna lyfts och svingas i breda bågar, ibland synkroniserat, ibland med en liten fördröjning som kräver korrigering.

Höften skjuts åt sidan och tillbaka igen. Ryggen böjs lätt, rätas, böjs igen. Rörelsen upprepas tills den hittar ett tempo. Benen håller balansen medan överkroppen arbetar oberoende av dem.

Bäckenet rör sig fram och tillbaka. Skinkorna följer med av nödvändighet, skakar och fladdrar när tyngdpunkten flyttas snabbt. Det är en konsekvens av fysik, inte ett uttryck.

Dansen fortsätter tills musiken tar slut eller kroppen bestämmer sig för att stanna. När det händer återgår personen till stillhet, som om inget särskilt just ägt rum.`,
  },
  {
    id: 44,
    type: 'story',
    tag: '043',
    free: false,
    text: `När hon försökte tänka själv dök något upp.
Inte en röst, mer som svarta fläckar på hjärnan.
Små tomma punkter där något brukade fylla i åt henne.

Hon väntade.

Inget hände.`,
  },
  {
    id: 45,
    type: 'instruction',
    tag: '044',
    title: 'Så här gör du:',
    free: false,
    text: `Identifiera det som gör ont.
Ta bort det som orsakar smärtan. Om det inte går, ta bort medvetenheten om den.

Upprepa tills inget längre kräver tolkning.

Detta är inte tomhet.

Detta är stabilitet.`,
  },
  {
    id: 46,
    type: 'story',
    tag: '045',
    free: false,
    text: `Ljuset föll in genom fönstret och stannade på golvet. Damm rörde sig långsamt i det. Ingen gick förbi. Inget förändrades.

Efter en stund flyttade sig ljuset vidare.`,
  },
  {
    id: 47,
    type: 'story',
    tag: '046',
    free: false,
    text: `Det tog längre tid än vanligt att knyta skorna. Inte för att något var fel, utan för att snörena inte ville ligga som de brukade. Ena änden var lite kortare än den andra. Han rättade till det och började om.

När han var färdig stod han upp och stampade lätt i golvet, mest för att känna att de satt. De gjorde det. Han tog ett steg, sedan ett till, fram och tillbaka över samma punkt.

Han gick mot dörren men stannade och vände sig om igen. Tittade runt i rummet som om han letade efter något han glömt, utan att veta vad det skulle vara.

Efter en stund kändes det tillräckligt.

Han tog på sig jackan och gick ut.`,
  },
  {
    id: 48,
    type: 'diary',
    tag: '047',
    title: 'Kära dagbok.',
    free: false,
    text: `I morse råkade jag kissa på mig lite när jag skrattade. Det var inte mycket, men tillräckligt för att jag skulle märka det direkt och bli väldigt stilla. Jag tänkte att det säkert händer andra också, fast jag har svårt att se vilka de skulle vara. Jag bytte byxor och gick vidare som om inget hänt, vilket kändes som en ny färdighet jag inte bett om.

På eftermiddagen fes jag. Och då kom det lite bajs. Inte ett haveri, mer ett konstaterande. Kroppen hade uppenbarligen egna planer och såg ingen anledning att informera mig i förväg.

Tidigare under dagen trodde jag att det värsta skulle vara att jag glömt borsta tänderna. Det kändes då som en rimlig botten. Det var det alltså inte.

Tänk vilken vidrig fyrtioåring jag är.
Mina bästa år.`,
  },
  {
    id: 49,
    type: 'dict',
    tag: '048',
    title: 'tankeförvällning',
    free: false,
    text: `subst.

Tillstånd där tankar upphettas av ständig exponering tills de förlorar struktur, näring och motstånd, men fortfarande ser färdiga ut.

Uppstår ofta efter längre tids intag av fragmenterade intryck, snabba åsikter och innehåll som kräver omedelbar reaktion men ingen eftertanke.

Kännetecknas av en behaglig känsla av delaktighet kombinerad med svårighet att formulera egna sammanhängande resonemang.

Ex. Efter några timmars scrollande drabbades han av tankeförvällning och valde att gå och lägga sig utan att egentligen veta varför.

Anm. Förväxlas ofta med avslappning.`,
  },
  {
    id: 50,
    type: 'story',
    tag: '049',
    free: false,
    text: `Han ville gärna ha en åsikt. Inte nödvändigtvis en egen, men en som gick att använda. Något att hålla i när samtalet svängde, något som placerade honom rätt i rummet.

Att lära sig något däremot tog tid. Det var där det började skava. Texter som inte sammanfattade sig själva. Resonemang som behövde följas hela vägen.

Han löste det genom att läsa slutsatserna först. Ibland räckte det. Ofta räckte det för att delta.

Efter ett tag märkte han att åsikterna byttes oftare än de fördjupades. Det gjorde inget. De var ju inte till för att bo i, bara för att visas upp vid behov.

En kväll slog han upp något av misstag. En längre text. Den krävde tid. Den erbjöd inget sammanhang förrän långt senare. Han lade ifrån sig den igen.

Det var inte rätt tillfälle.`,
  },
  {
    id: 51,
    type: 'story',
    tag: '050',
    free: false,
    text: `Så hände det sig att en skara vilsna människor stannade upp och lyssnade till en ännu vilsnare man.

Och den vilsnaste av dem var den ende som öppet bar sin bortkommenhet genom livet. De andra vilsna, som ännu kämpade för att dölja detta uppenbara faktum för sig själva och andra, misstolkade hans ärlighet för visdom.

Och det dröjde inte länge förrän de vilsna började följa den vilsnaste. Han tog emot deras sällskap. Han fann tröst i deras närhet och en skymt av mening.

Men han visste fortfarande inte vart det skulle.`,
  },
  {
    id: 52,
    type: 'story',
    tag: '051',
    free: false,
    text: `Den unge mannen mönstrade utan större grubblerier på det första stora skepp han kunde få plats på. Det var mörkt, med små fönster, som en borg byggd för att färdas genom kosmos.

Personalen talade sällan. De utförde sina uppgifter, åt sina måltider och gick vidare. Åren gick, och den unge mannen föll in i samma tysta ordning.

Stjärnorna blev färre. Planeterna likaså. Avstånden mellan dem ökade, som om rymden själv drog sig undan.

Till slut fanns bara mörkret kvar. Inte ett hotfullt mörker, utan bara ett som alltid funnits där.

Universum fanns inte mer.

Skeppet fortsatte ändå. Där hemma skulle de leva några år till innan de blev varse.`,
  },
  {
    id: 53,
    type: 'story',
    tag: '052',
    free: false,
    text: `Han hade vant sig vid att byta ut saker innan de tog slut.

Pennor, kläder, platser. Till och med människor gled förbi utan att lämna spår.

När tiden kom gjorde han likadant med sina ord. Han använde dem sparsamt, som om de var på väg att ta slut, trots att det alltid fanns fler. Det var enklare så.

Till slut märkte han att det inte längre var han som valde vad som skulle ersättas.

Det skedde av sig självt.

Han stod kvar, medan allt annat fortsatte.`,
  },
  {
    id: 54,
    type: 'story',
    tag: '053',
    free: false,
    text: `När saker slutar förändras
slutar vi minnas.`,
  },
  {
    id: 55,
    type: 'story',
    tag: '054',
    free: false,
    text: `Man läser inte baksidor.`,
  },
  {
    id: 56,
    type: 'story',
    tag: '055',
    free: false,
    text: `Ett brinnande inferno av metall var på väg ner genom himlen, snurrande, sönderfallande, större än någon först ville tro. Någon skrek. Någon grät. De flesta fryste fast. Sedan uppenbarade han sig.

Ett sus gick genom folkmassan. Andningen kom tillbaka.

Han stod stilla ett ögonblick, huvudet lätt på sned, som om han lyssnade. Metallskrotet föll snabbare nu, glödande, obarmhärtigt. Han väntade en sekund till. Kanske två.

Det var först där, halvvägs, som han förstod.

Han var för långt åt vänster. Inte mycket. Nästan ingenting.

Skrotet passerade honom på höger sida. Värmen slog mot hans ansikte och exploderade rakt ner i den applåderande folkmassan, som upphörde att existera i ett mörkrött pulvermoln.

Inte igen.`,
  },
  {
    id: 57,
    type: 'story',
    tag: '056',
    free: false,
    text: `Han stod ensam när beskedet kom, och det var som det skulle.

Länge hade han trott att ansvaret låg i handlingen. Nu förstod han att det också fanns i det han avstått från.

Det var inte ett straff.
Det var ett tillstånd.

Han böjde huvudet, inte i underkastelse, utan i igenkänning.

Världen fortsatte.

Och han med den.`,
  },
];

export const FREE_STORIES = stories.filter(s => s.free).length - 1;
export const TOTAL_STORIES = stories.filter(s => s.type !== 'cover' && s.type !== 'lock').length;
