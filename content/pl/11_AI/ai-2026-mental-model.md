---
id: ai-2026-mental-model
title: "AI bez lukru - jak naprawdę myśleć o współczesnych modelach"
team: red-blue
domain: artificial-intelligence
section: ai-fundamentals
type: knowledge
angle: mental-model
sourceTrack: narzedziownik-ai
tags:
  [
    "ai",
    "llm",
    "lrm",
    "agents",
    "rag",
    "context",
    "tokens",
    "mcp",
    "harness",
    "automation",
    "hitl",
  ]
difficulty: medium
shortDescription: "Notatka porządkująca współczesne AI od podstawowego modelu działania LLM, przez tokeny, kontekst, RAG i agentów, aż po automatyzację, Human in the Loop i praktyczne pytanie: gdzie AI rzeczywiście daje przewagę, a gdzie nadal potrzebny jest człowiek."
updatedAt: "2026-10-03"
---

# AI bez lukru - jak naprawdę myśleć o współczesnych modelach

## Po co robię tę notatkę

Bo wokół AI zrobił się jeden wielki worek.

ChatGPT, LLM, reasoning, agent, RAG, MCP, modele lokalne, automatyzacja, pamięć, narzędzia.

Wszystko nazywamy AI.

I przez to bardzo łatwo używać tych rzeczy codziennie, a jednocześnie nie mieć dobrego modelu tego, co właściwie dzieje się pod spodem.

Nie chcę zapamiętywać kolejnych nazw modeli.

Za pół roku część z nich i tak będzie nieaktualna.

Chcę rozumieć:

- czym różni się model od całego systemu zbudowanego wokół niego,
- skąd model bierze odpowiedź,
- dlaczego potrafi brzmieć pewnie i jednocześnie się mylić,
- czym różni się LLM od agenta,
- co naprawdę daje RAG,
- po co istnieją narzędzia, skille i MCP,
- kiedy AI można puścić samodzielnie,
- a kiedy człowiek musi zostać w środku procesu.

Najważniejsze jest dla mnie jedno:

**AI nie jest magiczną maszyną do udzielania poprawnych odpowiedzi.  
To komponent systemu, którego możliwości i ryzyko zależą od tego, co zbudujemy wokół niego.**

---

# Najważniejszy model na start

Największy błąd w myśleniu o AI wygląda mniej więcej tak:

> Mam ChatGPT, więc mam model AI.

Nie do końca.

To, z czym rozmawiam w interfejsie, może być już całym systemem:

- modelem,
- instrukcjami systemowymi,
- pamięcią,
- narzędziami,
- dostępem do internetu,
- wyszukiwaniem,
- RAG,
- interpreterem kodu,
- agentem,
- kontrolą uprawnień,
- mechanizmami bezpieczeństwa.

Sam model jest tylko jednym elementem.

Dobry skrót myślowy:

**model = mózg**

**kontekst = to, co aktualnie widzi**

**narzędzia = ręce**

**harness = ciało i układ sterowania**

**agent = model, który dostał możliwość wykonywania kolejnych działań**

I dopiero wtedy zaczyna się robić naprawdę ciekawie.

---

# AI nie zaczęło się od ChatGPT

Warto to pamiętać głównie po to, żeby nie traktować obecnej generacji modeli jak technologii, która pojawiła się nagle.

AI rozwijało się falami.

Najpierw były próby opisania sztucznego neuronu.

Potem pojawił się Turing i pytanie:

> czy maszyna może myśleć?

Później ELIZA pokazała coś chyba jeszcze ciekawszego.

Nie to, że komputer jest inteligentny.

Tylko to, jak łatwo człowiek potrafi przypisać inteligencję systemowi, który tylko dobrze ją symuluje.

I ten problem wrócił dzisiaj ze zdwojoną siłą.

Modele są znacznie bardziej przekonujące niż ELIZA.

Ale nasz mózg nadal działa podobnie.

Jeśli coś:

- odpowiada płynnie,
- pamięta kontekst,
- mówi naszym językiem,
- reaguje na emocje,
- potrafi żartować,
- i odpowiada w ułamku sekundy,

to bardzo łatwo zacząć traktować je jak drugiego człowieka.

A to jest niebezpieczny skrót poznawczy.

**Jakość rozmowy nie jest dowodem na jakość rozumowania.**

---

# Co tak naprawdę zmieniło AI

Przez dziesięciolecia brakowało kilku rzeczy jednocześnie.

Potrzebowaliśmy:

- ogromnej ilości danych,
- ogromnej mocy obliczeniowej,
- architektury, która potrafi tę skalę wykorzystać.

I te trzy rzeczy w końcu się spotkały.

Internet dał dane.

GPU dały równoległe obliczenia.

Transformer dał architekturę, która potrafiła dobrze wykorzystać jedno i drugie.

W 2017 roku pojawiła się architektura Transformer.

To właśnie stąd bierze się litera **T** w GPT.

Najważniejszą ideą nie jest dla mnie sama nazwa.

Chodzi o attention.

Model analizując token może uwzględniać inne tokeny znajdujące się w kontekście i oceniać, które z nich są w danym momencie istotne.

I nagle okazało się, że jeżeli:

- dokładamy dane,
- dokładamy moc,
- zwiększamy model,

to jakość zaczyna rosnąć w bardzo przewidywalny sposób.

To był moment, w którym skala zaczęła naprawdę działać.

---

# AI, ML, DL, GenAI, LLM, LRM - jak tego nie mieszać

Nie chcę traktować tych nazw jako sześciu osobnych technologii.

Lepiej patrzeć na nie jak na kolejne zawężenia.

## Artificial Intelligence

Najszerszy worek.

System wykonuje zadania, które normalnie kojarzymy z inteligencją.

---

## Machine Learning

Zamiast programować każdą regułę ręcznie:

```text
IF X
THEN Y
```

dajemy systemowi dane i pozwalamy mu znaleźć zależności.

Przykład:

nie opisuję wszystkich możliwych cech spamu.

Pokazuję tysiące wiadomości:

```text
SPAM
NOT SPAM
SPAM
SPAM
NOT SPAM
```

i model uczy się granicy między klasami.

---

## Deep Learning

Machine Learning oparty na wielowarstwowych sieciach neuronowych.

Zamiast ręcznie definiować:

> szukaj nosa, oczu i ust,

kolejne warstwy mogą same nauczyć się reprezentacji:

```text
piksele
↓
krawędzie
↓
kształty
↓
fragmenty obiektów
↓
obiekt
```

To samo podejście można zastosować do tekstu.

---

# GenAI

Generative AI nie tylko klasyfikuje.

Tworzy.

Może generować:

- tekst,
- kod,
- obraz,
- audio,
- wideo,
- dokumenty.

I właśnie ten fragment AI eksplodował konsumencko.

Nie dlatego, że nagle powstała cała sztuczna inteligencja.

Tylko dlatego, że dostaliśmy niesamowicie prosty interfejs:

**język naturalny.**

Nie muszę znać API.

Nie muszę znać Pythona.

Nie muszę wiedzieć, jak działa model.

Piszę:

> zrób mi X

i system próbuje zamienić intencję na rezultat.

To dramatycznie obniżyło próg wejścia.

---

# LLM - maszyna do przewidywania kolejnego tokenu

To zdanie brzmi prawie obraźliwie prosto.

Ale właśnie dlatego jest tak ważne.

LLM dostaje sekwencję tokenów i próbuje przewidzieć:

**co statystycznie powinno pojawić się dalej?**

Nie wybiera kolejnego słowa z jednej sztywnej odpowiedzi.

Buduje rozkład prawdopodobieństwa.

Przykładowo:

```text
Stolicą Polski jest...
```

kolejny token związany z Warszawą ma ekstremalnie wysokie prawdopodobieństwo.

Ale im bardziej pytanie staje się:

- niszowe,
- niejednoznaczne,
- słabo reprezentowane w danych,
- zależne od aktualnych informacji,

tym łatwiej model zaczyna generować coś, co **pasuje językowo**, ale nie musi być prawdziwe.

I tu dochodzimy do jednej z najważniejszych rzeczy w całym AI.

**Model jest optymalizowany pod generowanie dobrej kontynuacji.
Nie posiada wbudowanego mechanizmu gwarantującego prawdę.**

---

# Token - najmniejsza rzecz, o której warto pamiętać

Model nie widzi tekstu dokładnie tak jak człowiek.

Tekst jest dzielony na tokeny.

Tokenem może być:

- całe krótkie słowo,
- część słowa,
- znak,
- fragment ciągu znaków.

Dlaczego mnie to interesuje?

Bo token jest jednocześnie:

- elementem wejścia do modelu,
- elementem jego odpowiedzi,
- częścią limitu kontekstu,
- często jednostką rozliczenia API.

Czyli praktycznie:

```text
tekst
↓
tokenizacja
↓
model
↓
tokeny odpowiedzi
↓
tekst
```

---

# Kontekst - pamięć robocza modelu

To jedna z najważniejszych rzeczy do zrozumienia.

Model odpowiada na podstawie tego, co w danym momencie znajduje się w jego kontekście.

Może to być:

- mój prompt,
- poprzednie wiadomości,
- instrukcja systemowa,
- dokument,
- wynik działania narzędzia,
- rezultat wyszukiwarki,
- pamięć dołączona przez aplikację.

Czyli:

**kontekst = wszystko, co model aktualnie widzi i może wykorzystać przy generowaniu kolejnej odpowiedzi.**

Okno kontekstu określa, ile takiego materiału może zostać dostarczone jednocześnie.

I tu pojawia się ważny błąd:

> większy kontekst = model wszystko pamięta i wszystko dobrze wykorzysta.

Nie.

Możliwość zmieszczenia miliona tokenów nie oznacza jeszcze, że każdy fragment będzie miał identyczne znaczenie.

To bardziej ogromne biurko niż fotograficzna pamięć.

Możesz położyć na nim sto dokumentów.

Problem w tym, żeby znaleźć właściwy dokument dokładnie wtedy, kiedy jest potrzebny.

---

# Embedding - znaczenie zapisane jako liczby

To pojęcie długo brzmi bardziej magicznie, niż jest w praktyce.

Embedding to numeryczna reprezentacja znaczenia.

Chodzi o to, żeby teksty podobne znaczeniowo znajdowały się blisko siebie w przestrzeni wektorowej.

Czyli:

```text
"reset hasła użytkownika"

"odzyskanie dostępu do konta"
```

mogą być semantycznie bliżej siebie niż:

```text
"reset hasła użytkownika"

"temperatura procesora"
```

nawet jeśli nie używają dokładnie tych samych słów.

To później staje się bardzo ważne przy wyszukiwaniu informacji.

---

# Chunk - bo dokument trzeba najpierw pociąć

Jeśli mam dokument liczący 300 stron, zwykle nie chcę za każdym razem wrzucać modelowi całych 300 stron.

Dokument dzielę więc na mniejsze fragmenty.

Chunki.

Przykładowo:

```text
PDF
↓
chunk 1
chunk 2
chunk 3
chunk 4
...
```

Dla każdego fragmentu mogę stworzyć embedding.

A potem, kiedy pytam:

> jakie mamy wymagania dotyczące resetowania haseł?

system może znaleźć fragmenty semantycznie najbardziej podobne do pytania.

I tu pojawia się RAG.

---

# RAG - najpierw znajdź, potem odpowiedz

Retrieval Augmented Generation.

Jedno z tych pojęć, których nazwa brzmi gorzej niż sama idea.

Model zamiast odpowiadać wyłącznie na podstawie wiedzy zapisanej w jego parametrach:

1. dostaje pytanie,
2. wyszukuje odpowiednie fragmenty źródeł,
3. dodaje je do kontekstu,
4. dopiero wtedy generuje odpowiedź.

Czyli:

```text
pytanie użytkownika
        ↓
     retrieval
        ↓
odpowiednie fragmenty dokumentów
        ↓
      kontekst
        ↓
        LLM
        ↓
     odpowiedź
```

I to jest fundamentalnie inne podejście niż:

> nauczmy model naszych dokumentów.

RAG zazwyczaj **nie zmienia samego modelu**.

Dostarcza mu właściwą wiedzę w momencie wykonywania zadania.

To jest ogromna różnica.

---

# RAG != fine-tuning

To chcę sobie zapamiętać szczególnie dobrze.

## RAG

Daj modelowi odpowiednią wiedzę **w kontekście**.

## Fine-tuning

Zmień zachowanie / specjalizację **samego modelu**.

Jeżeli zmienił się regulamin firmy:

w RAG mogę podmienić dokument.

Nie muszę trenować modelu od początku.

Dlatego w systemach wiedzy firmowej RAG ma bardzo dużo sensu.

---

# Multimodalność

Dzisiejszy model coraz rzadziej jest tylko modelem tekstowym.

Może dostać:

- tekst,
- screenshot,
- zdjęcie,
- PDF,
- audio,
- czasem wideo,

i pracować pomiędzy tymi modalnościami.

Dla mnie praktycznie oznacza to, że interfejsem do modelu przestaje być tylko prompt tekstowy.

Mogę mu pokazać:

```text
screenshot alertu
```

i zapytać:

> co tutaj wygląda podejrzanie?

Albo:

```text
diagram architektury
```

i poprosić:

> pokaż mi trust boundaries.

To zaczyna być dużo ciekawsze niż klasyczny chatbot.

---

# LRM - kiedy jedna odpowiedź przestaje wystarczać

Klasyczny LLM można sobie uprościć jako:

```text
prompt
↓
odpowiedź
```

Modele reasoningowe próbują poświęcić więcej obliczeń na rozwiązanie problemu.

Praktycznie oznacza to lepsze radzenie sobie z zadaniami, które wymagają:

- planowania,
- rozbijania problemu,
- analizy zależności,
- weryfikowania rozwiązania,
- pracy wieloetapowej.

Nie chcę jednak robić z tego magicznej granicy:

```text
LLM = głupi
LRM = myśli jak człowiek
```

To nadal model generatywny.

Po prostu dostaje mechanizmy i budżet obliczeniowy pozwalające wykonać znacznie więcej pracy przed finalną odpowiedzią.

---

# Najważniejszy przeskok: od odpowiedzi do działania

I tutaj kończy się spokojny świat chatbotów.

Chatbot odpowiada:

```text
Jak usunąć plik?
```

Agent może dostać:

```text
Usuń ten plik.
```

To jest fundamentalna różnica.

Pierwszy system daje informację.

Drugi wpływa na rzeczywistość.

---

# Agent

Najprostszy model agenta, który chcę sobie zostawić:

```text
CEL
 ↓
PLAN
 ↓
DZIAŁANIE
 ↓
OBSERWACJA
 ↓
czy cel został osiągnięty?
 ↓
NIE → kolejny krok
TAK → koniec
```

Agent nie musi więc wygenerować całego rozwiązania jedną odpowiedzią.

Może:

- zaplanować,
- użyć narzędzia,
- zobaczyć rezultat,
- zmienić plan,
- użyć kolejnego narzędzia,
- powtarzać pętlę.

I właśnie przez to możliwości rosną dramatycznie.

Ale powierzchnia ataku również.

---

# Tool - ręka modelu

Sam LLM nie otworzy strony.

Nie wyśle maila.

Nie wykona zapytania SQL.

Nie skasuje pliku.

Potrzebuje funkcji, którą system pozwoli mu wywołać.

To jest tool.

Przykładowo:

```text
search_web(query)

read_file(path)

send_email(to, body)

execute_sql(query)
```

Model podejmuje decyzję:

> potrzebuję użyć tego narzędzia.

Harness wykonuje operację.

Wynik wraca do modelu.

I model podejmuje następną decyzję.

---

# Harness - cała infrastruktura wokół modelu

To jedno z ważniejszych pojęć, bo pozwala przestać przypisywać modelowi rzeczy, których tak naprawdę nie robi sam.

Harness może odpowiadać za:

- dostęp do narzędzi,
- pamięć,
- instrukcje,
- permissions,
- wykonanie kodu,
- pętlę agentową,
- approval użytkownika,
- logowanie,
- retry,
- ograniczenia bezpieczeństwa.

Czyli:

```text
-
           ┌───────────┐
           │   MODEL   │
           └─────┬─────┘
                 │
        ┌────────▼────────┐
        │     HARNESS     │
        │                 │
        │ tools           │
        │ memory          │
        │ permissions     │
        │ agent loop      │
        │ approvals       │
        │ logs            │
        └────────┬────────┘
                 │
          rzeczywisty świat
```

Dlatego dwa produkty korzystające z podobnego modelu mogą zachowywać się kompletnie inaczej.

Model to tylko silnik.

Reszta samochodu też ma znaczenie.

---

# Skill

Skill traktuję jako gotową umiejętność, którą agent może wykorzystać.

Czyli zamiast za każdym razem od początku wymyślać:

> jak wykonać analizę X?

dostaje zapisaną procedurę.

Może ona zawierać:

- instrukcje,
- skrypty,
- kolejność kroków,
- sposób interpretacji wyniku.

To już zaczyna przypominać budowanie pracownika, który nie tylko „jest inteligentny”, ale również zna procedury organizacji.

---

# MCP

Model Context Protocol najlepiej traktować jako wspólny sposób podłączania AI do zewnętrznych systemów.

Bez wspólnego standardu każdy dostawca musiałby budować osobne integracje:

```text
AI ↔ GitHub
AI ↔ Jira
AI ↔ baza
AI ↔ filesystem
AI ↔ Slack
```

MCP próbuje ten problem ujednolicić.

I to jest ważne nie dlatego, że „MCP jest modne”.

Tylko dlatego, że wraz z agentami najważniejszym pytaniem przestaje być:

> co model wie?

a zaczyna być:

> **do czego model ma dostęp?**

Z perspektywy bezpieczeństwa jest to gigantyczna różnica.

---

# Modele zamknięte, open weights i open source

Te trzy rzeczy bardzo łatwo wrzucić do jednego worka.

Nie powinienem.

## Model zamknięty

Korzystam z usługi dostawcy.

Nie mam wag.

Nie kontroluję infrastruktury.

Dane mogą opuszczać moje środowisko w zależności od produktu, konfiguracji i umowy.

W zamian dostaję zwykle:

- bardzo dobry model,
- prostotę,
- brak utrzymania infrastruktury,
- gotowe narzędzia.

---

## Open weights

Mam dostęp do wag modelu.

Mogę często uruchomić go lokalnie.

Ale to nie oznacza automatycznie:

- otwartego procesu treningowego,
- otwartych danych treningowych,
- pełnej dowolności licencyjnej.

Dlatego:

**open weights ≠ automatycznie open source.**

---

## Open source

Tutaj interesuje mnie przede wszystkim transparentność:

- kod,
- licencja,
- możliwość analizy rozwiązania,
- możliwość modyfikacji.

Ale nawet tutaj zawsze trzeba przeczytać konkretną licencję.

Słowo „open” nie zwalnia z myślenia.

---

# Model lokalny - nie dlatego, że jest fajny

Uruchomienie modelu lokalnie daje bardzo ciekawą właściwość:

**mogę kontrolować ścieżkę danych.**

Jeżeli cały pipeline rzeczywiście działa lokalnie:

```text
dokument
↓
lokalny embedding
↓
lokalna baza
↓
lokalny LLM
↓
odpowiedź
```

to dane nie muszą opuszczać mojego środowiska.

Ale lokalność nie rozwiązuje automatycznie wszystkich problemów.

Nadal zostają:

- uprawnienia,
- bezpieczeństwo hosta,
- supply chain,
- podatności bibliotek,
- bezpieczeństwo interfejsu,
- prompt injection,
- dane wejściowe,
- błędne odpowiedzi.

**Local nie znaczy secure.
Local przede wszystkim daje kontrolę nad infrastrukturą i przepływem danych.**

---

# Halucynacja - czyli model brzmi lepiej, niż wie

To chyba najbardziej zdradliwa właściwość LLM.

Model może nie wiedzieć.

Ale interfejs nie wygląda wtedy tak:

```text
ERROR 404: KNOWLEDGE NOT FOUND
```

Dostaję normalny, pięknie napisany tekst.

Problemem nie jest więc tylko możliwość błędu.

Problemem jest:

**błąd podany w bardzo przekonującej formie.**

Dlatego w pracy z AI powinienem oddzielać dwie rzeczy:

```text
jakość tekstu
```

od:

```text
wiarygodność informacji
```

One nie są tym samym.

---

# Największy paradoks AI

Im lepsze stają się modele, tym łatwiej im zaufać.

I właśnie wtedy koszt złego zaufania rośnie.

Słaby chatbot:

- pisze dziwnie,
- myli się,
- człowiek od razu go kontroluje.

Dobry agent:

- pisze świetnie,
- pamięta kontekst,
- używa narzędzi,
- sam planuje,
- 49 razy wykonuje zadanie poprawnie.

I przy pięćdziesiątym razie człowiek już nie patrzy.

To jest **automation bias**.

I prawdopodobnie będzie jednym z ważniejszych problemów praktycznego wdrażania agentów.

---

# Human in the Loop

Najprostszy wariant:

```text
AI proponuje działanie
        ↓
człowiek zatwierdza
        ↓
system wykonuje
```

Przykład:

```text
Usuń plik cache.tmp?

[TAK] [NIE]
```

To wygląda banalnie.

Ale daje bardzo ważną granicę:

**model może zaproponować operację, ale nie może sam przekroczyć punktu nieodwracalnego.**

Szczególnie ważne przy:

- usuwaniu,
- wysyłaniu,
- publikowaniu,
- zmianach konfiguracji,
- przelewach,
- zmianach uprawnień,
- działaniach na produkcji.

---

# Problem: „Yes, and remember”

Human in the Loop ma jednak słabość.

Człowiek.

Jeżeli agent pyta mnie 40 razy dziennie:

```text
Czy pozwalasz?
Czy pozwalasz?
Czy pozwalasz?
Czy pozwalasz?
```

to przestaję analizować pytanie.

Zaczynam klikać.

A gdy system zaproponuje:

```text
Allow always
```

pojawia się ogromna pokusa.

I właśnie wtedy mechanizm bezpieczeństwa może zostać formalnie zachowany, ale praktycznie wyłączony.

To bardzo przypomina klasyczne warning fatigue.

**Approval, którego użytkownik już nie czyta, przestaje być kontrolą bezpieczeństwa.**

---

# Human on the Loop

Drugi model wygląda inaczej.

AI działa samodzielnie.

Człowiek obserwuje:

- logi,
- metryki,
- alerty,
- anomalie.

I ma możliwość przerwania działania.

Czyli:

```text
-
          AGENT
       ↙    ↓    ↘
    akcja akcja akcja
          ↓
        logi
          ↓
       CZŁOWIEK
          ↓
      KILL SWITCH
```

To może mieć sens tam, gdzie liczba operacji jest tak duża, że ręczne zatwierdzanie każdej z nich zabiłoby cały sens automatyzacji.

---

# Pełna autonomia

I w końcu:

```text
AI
↓
decyzja
↓
akcja
```

bez człowieka.

Technicznie możemy to zrobić już dzisiaj.

To nie oznacza, że powinniśmy.

Prawdziwe pytanie brzmi:

**co się stanie, kiedy model się pomyli?**

Nie:

> czy model się pomyli?

Tylko:

> kiedy się pomyli.

---

# Najlepszy model decyzyjny: koszt błędu × możliwość weryfikacji

To jest chyba najbardziej praktyczna rzecz z całego tematu.

Mam dwie osie:

```text
-
                 ŁATWO SPRAWDZIĆ
                       ↑
                       |
                       |
NISKI KOSZT -----------+----------- WYSOKI KOSZT
BŁĘDU                  |             BŁĘDU
                       |
                       |
                       ↓
                TRUDNO SPRAWDZIĆ
```

I teraz zaczyna być ciekawie.

## Niski koszt błędu + łatwo sprawdzić

Świetne miejsce na automatyzację.

Na przykład:

- tagowanie,
- transkrypcja,
- szkice maili,
- ekstrakcja prostych danych,
- formatowanie,
- klasyfikacja dokumentów.

Model się pomyli?

Poprawiam.

Świat się nie kończy.

---

## Niski koszt błędu + trudno sprawdzić

AI może pomagać.

Ale niekoniecznie chcę od razu budować autonomicznego agenta.

Tu często lepszy jest model:

```text
człowiek
   +
AI jako copilot
```

---

## Wysoki koszt błędu + łatwo sprawdzić

To robi się bardzo interesujące.

AI może wykonać ogromną część pracy.

Ale wynik powinien przejść kontrolę.

Przykład:

```text
AI przygotowuje
↓
walidacja
↓
człowiek / drugi system
↓
wykonanie
```

Tu mogą mieć ogromny sens agenci z kontrolą i dobrze zaprojektowaną pętlą weryfikacji.

---

## Wysoki koszt błędu + trudno sprawdzić

I tutaj zapala mi się czerwone światło.

Jeżeli:

- pomyłka dużo kosztuje,
- a jednocześnie nie potrafię łatwo wykryć, że model się pomylił,

to przekazanie mu autonomii jest fatalnym pomysłem.

Szczególnie przy decyzjach dotyczących:

- zdrowia,
- prawa,
- finansów,
- bezpieczeństwa,
- krytycznych danych,
- ludzi.

---

# Nie automatyzuj bałaganu

To zdanie warto zostawić osobno.

Jeżeli proces jest źle zdefiniowany:

```text
człowiek robi chaos
```

po dodaniu AI dostaję:

```text
AI robi chaos szybciej
```

Automatyzacja nie naprawia procesu.

Skaluje proces.

Jeżeli więc przed wdrożeniem agenta nikt nie potrafi odpowiedzieć:

- jaki jest cel procesu,
- jakie są wejścia,
- jakie są wyjątki,
- kto odpowiada,
- jak wygląda poprawny wynik,
- kiedy operację przerwać,

to prawdopodobnie nie mamy jeszcze problemu AI.

Mamy problem organizacyjny.

---

# Explainable AI - ostrożnie ze słowem „dlaczego”

To jest bardzo zdradliwy temat.

Mogę zapytać model:

> dlaczego podjąłeś taką decyzję?

I dostanę świetne wyjaśnienie.

Ale trzeba pamiętać:

**to wyjaśnienie również jest wygenerowanym tekstem.**

Nie należy automatycznie traktować go jako wiernego dumpa rzeczywistego procesu zachodzącego wewnątrz modelu.

Dlatego w systemach, w których decyzja naprawdę ma znaczenie, bardziej ufam:

- źródłom,
- logom,
- wykonanym tool callom,
- wykorzystanym dokumentom,
- parametrom wejścia,
- audytowalnemu pipeline'owi,

niż pięknemu akapitowi zaczynającemu się od:

> Podjąłem tę decyzję, ponieważ...

---

# Gdzie AI już naprawdę ma sens

Nie wszędzie potrzebuję autonomicznego agenta.

AI jest już bardzo użyteczne jako warstwa wspomagająca.

Dobre przykłady:

## Back office

- dokumenty,
- mail,
- kalendarze,
- klasyfikacja,
- ekstrakcja,
- wyszukiwanie wiedzy.

## Programowanie

- szkielety kodu,
- analiza istniejącego projektu,
- refactoring,
- testy,
- dokumentacja,
- szukanie błędów.

## Cybersecurity

- analiza logów,
- klasyfikacja alertów,
- analiza kodu,
- tworzenie hipotez,
- research,
- przetwarzanie dużej ilości danych.

Ale tu szczególnie łatwo wejść w pułapkę:

**model nie zastępuje rozumienia systemu.**

Jeśli podatność wymaga zrozumienia:

- logiki biznesowej,
- relacji między obiektami,
- praw użytkownika,
- stanu aplikacji,

sam model może mieć znacznie większy problem niż przy klasycznej analizie wzorca.

---

# AI w cyberbezpieczeństwie - jak chcę na to patrzeć

Nie jako:

> AI zrobi pentest.

Tylko:

```text
człowiek
↓
stawia hipotezę
↓
AI pomaga przetworzyć dane
↓
człowiek ocenia wynik
↓
kolejna hipoteza
```

AI jest świetne jako mnożnik.

Ale:

**jeżeli mnożę przez zero wiedzy domenowej, nadal zostaje zero.**

Pentester nadal musi wiedzieć:

- czego szuka,
- dlaczego to jest podejrzane,
- jakie zachowanie jest normalne,
- jaki test ma sens,
- kiedy wynik jest false positive.

Model może bardzo przyspieszyć drogę.

Nie powinien wybierać celu za mnie tylko dlatego, że brzmi pewnie.

---

# Co zmieni się na rynku pracy

Nie najbardziej interesuje mnie pytanie:

> czy AI zabierze ludziom pracę?

To jest za szerokie.

Znacznie ciekawsze jest:

> **które elementy pracy człowieka przestają mieć wartość, a które stają się jeszcze ważniejsze?**

Pierwsze pod presją są zadania:

- przepisywanie danych,
- powtarzalne raporty,
- pierwsze szkice,
- proste tłumaczenia,
- pierwsza linia prostego supportu,
- umawianie spotkań.

Czyli wszystko, co można opisać mniej więcej jako:

```text
weź dane A
↓
wykonaj powtarzalną transformację
↓
zwróć B
```

Dużo ciekawsze stają się za to:

- weryfikacja rezultatu,
- odpowiedzialność,
- podejmowanie decyzji,
- rozmowa z człowiekiem,
- projektowanie systemów,
- bezpieczeństwo,
- jakość danych,
- integracja wielu źródeł.

Materiały wskazują również role wyrastające bezpośrednio wokół AI: AI governance, AI red teaming, operatorzy agentów czy właściciele firmowych baz wiedzy. prez-1

To prowadzi mnie do prostego wniosku.

**Wartość człowieka przesuwa się z produkowania pierwszego wyniku w stronę rozumienia, czy ten wynik ma sens.**

---

# Najbardziej wartościowa kompetencja nie nazywa się prompting

Prompting jest przydatny.

Ale jeżeli modele dalej będą się poprawiały, sama sztuka pisania idealnego prompta będzie coraz mniej wyjątkowa.

Dużo ważniejsze staje się:

## Context engineering

Czyli:

> co model powinien wiedzieć dokładnie w momencie wykonywania zadania?

To oznacza kontrolę nad:

- źródłami,
- historią,
- pamięcią,
- instrukcjami,
- dokumentami,
- narzędziami,
- uprawnieniami.

Dobry model ze złym kontekstem może dać złą odpowiedź.

Przeciętny model z dobrym kontekstem może być zaskakująco skuteczny.

---

# Jak wybierać AI do zadania

Nie chcę zaczynać od:

> który model jest teraz najlepszy?

Najpierw:

> co właściwie próbuję zrobić?

Pytania:

### Czy dane mogą opuścić urządzenie?

Jeśli nie:

→ model lokalny zaczyna mieć sens.

### Potrzebuję najnowszej wiedzy?

Jeśli tak:

→ model potrzebuje wyszukiwania albo dostępu do źródeł.

### Pracuję na dokumentach firmowych?

→ RAG / konektory / kontrolowany kontekst.

### Potrzebuję tylko odpowiedzi?

→ chatbot może wystarczyć.

### Potrzebuję wykonywania operacji?

→ agent + tools.

### Operacje są nieodwracalne?

→ approval / HITL.

### Koszt błędu jest duży?

→ dodatkowa walidacja.

Dopiero później interesuje mnie nazwa modelu.

---

# Jak patrzę na bezpieczeństwo agentów

Klasyczny LLM ma przede wszystkim dane.

Agent dostaje możliwości.

A więc model zagrożeń zmienia się z:

```text
czy model wygeneruje coś złego?
```

na:

```text
czy model zrobi coś złego?
```

To jest znacznie poważniejszy problem.

Dlatego interesuje mnie:

- do jakich narzędzi ma dostęp,
- z jakimi uprawnieniami,
- jakie dane może odczytać,
- gdzie może pisać,
- co może usunąć,
- czy może wykonywać kod,
- czy działania są logowane,
- gdzie wymagany jest approval,
- czy istnieje kill switch.

Najważniejsza granica bezpieczeństwa agenta bardzo często nie znajduje się więc **w modelu**.

Znajduje się w **harnessie**.

---

# Zasada najmniejszych uprawnień wraca kolejny raz

Agent powinien dostać dokładnie tyle możliwości, ile potrzebuje.

Nie:

```text
agent do kalendarza
→ pełny dostęp do całego Google Workspace
```

tylko:

```text
agent do kalendarza
→ odczyt kalendarza
→ tworzenie wydarzeń
```

Jeżeli nie musi usuwać:

nie daję DELETE.

Jeżeli nie musi wysyłać:

nie daję SEND.

Jeżeli wystarczy READ:

nie daję WRITE.

AI nie wymyśliło tutaj nowego bezpieczeństwa.

Wracamy do starego dobrego:

**least privilege.**

---

# Co chcę sprawdzać jako security analyst / pentester

Przy systemie wykorzystującym AI nie interesuje mnie tylko sam prompt.

Chcę zobaczyć cały pipeline.

## 1. Jakie dane trafiają do modelu

- dokumenty,
- PII,
- tajemnice przedsiębiorstwa,
- credentiale,
- logi,
- dane klientów.

## 2. Dokąd te dane trafiają

- SaaS,
- API,
- lokalny model,
- zewnętrzny provider.

## 3. Co znajduje się w kontekście

Czy użytkownik może wpłynąć na instrukcje lub dokumenty wykorzystywane później przez model?

## 4. Jakie tools posiada agent

To często dużo ważniejsze niż sam model.

## 5. Jakie permissions posiadają tools

Czy agent naprawdę potrzebuje pełnego RW?

## 6. Co wymaga approval

Szczególnie operacje nieodwracalne.

## 7. Jak działa logging

Muszę wiedzieć:

```text
co model dostał
→ co zdecydował
→ którego toola wywołał
→ z jakimi parametrami
→ jaki był rezultat
```

## 8. Czy istnieje kill switch

Bo agent, którego nie potrafię szybko zatrzymać, jest fatalnym agentem produkcyjnym.

---

# Co chcę budować jako developer / architekt

## 1. Model nie może być całym zabezpieczeniem

Nie chcę security typu:

> napisaliśmy w system prompt, żeby tego nie robił.

Prompt nie zastępuje kontroli dostępu.

---

## 2. Uprawnienia egzekwuję poza modelem

Jeżeli użytkownik nie może odczytać dokumentu:

model też nie powinien dostać tego dokumentu.

Nie pytam LLM:

> czy ten użytkownik może zobaczyć plik?

To powinien wiedzieć system.

---

## 3. Źródła oddzielam od wygenerowanego tekstu

Jeżeli odpowiedź ma być użyta do podjęcia ważnej decyzji:

chcę wiedzieć, skąd pochodzi.

---

## 4. Operacje nieodwracalne wymagają silniejszej kontroli

DELETE, SEND, DEPLOY, PAY, GRANT.

To zupełnie inna liga niż READ.

---

## 5. Wszystko loguję

Agent bez audytu jest czarną skrzynką podłączoną do infrastruktury.

To brzmi źle, bo takie jest.

---

## 6. Projektuję pod błąd

Nie zakładam:

> model będzie poprawny.

Zakładam:

> model w końcu zrobi coś dziwnego.

I projektuję system tak, żeby pojedyncza zła decyzja nie kończyła gry.

---

# Szybka ściąga - 20 pojęć

**AI**
najszersza kategoria systemów wykonujących zadania kojarzone z inteligencją.

**ML**
uczenie wzorców z danych.

**DL**
uczenie maszynowe oparte na wielowarstwowych sieciach neuronowych.

**NLP**
przetwarzanie języka naturalnego.

**GenAI**
AI generująca nowe treści.

**LLM**
duży model językowy przewidujący kolejne tokeny.

**LRM**
model wykorzystujący dodatkowe rozumowanie przed odpowiedzią.

**Token**
fragment wejścia/wyjścia modelu.

**Prompt**
polecenie i dane przekazane modelowi.

**Kontekst**
wszystko, co model aktualnie widzi.

**Embedding**
numeryczna reprezentacja znaczenia.

**Chunk**
fragment większego dokumentu.

**RAG**
najpierw wyszukaj odpowiednie dane, potem wygeneruj odpowiedź.

**Multimodalność**
praca na więcej niż jednym rodzaju danych.

**Halucynacja**
wiarygodnie brzmiąca odpowiedź niepoparta rzeczywistością.

**Agent**
model działający iteracyjnie i korzystający z narzędzi.

**Tool**
funkcja, którą model może wywołać.

**Skill**
gotowa procedura dostępna agentowi.

**Harness**
system otaczający model i umożliwiający mu działanie.

**MCP**
standard podłączania systemów i narzędzi do AI.

---

# Najważniejsze pułapki

- traktowanie płynnego języka jako dowodu wiedzy,
- ślepe zaufanie do wygenerowanych wyjaśnień,
- wrzucanie poufnych danych do przypadkowych usług,
- automatyzowanie procesu, który wcześniej był źle zdefiniowany,
- dawanie agentom za szerokich uprawnień,
- permanentne zatwierdzanie operacji bez czytania,
- brak logowania działań agenta,
- brak kill switcha,
- traktowanie RAG jako rozwiązania wszystkich halucynacji,
- mylenie dużego okna kontekstu z doskonałą pamięcią,
- mylenie open weights z open source,
- wybieranie modelu przed zdefiniowaniem problemu.

---

# Dobre praktyki

- najpierw określić koszt błędu,
- ustalić, czy wynik można łatwo zweryfikować,
- dawać modelowi tylko potrzebny kontekst,
- używać RAG, gdy odpowiedź ma pochodzić z konkretnych dokumentów,
- ograniczać tools zgodnie z least privilege,
- wymagać approval dla operacji wysokiego ryzyka,
- zachować człowieka w procesie tam, gdzie odpowiedzialność ma znaczenie,
- logować tool calle i operacje,
- posiadać kill switch,
- oddzielać zdolność modelu od bezpieczeństwa całego systemu,
- traktować AI jako komponent architektury, a nie magiczną czarną skrzynkę.

---

# Mój skrót myślowy

Kiedyś najważniejszym pytaniem było:

> co model potrafi odpowiedzieć?

Przy agentach ważniejsze zaczyna być:

> **co model może zrobić?**

I to zmienia praktycznie wszystko.

LLM sam w sobie może wygenerować zły tekst.

Agent podłączony do poczty, filesystemu, GitHuba, terminala i infrastruktury może zamienić złą odpowiedź w realną akcję.

Dlatego wraz ze wzrostem możliwości modelu musi rosnąć jakość:

- kontekstu,
- kontroli dostępu,
- obserwowalności,
- walidacji,
- nadzoru człowieka.

To nie jest już tylko prompt engineering.

To zaczyna być normalna inżynieria systemów.

---

# Jedno zdanie, które chcę sobie zostawić

**AI staje się naprawdę potężne nie wtedy, kiedy model wie więcej, tylko wtedy, kiedy dostaje dobry kontekst, narzędzia i możliwość działania — i właśnie dlatego te same elementy, które zwiększają jego użyteczność, zwiększają też ryzyko.**
