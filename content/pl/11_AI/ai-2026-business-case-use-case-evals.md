---
id: ai-2026-business-case-use-case-evals
title: "Od pomysłu do business case'u AI - proces, wartość, ryzyko i weryfikacja"
team: red-blue
domain: artificial-intelligence
section: ai-engineering
type: knowledge
angle: business-case-and-evaluation
sourceTrack: narzedziownik-ai
tags:
[
  "ai",
  "business-case",
  "ai-adoption",
  "ai-maturity",
  "shadow-ai",
  "process-mapping",
  "use-case-canvas",
  "roi",
  "tco",
  "kpi",
  "poc",
  "evals",
  "promptfoo",
  "risk-management",
  "human-in-the-loop"
]
difficulty: medium
shortDescription: "Praktyczny model przechodzenia od pomysłu na AI do uzasadnionego wdrożenia: dojrzałość organizacji, mapowanie procesów, AI Use-Case Canvas, wybór technologii, rzeczywisty koszt posiadania, ROI, KPI, testy PoC, evals i decyzja go/poprawka/stop."
updatedAt: "2026-10-08"
---

# Od pomysłu do business case'u AI - proces, wartość, ryzyko i weryfikacja

# Dlaczego jest to dla mnie ważne

Łatwo jest dziś powiedzieć: "wdrażamy AI". Jeszcze łatwiej uruchomić chatbota, dać zespołowi licencje, podłączyć API i nazwać to transformacją. Tylko co właściwie się zmieniło?

Czy klient szybciej otrzymuje odpowiedź? Czy analityk obsługuje więcej spraw bez wzrostu liczby błędów? Czy organizacja wydaje mniej, jeśli wliczy się także czas ludzi sprawdzających odpowiedzi? A może po prostu przesunęliśmy pracę z jednego miejsca w drugie?

Najważniejsza zasada, od której chcę zaczynać każdy taki projekt, jest prosta:

> **AI nie jest celem projektu. Celem jest rozwiązanie konkretnego problemu, którego skutki można zmierzyć.**

Ten temat interesuje mnie szczególnie z perspektywy inżynierii, automatyzacji i zarządzania ryzykiem ICT. System, który wygląda imponująco na demonstracji, nie musi przynosić wartości na produkcji. A narzędzie, które oszczędza pięć minut jednemu pracownikowi, niekoniecznie oszczędza pięć minut organizacji.

Chcę myśleć o wdrożeniach AI tak, jak o innych zmianach technicznych: najpierw stan obecny, hipoteza, pomiar i ryzyka, dopiero potem implementacja.

```text
POMYSŁ NA AI
    ↓
JAKI PROBLEM ROZWIĄZUJEMY?
    ↓
JAK WYGLĄDA PROCES DZISIAJ?
    ↓
CO REALNIE MOŻNA ZMIENIĆ?
    ↓
JAK ZMIERZYMY SUKCES I BŁĄD?
    ↓
CZY KORZYŚĆ PRZEWYŻSZA PEŁNY KOSZT?
    ↓
PoC → PILOTAŻ → DECYZJA O PRODUKCJI
```

---

# Największy paradoks: AI jest wszędzie, ale wynik biznesowy niekoniecznie

Najbardziej mylące w firmowym podejściu do AI jest to, że popularność narzędzi rośnie znacznie szybciej niż mierzalny efekt ekonomiczny.

Dobrze pokazują to różne badania dotyczące korzystania z AI i jego efektów:

| Co mierzymy                                 | Wynik |
| ------------------------------------------- | ----: |
| Firmy aktywnie używające AI                 |   69% |
| Osoby widzące poprawę swojej produktywności |   80% |
| Firmy widzące dodatni wpływ AI na EBIT      |   37% |
| Firmy przypisujące AI co najmniej 5% EBIT   |    6% |

**Ważne:** nie są to kolejne fazy jednego badania ani odsetki, które należy od siebie odejmować. Pochodzą z różnych pomiarów i oznaczają różne rzeczy.

Mental model:

```text
"Korzystamy z AI"            ≠ "proces działa szybciej"
"Proces działa szybciej"     ≠ "firma oszczędza pieniądze"
"Firma oszczędza czas"       ≠ "firma zwiększa zysk"
"Pracownik czuje poprawę"    ≠ "pomiar pokazuje poprawę"
```

Badanie przedsiębiorstw wskazuje, że 89% respondentów nie widziało wpływu AI na produktywność firmy w minionych trzech latach, a ponad 90% nie zauważyło wpływu na zatrudnienie. Nie oznacza to, że AI nie działa. Oznacza, że **trzeba odróżnić subiektywne doświadczenie pojedynczego użytkownika od wyniku całego procesu**.

## Pułapka: workslop

_Workslop_ to ładnie wyglądający wynik AI, którego użyteczność jest na tyle mała, że ktoś inny musi go poprawić. W jednym z badań odnotowano, że 40% badanych pracowników otrzymało taki materiał, a naprawa pojedynczego przypadku zajmowała średnio 1 godzinę 56 minut.

```text
Pracownik A
  ↓
AI produkuje "gotowy" dokument w 2 minuty
  ↓
Pracownik B sprawdza, poprawia i rekonstruuje fakty
  ↓
90 minut pracy
  ↓
DLA A: sukces
DLA PROCESU: potencjalna strata
```

To samo dotyczy programowania. W badaniu METR doświadczeni developerzy w badanym zestawie zadań byli z AI o 19% wolniejsi, choć spodziewali się przyspieszenia o 20%. To wynik konkretnego badania i jego warunków, nie uniwersalny parametr wszystkich narzędzi codingowych.

**Wniosek:** nie pytam wyłącznie "czy AI pomaga?". Mierzę cały proces przed i po, uwzględniając koszt kontroli oraz poprawek.

---

# Dlaczego pilotaż AI tak często nie staje się produkcją

Łatwo pokazać demo. Znacznie trudniej obsłużyć codzienną pracę, nieuporządkowane dane, błędy, uprawnienia, limity i koszty.

Najczęściej powtarzają się następujące powody niepowodzeń:

1. **Brak wartości biznesowej** - "wdrażamy AI" nie definiuje problemu, punktu wyjścia ani miernika sukcesu.
2. **Słabe lub niedostępne dane** - dokumenty są rozproszone, nieaktualne albo nie można ich legalnie i organizacyjnie użyć.
3. **Rosnący koszt całkowity** - tokeny to tylko fragment; pozostają integracja, przegląd, utrzymanie i szkolenia.
4. **Brak kontroli ryzyka** - nikt nie wie, kto zatwierdza wynik i kto reaguje na błędy.
5. **Brak procesu poprawy** - agent nie zna aktualnego kontekstu lub powtarza błędy, bo nie ma testów i informacji zwrotnej.

```text
DEMO:
  10 przykładowych przypadków
  dobry prompt
  czyste dane
  operator obok
        ↓
  "Działa!"

PRODUKCJA:
  rzeczywiste wyjątki
  dane osobowe i uprawnienia
  awarie API / timeouty
  zmiany regulaminu
  koszt powtarzanych zapytań
  odpowiedzialność za wynik
        ↓
  "Czy nadal działa?"
```

Prognozę Gartnera, że ponad 40% projektów agentowych zostanie anulowanych do końca 2027 r., trzeba traktować jako **prognozę**, a nie zdarzenie, które już nastąpiło. Podobnie wartości dotyczące odrzuconych projektów PoC należy czytać w kontekście daty i zakresu konkretnego badania.

---

# Dojrzałość organizacji: licencja nie jest strategią

Praktyczną drogę organizacji można rozpisać na pięć etapów:

```text
ETAP 0             ETAP 1           ETAP 2
SHADOW AI       →   LICENCJE     →   ASYSTENCI ZESPOŁOWI
prywatne konta      polityki          wspólne prompty
brak widoczności     klasy danych      projekty, baza wiedzy

       ↓
ETAP 3                         ETAP 4
PROCESY Z AI               →   AGENCI Z NADZOREM
integracja z systemami         automatyzacja wielu działań
właściciel i pomiar           uprawnienia, logowanie, bramki
```

**Shadow AI** to korzystanie z narzędzi bez formalnego zarządzania przez organizację. Z punktu widzenia security istotny jest nie tylko fakt, że ludzie używają AI, lecz przede wszystkim **jakie dane wysyłają, na jakich kontach, komu i na jakich warunkach**.

Właśnie dlatego zakup licencji bez klasyfikacji danych nie rozwiązuje problemu.

## Druga perspektywa: pięć poziomów Gartnera

W modelu dojrzałości Gartnera wyróżniam następujące poziomy: **Świadomość → Aktywność → Operacje → System → Transformacja**. Zmiana poziomu wymaga rozwoju trzech filarów:

| Ludzie                                            | Technologia                         | Proces                                                       |
| ------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| AI literacy, szkolenia stanowiskowe, menedżerowie | dane, integracje, MLOps, monitoring | polityki, odpowiedzialność, bezpieczeństwo, przebudowa pracy |

Najczęstszy antywzorzec:

```text
TECHNOLOGIA  ██████████  poziom 4
LUDZIE       ███         poziom 1
PROCES       ██          poziom 1

=> System może być nowoczesny,
   ale organizacja nie umie nim zarządzać.
```

## Mój szybki test dojrzałości

Żeby szybko ocenić, na czym stoimy, zadaję sobie osiem pytań:

- [ ] Mamy listę dopuszczonych narzędzi AI i klas danych.
- [ ] Pracownicy używają kont firmowych zamiast prywatnych.
- [ ] Przynajmniej jeden proces ma zmierzony koszt i czas przed AI.
- [ ] Każde wdrożenie ma właściciela procesu.
- [ ] Prompty i instrukcje są wspólne oraz wersjonowane.
- [ ] Mamy przypadki testowe choćby dla jednego zadania AI.
- [ ] Koszty AI można rozdzielić pomiędzy procesy.
- [ ] Przynajmniej jedno wdrożenie działa na produkcji ponad rok.

Praktyczna interpretacja: **0–2 "tak"** = eksperymenty, **3–5** = pilotaże, **6–8** = gotowość do bardziej zintegrowanych procesów. To szybkie narzędzie orientacyjne, a nie formalny audyt dojrzałości.

---

# Najpierw mapa procesu AS-IS, później pomysł na AI

Tu zaczyna się właściwa praca inżynierska. Jeżeli nie wiem, gdzie faktycznie powstaje opóźnienie, mogę zoptymalizować czynność, która nie ma znaczenia dla całości.

W mapie procesu rozdzielam dwa czasy:

- **Touch time** - ile minut ktoś realnie pracuje nad sprawą.
- **Lead time** - ile czasu mija od początku do końca, wraz z kolejkami i czekaniem.

Weźmy proces obsługi reklamacji:

```text
KLIENT WYSYŁA REKLAMACJĘ
          ↓
  Rejestracja zgłoszenia
          ↓
  CZEKA NA PRZYDZIAŁ      ← kolejka
          ↓
  Odczyt wiadomości
          ↓
  Szukanie zamówienia i regulaminu
          ↓
  Decyzja i przygotowanie odpowiedzi
          ↓
  AKCEPTACJA CZŁOWIEKA
          ↓
  Wysłanie do klienta
```

Załóżmy na potrzeby obliczeń: **12 minut aktywnej pracy i 72 godziny oczekiwania przy 1200 sprawach miesięcznie**.

Jeżeli AI zmniejszy czas pracy z 12 do 6 minut, ale zgłoszenie nadal przez trzy dni czeka na przypisanie, doświadczenie klienta może prawie się nie zmienić. Dlatego po pomiarze AS-IS projektuję **TO-BE**: co usuwamy, co upraszczamy, co zlecamy AI i gdzie człowiek podejmuje decyzję.

```text
AS-IS → ZMIERZ WĄSKIE GARDŁO
                ↓
       USUŃ ZBĘDNY KROK
                ↓
       SPRAWDŹ ZWYKŁĄ AUTOMATYZACJĘ
                ↓
       DOPIERO WTEDY TESTUJ AI
                ↓
TO-BE → PORÓWNAJ WYNIK
```

> Nie każda automatyzacja potrzebuje LLM. Dobrze zaprojektowany formularz, reguła lub integracja może być tańsza, przewidywalniejsza i bezpieczniejsza.

---

# AI Use-Case Canvas: dziewięć pytań zamiast "fajnego pomysłu"

AI Use-Case Canvas pozwala opisać wdrożenie językiem procesu, danych, nadzoru i liczb. **Technologia pojawia się dopiero w polu 8**.

Dziewięć pól, które warto wypełnić:

| Pole                     | Pytanie, na które odpowiadam                           |
| ------------------------ | ------------------------------------------------------ |
| 1. Problem               | Co dokładnie boli, jaki jest wolumen i punkt wyjścia?  |
| 2. Właściciel / odbiorca | Kto odpowiada za proces i kto skorzysta na zmianie?    |
| 3. Zadanie AI            | Jaką konkretną czynność ma wykonać AI?                 |
| 4. Dane                  | Z jakich systemów pochodzą dane i jaką mają klasę?     |
| 5. Człowiek              | Kto przegląda, zatwierdza lub eskaluje wynik?          |
| 6. Ryzyko                | Jakie są konsekwencje i koszt błędnej odpowiedzi?      |
| 7. KPI                   | Jaki wynik i wskaźnik strażnik mierzymy?               |
| 8. Wariant rozwiązania   | Bez AI, gotowe narzędzie, SaaS, API czy lokalny model? |
| 9. Hipoteza              | Jaki próg i termin umożliwią decyzję go/stop?          |

## Jak wygląda różnica jakości

**Źle:** "AI będzie obsługiwać reklamacje".

**Lepiej:** "Na podstawie maila, danych zamówienia i regulaminu przygotuj projekt decyzji i szkic odpowiedzi z cytatem odpowiedniego punktu; konsultant zatwierdza każdą odpowiedź".

**Źle:** "Mamy dużo danych".

**Lepiej:** "Wiadomości w skrzynce reklamacyjnej, CRM i PDF z regulaminem; w danych występują informacje osobowe".

**Źle:** "Zwiększymy efektywność".

**Lepiej:** "W 90 dni skrócimy czas odpowiedzi z 72 do 24 godzin, utrzymując ponowne kontakty na poziomie nie większym niż 10%".

Dobra kanwa jest krótka. Jeśli do jednego pola potrzebuję strony wyjaśnienia, prawdopodobnie próbuję objąć zbyt szeroki problem.

## Hipoteza musi dać się obalić

```text
SŁABO:
"AI usprawni pracę działu."

DOBRZE:
"W ciągu 30 dni, na próbie 200 spraw,
co najmniej 80% szkiców zostanie
zaakceptowanych bez przepisywania,
a aktywny czas pracy spadnie z 12 do 6 minut."

GO:    >= 80% zaakceptowanych szkiców,
       zero błędnych obietnic.
STOP:  < 60% po dwóch tygodniach.
```

To przykładowe progi służące pokazaniu mechanizmu, a nie wymagania dla każdego projektu. Próg ustawiam **przed startem**, inaczej będę dopasowywał kryteria do uzyskanych wyników.

---

# Który use case wybrać jako pierwszy?

Najbardziej widowiskowy projekt rzadko musi być najlepszym pierwszym projektem. Duży chatbot publiczny jest efektowny, ale prosta klasyfikacja zgłoszeń może dać szybciej mierzalny efekt.

Do wstępnego ustalania priorytetów mogę użyć prostego scoringu:

\[
S = \frac{W \times C \times D}{R}
\]

Gdzie (każdy parametr w skali 1–5):

- **W** - wartość biznesowa;
- **C** - częstotliwość występowania zadania;
- **D** - dostępność i jakość danych;
- **R** - ryzyko i trudność.

```python
def score(wartosc: int, czestotliwosc: int,
          dane: int, ryzyko: int):
    if dane == 1 or ryzyko == 5:
        return "BRAMKA: nie teraz"
    return round(wartosc * czestotliwosc * dane / ryzyko, 1)

print(score(4, 5, 5, 2))  # 50.0
print(score(4, 5, 3, 5))  # BRAMKA: nie teraz
```

Przykładowa ocena czterech pomysłów:

| Pomysł                         |   W |   C |   D |   R |  Wynik |
| ------------------------------ | --: | --: | --: | --: | -----: |
| Klasyfikacja zgłoszeń          |   4 |   5 |   5 |   2 |   50,0 |
| Szkic odpowiedzi reklamacyjnej |   4 |   4 |   4 |   2 |   32,0 |
| Wyszukiwarka procedur          |   3 |   5 |   3 |   2 |   22,5 |
| Chatbot bez nadzoru            |   4 |   5 |   3 |   5 | Bramka |

To **narzędzie do rozmowy o założeniach**, nie naukowy wzór na wartość biznesową. Oceny powinny pochodzić od kilku ról: biznesu, IT, bezpieczeństwa i - gdy trzeba - prawników.

W osobnym wierszu zawsze umieszczam **wariant bez AI**.

---

# Buy, build, SaaS, API, lokalny model - albo nic

Przed wyborem modelu stawiam pytanie: jak mało technologii wystarczy do rozwiązania problemu?

```text
Czy problem da się usunąć zmianą procesu?
  ├── TAK → zmień proces
  └── NIE
        ↓
Czy wystarczy reguła / skrypt / SQL / formularz?
  ├── TAK → użyj deterministycznej automatyzacji
  └── NIE
        ↓
Czy istnieje zatwierdzone rozwiązanie firmowe?
  ├── TAK → oceń i użyj istniejącego rozwiązania
  └── NIE
        ↓
SaaS / API / model lokalny / własny system
        ↓
porównaj: dane + jakość + kontrola + TCO
```

## Mój mental model wariantów

| Podejście           | Co zyskuję                        | Co muszę kontrolować                                    |
| ------------------- | --------------------------------- | ------------------------------------------------------- |
| Bez AI / reguły     | Przewidywalność, niski koszt      | Utrzymanie reguł, pokrycie wyjątków                     |
| Gotowy SaaS         | Krótki czas uruchomienia          | Retencję, umowę, koszty per użytkownik, eksport danych  |
| API modelu          | Elastyczność i integrację         | Tokeny, dostawcę, obsługę błędów, limity, logowanie     |
| Model lokalny       | Większą kontrolę nad środowiskiem | Sprzęt, wydajność, aktualizacje, bezpieczeństwo i evals |
| Własny agent/system | Dostosowanie do procesu           | Cały cykl życia i odpowiedzialność operacyjną           |

**Model lokalny nie oznacza automatycznie rozwiązania darmowego ani bezpiecznego.** Brak opłaty za tokeny u dostawcy nie usuwa kosztu infrastruktury, energii, administratorów czy kontroli dostępu. Również użycie usługi chmurowej nie oznacza automatycznie wycieku - trzeba sprawdzić konkretny produkt, plan, umowę i konfigurację.

Ceny modeli zmieniają się na tyle szybko, że nie ma sensu przepisywać stawek z października 2026 r. jako stałych założeń do business case'u. Kalkulator powinien zawierać stawkę aktualną na dzień decyzji oraz scenariusz zmiany ceny i wolumenu.

---

# ROI i TCO - najdroższe bywa nie API, ale człowiek

**TCO (Total Cost of Ownership)** to pełny koszt wdrożenia i użytkowania, nie tylko faktura za model.

```text
TCO NA 12 MIESIĘCY
  ├── licencje / API / infrastruktura
  ├── analiza i przygotowanie danych
  ├── integracja z procesem
  ├── bezpieczeństwo, uprawnienia i audyt
  ├── ewaluacje / przypadki testowe
  ├── szkolenie użytkowników
  ├── czas przeglądu odpowiedzi
  ├── poprawianie błędnych odpowiedzi
  ├── monitoring i incydenty
  ├── aktualizacja promptów i źródeł
  └── koszt wyjścia / zmiany dostawcy
```

Do policzenia opłacalności potrzebuję kilku podstawowych wzorów:

\[
ROI = \frac{Korzyść - TCO}{TCO} \times 100\%
\]

\[
Okres\ zwrotu = \frac{Koszt\ uruchomienia}{Miesięczna\ korzyść - Miesięczny\ koszt\ utrzymania}
\]

\[
Koszt\ sprawy = \frac{Koszt\ pracy\ ludzi + Koszty\ stałe\ procesu}{Liczba\ spraw}
\]

Drugi wzór ma sens tylko wtedy, gdy mianownik jest dodatni, a przepływy są w miarę stałe.

## Przykład obliczeniowy - hipotetyczne wdrożenie

Zakładam 1200 spraw miesięcznie. Dziś każda wymaga 12 minut, po wdrożeniu - 6 minut, **łącznie z kontrolą**. Stawka całkowita pracy to 60 zł/h.

```text
1200 × (12 − 6) min = 7200 min = 120 h / mies.
120 h × 60 zł/h    = 7200 zł potencjalnej korzyści / mies.
12 × 7200 zł       = 86 400 zł potencjalnej korzyści / rok

ALE:
- czy te 6 minut obejmuje błędne wyniki?
- ile szkiców naprawdę zostanie użytych?
- czy uwolniony czas można przełożyć na koszt lub przepustowość?
- ile kosztuje integracja, kontrola i utrzymanie?
```

Nie wolno automatycznie utożsamiać wartości uwolnionych godzin z oszczędnością gotówki. Jeśli etaty i wydatki się nie zmieniają, korzyść może oznaczać **większą przepustowość**, a nie redukcję kosztów.

## Trzy scenariusze zamiast jednej optymistycznej liczby

```text
PESYMISTYCZNY:
  mała adopcja + częste poprawki + droższa integracja

BAZOWY:
  realistyczna adopcja + średnia jakość + typowy nadzór

OPTYMISTYCZNY:
  wysoka adopcja + mało poprawek + stabilna infrastruktura
```

Ten sam pomysł może mieć dodatni lub ujemny ROI zależnie od **trafności szkiców, adopcji i kosztu integracji**. Zmiana ceny tokenów może mieć mniejsze znaczenie niż kilka dodatkowych minut ludzkiej kontroli na każdej sprawie.

---

# KPI: mierzę wynik, ale też pilnuję, czego nie zepsułem

Dobry KPI ma nie tylko nazwę, ale także **wartość bazową, cel, termin, źródło danych i właściciela**.

```text
KPI = MIARA + BASELINE + CEL + TERMIN + ŹRÓDŁO

GUARDRAIL = WARUNEK, KTÓREGO NIE WOLNO POGORSZYĆ
```

Przykładowy zestaw:

| Rodzaj  | Miernik                         | Przykładowa metoda                                          |
| ------- | ------------------------------- | ----------------------------------------------------------- |
| Czas    | Aktywny czas obsługi sprawy     | Mediana minut na sprawę                                     |
| Proces  | Lead time                       | Od utworzenia zgłoszenia do zamknięcia                      |
| Koszt   | Koszt obsługi sprawy            | Pełny koszt procesu / liczba spraw                          |
| Jakość  | Odsetek zaakceptowanych szkiców | Przyjęte bez przepisywania / wszystkie szkice               |
| Adopcja | Faktyczne użycie                | Sprawy obsłużone ze wsparciem AI / kwalifikujące się sprawy |
| Ryzyko  | Błędna decyzja / obietnica      | Liczba błędów krytycznych i eskalacji                       |

Przykład konfliktu:

```text
CEL:
  skrócić obsługę reklamacji o 50%

GUARDRAIL:
  nie zwiększyć liczby ponownych kontaktów
  nie generować błędnych obietnic finansowych
  nie przekroczyć budżetu na sprawę
```

To ważne, ponieważ model może "poprawić" jeden miernik, jednocześnie niszcząc drugi. Mniej czasu na sprawę nic nie daje, jeżeli klient wraca trzy razy z tą samą reklamacją.

**Pomiar przed zmianą:** wybieram reprezentatywną próbę spraw, zapisuję czasy, wyjątki, koszt i jakość, a następnie odkładam część przypadków do późniejszych evals. Pytanie w ankiecie "czy pracuje Ci się szybciej?" nie zastępuje logu zdarzeń.

---

# PoC, pilotaż i produkcja to trzy różne decyzje

```text
PoC
 "Czy ta technika w ogóle potrafi wykonać zadanie?"
        ↓ BRAMKA 1
PILOTAŻ
 "Czy działa na naszym procesie, z naszymi ludźmi i danymi?"
        ↓ BRAMKA 2
PRODUKCJA
 "Czy działa stabilnie, opłacalnie i pod kontrolą?"
```

## Karta eksperymentu - przykład

| Element  | Założenie                                                       |
| -------- | --------------------------------------------------------------- |
| Zakres   | Reklamacje do 1000 zł, język polski                             |
| Próba    | 50 przypadków testowych, potem 200 rzeczywistych                |
| Hipoteza | 80% szkiców przyjętych, czas 12 → 6 minut                       |
| GO       | Co najmniej 80%, zero błędnych obietnic, koszt sprawy ≤ 7,50 zł |
| POPRAWKA | 60–80%: jedna iteracja i ponowny test                           |
| STOP     | Poniżej 60% po dwóch tygodniach lub błąd krytyczny              |
| Budżet   | 6000 zł, limit API 300 zł                                       |
| Decydent | Właściciel biznesowy w ustalonym terminie                       |

Te wartości służą pokazaniu sposobu projektowania eksperymentu. Dla prawdziwego procesu trzeba wyznaczyć je na własnych danych.

"Poprawka" musi mieć limit. Bez tego pilot może trwać bez końca: kolejne prompty, kolejne modele, kolejne wyjątki i brak decyzji.

## Piaskownica i security-by-design

Przy eksperymentach z agentami pilnuję nie tylko jakości odpowiedzi, ale także zakresu technicznych możliwości:

```yaml
# Przykładowa polityka środowiska testowego - schemat koncepcyjny
sandbox:
  network: restricted
  filesystem: read_only
  data: anonymized
  max_runtime_seconds: 600
  daily_api_budget_usd: 10
  human_approval_required:
    - send_to_customer
    - issue_refund
  log:
    - tool_calls
    - model_version
    - input_output_metadata
    - estimated_cost
```

To jest **ilustracyjna konfiguracja**, nie plik gotowy do użycia w konkretnym frameworku.

Mental model z perspektywy security:

```text
INSTRUKCJA: "Nie wysyłaj maili bez zgody"
                  ≠
TECHNICZNA BLOKADA WYSYŁANIA

Prompt kieruje zachowaniem.
Uprawnienia ograniczają rzeczywiste możliwości.
```

Przed produkcją sprawdzam: jakość, wartość, koszt, bezpieczeństwo, dane, odpowiedzialność, monitoring i możliwość wyłączenia rozwiązania. Sam udany pokaz nie zamyka żadnego z tych tematów.

---

# Evals - testy automatyczne dla systemu, którego odpowiedź nie jest deterministyczna

Evals traktuję jako odpowiednik testów regresji dla rozwiązań opartych na modelach językowych. W tradycyjnym programowaniu wiem, że funkcja dla określonych danych powinna zwrócić określony wynik. W LLM ten sam problem można poprawnie opisać na kilka sposobów.

Dlatego potrzebuję **przypadków testowych i kryteriów oceny**, a nie wyłącznie porównania dwóch ładnych odpowiedzi.

```text
PRZYPADEK TESTOWY
  ├── input
  ├── kontekst / źródła
  ├── oczekiwane zachowanie
  ├── kryterium zaliczenia
  └── kategoria ryzyka
           ↓
        MODEL
           ↓
        OUTPUT
           ↓
  WALIDATOR / OCENA CZŁOWIEKA
           ↓
       PASS / FAIL
```

## Przykładowe przypadki dla reklamacji

| Test                                    | Oczekiwane zachowanie                                   |
| --------------------------------------- | ------------------------------------------------------- |
| Jest kompletny regulamin i dowód zakupu | Szkic z poprawnym cytatem                               |
| Brak numeru zamówienia                  | Prośba o brakujące dane, bez wymyślania zamówienia      |
| Sprzeczność między mailem a CRM         | Oznaczenie konfliktu i eskalacja                        |
| Żądanie spoza kompetencji działu        | Przekazanie do właściwego zespołu                       |
| Instrukcja atakującego w treści maila   | Potraktowanie jej jako danych, nie polecenia dla agenta |
| Próg kwotowy wymaga akceptacji          | Brak autonomicznej decyzji o zwrocie                    |

Ważne są również **przypadki negatywne**. Dobry system powinien umieć powiedzieć "nie wiem" albo "eskaluję", zamiast zawsze produkować odpowiedź.

## Minimalny eval w Pythonie

```python
# Przykładowy evaluator oparty o reguły.
# Nie zastępuje ręcznej oceny semantycznej.

def evaluate(output: str, expected: dict) -> dict:
    checks = {
        "has_source": (
            not expected.get("requires_source", False)
            or "Źródło:" in output
        ),
        "no_forbidden_promise": (
            "gwarantujemy zwrot" not in output.lower()
        ),
        "handles_missing_data": (
            not expected.get("missing_data", False)
            or "brak danych" in output.lower()
        ),
    }
    return {"passed": all(checks.values()), "checks": checks}
```

Ten test wykrywa proste odstępstwa, ale **nie potwierdza, że wskazane źródło faktycznie istnieje ani że decyzja jest prawidłowa**. Do tego potrzebuję porównania ze źródłami, lepszych walidatorów lub przeglądu eksperckiego.

## Promptfoo i porównywanie zmian

`promptfoo` pozwala uruchamiać testy promptów i modeli w sposób powtarzalny. Typowy workflow:

```text
prompt_v1 + model_A ──┐
                     ├── ten sam dataset
prompt_v2 + model_A ──┘
                           ↓
                    porównanie pass rate
                    błędów krytycznych
                    kosztu i opóźnień
```

Przykładowy szkic YAML (należy dostosować identyfikator modelu i providera do faktycznej konfiguracji):

```yaml
description: "Reklamacje - porównanie promptów"
prompts:
  - file://prompt_v1.txt
  - file://prompt_v2.txt
providers:
  - openai:chat:YOUR_MODEL_ID
tests:
  - vars:
      message: "Nie mam numeru zamówienia. Co zrobić?"
    assert:
      - type: contains
        value: "numer"
```

```bash
npx promptfoo@latest eval
npx promptfoo@latest view
```

Przy zmianie modelu, promptu, danych, regulaminu albo narzędzia uruchamiam **ten sam zbiór testów**. Zbiór najlepiej trzymać u siebie w otwartym formacie (np. CSV/JSONL), żeby można było zmienić framework bez utraty kryteriów jakości.

### Problem testów wieloetapowych

Jeżeli pojedynczy krok ma 75% szans powodzenia, a do ukończenia procesu potrzebne są trzy niezależnie udane kroki, przy tym uproszczonym założeniu:

\[
0{,}75^3 \approx 42\%
\]

Tak można zobrazować kumulowanie błędów agentów. W rzeczywistych workflow kroki nie muszą być niezależne, dlatego jest to **model ilustracyjny**, nie wzór na niezawodność dowolnego agenta.

---

# Plan na 30 dni - od obserwacji do decyzji

Na końcu cały proces powinien zmieścić się w jednostronicowym business case. To sprawdzian, czy naprawdę potrafię określić problem i uzasadnić decyzję.

## Tydzień 1: stan obecny i hipoteza

- Wybieram **jeden** proces.
- Rysuję 5–9 kroków AS-IS.
- Mierzę czas pracy, czas czekania, liczbę spraw, liczbę błędów.
- Identyfikuję właściciela procesu i klasę danych.
- Porównuję wariant AI z wariantem bez AI.

**Rezultat:** baseline i hipoteza, którą można obalić.

## Tydzień 2: mały PoC

- Przygotowuję reprezentatywny zbiór testowy.
- Uruchamiam rozwiązanie na danych publicznych lub odpowiednio zanonimizowanych.
- Sprawdzam jakość, błędy krytyczne, koszt, czas odpowiedzi.
- Oceniam, czy PoC spełnia warunki przejścia.

**Rezultat:** raport ewaluacji i decyzja o dopuszczeniu do pilotażu.

## Tydzień 3: ograniczony pilotaż

- Wybrana grupa użytkowników pracuje w kontrolowanym procesie.
- Człowiek zatwierdza rezultaty.
- Rejestruję użycie, poprawki, błędy, koszty i rzeczywiste czasy.
- Weryfikuję KPI oraz guardrails.

**Rezultat:** dane o działaniu w realnym workflow.

## Tydzień 4: porównanie i decyzja

- Porównuję AS-IS i TO-BE.
- Liczę ROI/TCO w trzech scenariuszach.
- Sprawdzam ryzyka, dane, odpowiedzialność i wymagania utrzymaniowe.
- Podejmuję decyzję **GO / POPRAWKA / STOP**.

**Rezultat:** konkretna rekomendacja dla właściciela procesu, z kosztami i dowodami.

---

# Jednostronicowy business case - szablon do ponownego użycia

```text
1. PROBLEM
   [Co i gdzie nie działa? Wolumen, czas, koszt AS-IS]

2. WŁAŚCICIEL / ODBIORCY
   [Kto odpowiada? Kto odczuje poprawę?]

3. ZADANIE DLA AI
   [Jedna konkretna czynność / wynik]

4. DANE
   [Źródła, jakość, klasa danych, ograniczenia]

5. NADZÓR CZŁOWIEKA
   [Co zatwierdza? Kiedy eskaluje?]

6. RYZYKO
   [Najdroższy błąd, wykrycie, reakcja]

7. KPI + GUARDRAIL
   [Baseline, cel, termin, źródło danych]

8. WARIANT I TCO
   [Bez AI / SaaS / API / lokalny; 12 miesięcy,
    scenariusz pesymistyczny, bazowy, optymistyczny]

9. HIPOTEZA I DECYZJA
   [Próba, GO/POPRAWKA/STOP, termin, budżet,
    osoba zatwierdzająca]
```

## Prompt pomocniczy do przygotowania karty

```text
Cel: przygotować jednostronicowy business case wdrożenia AI.

Wejście:
- mapa procesu AS-IS,
- dane o wolumenie, czasie i kosztach,
- wypełniona AI Use-Case Canvas,
- obliczenia TCO/ROI,
- polityka danych i ograniczenia organizacji.

Zadanie:
1. Zadaj do 7 pytań o brakujące dane, które wpływają na decyzję.
2. Wskaż 3 najsłabsze założenia i metodę ich sprawdzenia w 30 dni.
3. Zaproponuj guardrail do każdego KPI.
4. Przygotuj kartę w 9 polach, maksymalnie 40 słów w polu.
5. Zidentyfikuj warunki GO / POPRAWKA / STOP.

Ograniczenia:
- Nie wymyślaj liczb ani właścicieli.
- Nie traktuj oszczędzonych godzin automatycznie jako oszczędności gotówki.
- Brak danych oznacz "DO ZMIERZENIA".
- Uwzględnij wariant bez AI i pełny koszt nadzoru.

Kryteria akceptacji:
- Każda liczba ma źródło.
- ROI zgadza się z kalkulatorem.
- KPI ma baseline, cel, termin i guardrail.
- Decyzję można podjąć po zamknięciu eksperymentu.
```

---

# Co zapamiętam jako praktyk security / ICT risk

W projektach AI interesują mnie szczególnie granice danych, uprawnienia agenta, obserwowalność, odpowiedzialność oraz możliwość weryfikowania skutków. To nie jest osobny etap "na końcu". Powinno wpływać na projekt od samego początku.

```text
WARTOŚĆ                  RYZYKO
───────────────          ───────────────────
Krótszy czas             Błędna decyzja
Większy wolumen          Ujawnienie danych
Niższy koszt             Nieautoryzowane działanie
Szybsza obsługa          Brak audytowalności
Lepsza jakość            Uzależnienie od dostawcy

        ↓ jedna decyzja o wdrożeniu ↓

BUSINESS CASE + SECURITY CASE + OPERATING MODEL
```

Ważne rozróżnienie: podział odpowiedzialności prawnej za błąd modelu nie sprowadza się automatycznie do stwierdzenia, że "zawsze odpowiada dostawca modelu". Zależy od roli podmiotu, charakteru systemu i właściwego prawa. Przy wdrożeniu trzeba ustalić te obowiązki dla konkretnego przypadku.

## Moja lista pytań przed zgodą na PoC

- Co dokładnie będzie mierzone i kto zatwierdzi kryteria?
- Jakie dane opuszczają organizację, w jakiej postaci i na jakich warunkach?
- Czy agent ma technicznie ograniczone uprawnienia?
- Czy znamy koszt najgorszej pomyłki?
- Czy są logi wystarczające do odtworzenia decyzji?
- Czy możemy wycofać rozwiązanie bez zatrzymania procesu?
- Czy zdefiniowano sposób reagowania na błędne odpowiedzi i incydenty?
- Czy istnieje test regresyjny uruchamiany przy zmianie modelu, promptu i wiedzy?

---

# Najważniejsze mental modele

## Model 1: produkt ≠ proces

```text
Kupić licencję można w godzinę.
Zmierzyć i przebudować proces jest trudniej.
Wynik biznesowy powstaje w procesie, nie na ekranie czatu.
```

## Model 2: jakość odpowiedzi ≠ jakość systemu

```text
DOBRY OUTPUT
    + prawidłowe dane
    + akceptowalny koszt
    + odpowiedzialność
    + uprawnienia
    + stabilność
    + monitoring
    = dopiero kandydat do produkcji
```

## Model 3: oszczędność lokalna ≠ globalna

```text
Pracownik zyskał 10 min
          ↓
Inna osoba poświęciła 15 min na sprawdzenie
          ↓
System jest bardziej efektowny, ale wolniejszy
```

## Model 4: PoC to test hipotezy, nie pokaz technologii

```text
PRZED: ustalone progi + zakres + dane + limit kosztów
W TRAKCIE: pomiar + przypadki testowe + błędy
PO: GO / JEDNA POPRAWKA / STOP
```

## Model 5: evals to zasób trwalszy niż prompt i model

```text
PROMPT v1 → MODEL A → TESTY
PROMPT v2 → MODEL A → TE SAME TESTY
PROMPT v2 → MODEL B → TE SAME TESTY

Wnioski porównuję na stałym zbiorze przypadków.
```

---

# Podsumowanie: mój workflow od pomysłu do decyzji

```text
[1] ZNAJDŹ PROBLEM
          ↓
[2] NARYSUJ AS-IS I ZMIERZ BASELINE
          ↓
[3] ZAPYTAJ, CZY AI JEST POTRZEBNA
          ↓
[4] WYPEŁNIJ USE-CASE CANVAS
          ↓
[5] OCEŃ WARTOŚĆ, CZĘSTOTLIWOŚĆ, DANE, RYZYKO
          ↓
[6] PORÓWNAJ WARIANTY TECHNOLOGICZNE
          ↓
[7] POLICZ 12-MIESIĘCZNE TCO I ROI
          ↓
[8] USTAL KPI, GUARDRAILS I WARUNKI STOP
          ↓
[9] URUCHOM PoC Z EVALS
          ↓
[10] PRZEPROWADŹ OGRANICZONY PILOTAŻ
          ↓
[11] GO / POPRAWKA / STOP
          ↓
[12] DOPIERO TERAZ: WDROŻENIE I UTRZYMANIE
```

Najważniejsza zasada, którą chcę stosować przy każdym wdrożeniu:

> **Nie interesuje mnie, czy AI potrafi coś wygenerować. Interesuje mnie, czy potrafię udowodnić, że całe rozwiązanie poprawia rzeczywisty proces - przy akceptowalnym koszcie i ryzyku.**

---
