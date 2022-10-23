defmodule Vtm.LocationsSeedsHelpers do
  import Ecto.Query
  require Logger

  def insert_map(attrs = %Vtm.Chats.ChatMap{name: name, description: description, is_chat: is_chat, chat_map_id: chat_map_id}) do
    is_private =
      case attrs do
        %{is_private: true} -> true
        _ -> false
      end

    case Vtm.Repo.get_by(Vtm.Chats.ChatMap, name: name) do
      nil ->
        %Vtm.Chats.ChatMap{}
        |> Vtm.Chats.ChatMap.changeset(%{name: name, description: description, is_chat: is_chat, chat_map_id: chat_map_id, is_private: is_private})
        |> Vtm.Repo.insert()
      place ->
        place
        |> Vtm.Chats.ChatMap.changeset(%{description: description})
        |> Vtm.Repo.update()
    end
  end

  def get_or_insert_map(attrs = %Vtm.Chats.ChatMap{name: name}) do
    query =
      from a in Vtm.Chats.ChatMap,
        where: a.name == ^name

    case Vtm.Repo.one(query) do
      nil -> insert_map(attrs)
      a   -> {:ok, a}
    end
  end

  def update_chat_entries(chat_id_from, chat_id_to) do
    from(c in Vtm.Chats.ChatEntry, where: c.chat_map_id == ^chat_id_from)
    |> Vtm.Repo.update_all(set: [chat_map_id: chat_id_to])
  end
end

{:ok, %{id: universita_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "Università", is_chat: false})
{:ok, %{id: north_end_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "North-End", is_chat: false})
{:ok, %{id: beacon_hill_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "Beacon Hill", is_chat: false})
{:ok, %{id: bassifondi_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "Bassifondi", is_chat: false})
{:ok, %{id: aeroporto_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "Aeroporto", is_chat: false})
{:ok, %{id: private_chats_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "Chat Private", is_chat: false})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Plaza Garibaldi", description: """
Plaza Garibaldi è la zona di Palermo che sorge attorno all'omonima piazza dedicata all'eroe dei due
mondi. Segna l'ingresso al quartiere di Palermo, ed è costellato di numerosi palazzi vintage,
Di notte, la zona è molto tranquilla, ed il vicino giardino botanico ha cominciato ad offrire
ingressi fino a notte tarda.\n
""", is_chat: true, chat_map_id: universita_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Palacio Pompadour", description: """
Il palazzo di sei piani che sorge in Avenida Santa Fé aveva un aspetto vintage. Bianco, circolare,
con diversi balconi in ferro battuto ed ampie finestre ai piani inferiori, un tempo ospitava una mostra
d'arte e gli uffici della fondazione Duval. Tutto ciò è solo un ricordo: l'edificio ha ospitato uno
degli attentati alla Masquerade di Palermo, rimanendo ferito in modo irreparabile da due esplosioni.
L'edificio è ancora circondato da cordini della polizia che ne dovrebbero impedire l'accesso.
""", is_chat: true, chat_map_id: universita_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Hollywood", description: """
La zona chiamata di "Hollywood" è in realtà una zona molto attiva di notte, piena di locali e di
ristoranti a vario tema. In questa zona si avvertono nitidamente le varie influenze che la massiccia
immigrazione hanno donato alla città di Buenos Aires. Il quartiere è anche pieno di librerie di vario
tipo, aperte anche fino a tarda notte.
""", is_chat: true, chat_map_id: universita_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Sinagoga", description: """
La Sinagoga sorge nella zona più ad ovest di Palermo, verso il centro. Ampio monumento quadrato,
la facciata bianca tradisce la sua natura religiosa solo dalle finestre dai vetri colorati
a motivi moderni. La sinagoga è famosa soprattutto per il suo centro di studi cabalistici,
argomento che sembra avere molta influenza tra le classi più abbienti di Buenos Aires.\n
L'interno della Sinagoga è ampio, molto alto. Le file di panche sono divise in due, con una
balconata che percorre tre delle quattro pareti adiacenti e opposte all'altare. Il centro studi
è invece situato nel retro dello stabile, inaccessibile se non agli studiosi.
""", is_chat: true, chat_map_id: universita_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Cementerio Monumental", description: """
L'imponente costruzione posta al centro del ricco quartiere di Recoleta è un capolavoro di
architettura vintage. Un labirinto di sentieri conduce attraverso cappelle familiari, una
moltitudine di lapidi e numerosi simboli più o meno imperscrutabili.
""", is_chat: true, chat_map_id: north_end_id})

# {:ok, %{id: confiteria_del_molino_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(
#   %Vtm.Chats.ChatMap{name: "Confitería del Molino", description: """
#     La Confitería del Molino è un vecchio edificio fino a poco tempo fa abbandonato, che ha
#     da poco riaperto i battenti. Ospita numerose aree di ristoro ed un piccolo teatro, ed ai
#     piani superiori dello stabile il comitato direttivo e gli uffici amministrativi di una
#     importante impresa di investimenti di valute.\n
#     I piani superiori sono gelosamente protetti e conservati dagli sguardi indiscreti,
#     poiché in realtà ospitano l'Elysium della Camarilla, che si sviluppa in una decina
#     di stanze diverse, ed ha un aspetto ed un arredamento minimalista, moderno. Oltre l'Atrio,
#     protetto da una decina di guardie, tre stanze sono adibite agli incontri ed al ristoro
#     degli ospiti, mentre le ultime cinque stanze sono riservate al Principe e al Consiglio dei
#     Primogeniti.
#     """, is_chat: false, chat_map_id: north_end_id})

# {:ok, %{id: anticamera_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "Anticamera", description: """
# L'anticamera dell'Elysium di Buenos Aires è un'ampia sala fiocamente illuminata da lampadari sapientemente
# disposti lungo tutta la sala. Le pareti in marmo verde per un metro, sono adornate da stucchi su tutta la parete,
# e da specchi ovali disposti a distanze uguali l'un dall'altro per tutta la lunghezza della sala. L'arredamento
# è composto da una serie di comodi divanetti posti tra una serie di tavolini in vetro ornati da metallo scuro.
# A grande distanza l'un dall'altro, sono posti dei quadri, alcuni acquarelli, molti surrealisti, qualche impressionista,
# tutti eseguiti da artisti argentini.
# """, is_chat: true, chat_map_id: confiteria_del_molino_id})

# Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Salone Ovale", description: """
# Ad occupare un'ampia porzione del primo piano dell'Elysium alla Confíteria del Molino è la Sala Ovale, direttamente
# comunicamente con le stanze dello staff. Le pareti della stanza, ammobiliata con un imponente tavolo centrale in
# mogano, sul quale sono incisi motivi floreali, seguono lo standard imposto dall'anticamera, con pannelli di marmo
# verde alti circa un metro, sovrastati da bianche pareti ornate da stucchi, sulle quali rimagono appesi a distanza di
# due metri l'un dall'altro una serie di specchi ovali della stessa foggia dell'Anticamera.
# """, is_chat: true, chat_map_id: confiteria_del_molino_id})

# Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Salette", description: """
# Lontano dal brusìo dell'Elysium, le salette poste al secondo piano offrono l'opportunità di poter discutere senza
# essere disturbati. Sistemate lungo tutta una deserta sala con pavimento in legno, sono ornate a foggia di palchetti di
# teatro, anche se la visuale che offrono è quella della piazza antistante la Confíteria del Molino, proprio dietro le
# iconiche "pale". All'interno di ogni saletta, protetta da un'apparentemente leggera porta di legno, l'arredamento è
# composto da un paio di sedie e i divanetti tipici delle sale da teatro, che vengono completati dalla presenza di un
# tavolinetto da caffé in vetro, ornato da metallo scuro.
# """, is_chat: true, chat_map_id: confiteria_del_molino_id})

# Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Sala del Consiglio", description: """
# Metà del secondo piano dell'Elysium è dedicato agli uffici governativi, il primo dei quali, unico punto d'accesso,
# protetto da telecamere di sicurezza, sistemi d'allarme più evoluti rispetto a quelli utilizzati in tutto il resto
# dello stabile, e due dipendenti della sicurezza sempre di fronte alle sue porte, è la Sala del Consiglio dei
# Primogeniti. Al suo interno, un grande tavolo troneggia al centro della stanza, circondato da sedie di legno
# con sedili in velluto rosso. Le finestre danno direttamente al retro del Palazzo del Parlamento, ma si nota
# immediatamente dai dispositivi posti su ognuna di esse, e dalle grate metalliche fissate sopra ognuna di esse, che
# possono essere immediatamente protette contro ogni evenienza. Un altro paio di guardie è posto di fronte ad un ampio
# portone, che conduce alle sale del Principe e del Siniscalco, inaccessibili anche ai Primogeniti.
# """, is_chat: true, chat_map_id: confiteria_del_molino_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Retiro", description: """
L'intero quartiere è adibito ai trasporti da e per Buenos Aires, sia via terra che via mare.
Retiro ospita infatti la stazione dei treni e dei bus, e il porto di Buenos Aires, ma anche
una delle più grandi villas di Buenos Aires, che costeggia proprio la stazione. Al suo interno,
case fatiscenti tradiscono l'estrema povertà dei suoi abitanti.
""", is_chat: true, chat_map_id: north_end_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "San Telmo", description: """
San Telmo è uno dei quartieri più antichi di Buenos Aires. Tra le sue vie e negli antichi
edifici scorre la storia della città. Il quartiere, di giorno e di notte, è il luogo dove
mercatini di bancarelle sparse si ammassano ai lati delle vie, dove le milonghe nelle antiche
sale portano avanti la storia del ballo caratteristico della nazione.
""", is_chat: true, chat_map_id: north_end_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Milonga", description: """
Nel cuore di San Telmo, in un vecchio edificio della prima metà del XX secolo, protetto
da una serie di vetrate al terzo piano, a serate alterne si organizza una delle milonghe
più famose di Buenos Aires. Qui, in un considerevole spazio di almeno trecento metri quadrati
si balla e si insegna tango. Rimane aperta fino almeno alle 4, e il vago stile bohemien
che ispira attrae gente anche dall'estero.
""", is_chat: true, chat_map_id: north_end_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Zona Este", description: """
Zona Este è un grande e famoso Night Club della Provincia Nord di Buenos aires. Sorge ai
lati di una "villa", di un quartiere problematico, e con la sua estensione di un migliaio di
metri quadri è uno dei più grandi della città.\n
All'interno, dipendendo dalla serata, potrebbero esserci pochi sparuti clienti ubriacandosi
all'ampio bar, diversi avventori per le spogliarelliste, o anche folle oceaniche per assistere
alle serate di discoteca. La cosa che non sembra cambiare è l'inaccessibilità del piano superiore,
una grande balconata che corre lungo tre delle pareti del grande locale.
""", is_chat: true, chat_map_id: bassifondi_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Villa Almeyda", description: """
Villa Almeyda è uno di quei quartier che, in Brasile, verrebbero chiamati favelas. Le case
fatiscenti si avvicendano a qualche sparuto edificio tirato su con lamiera e qualche asse di
legno. Le persone che abitano questi luoghi vivono di espedienti, e molto spesso illegalmente.
""", is_chat: true, chat_map_id: bassifondi_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Tigre", description: """
Tigre è il nome di un piccolo fiume che scorre a nord di Buenos Aires. Costeggia il quartiere
omonimo, un quartiere bene di ricche residenze, calles piene di negozi e ristoranti di alta classe.\n
In questo quartiere, fuori dal trambusto della città, si possono trovare turisti, porteños
in gita per la giornata o il fine settimana, e anche molta sicurezza.
""", is_chat: true, chat_map_id: bassifondi_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Arena", description: """
L'arena è un piccolo anfiteatro che costeggia un grande spazio aperto, un ex parcheggio e lo
scheletro di un centro commerciale cominciato durante il Corralito, e mai finito, ormai
abbandonato. Le colonne portanti, fatiscenti e piene di graffiti, nascondono spacciatori e
altri rifiuti della società.\n
Questo quartiere viene chiamato arena perché nell'anfiteatro hanno luogo sporadicamente
eventi centro di scommesse clandestine, ma soprattutto il parcheggio è il luogo preferito
per organizzare corse clandestine.
""", is_chat: true, chat_map_id: bassifondi_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "La Boca", description: """
Il quartiere del vecchio porto di Buenos Aires, in parte ancora in azione, è uno dei luoghi
più caratteristici, ancora ufficialmente nella circoscrizione della Capital Federal. Accanto
al "Caminito", storico quartiere ormai per lo più turistico, si susseguono numerosi capannoni
ormai abbandonati e gru della vecchia area portuale che svettano sulle notti scure illuminate
dalla città in lontananza.\n
La notte non è sicuramente un quartiere considerato sicuro, anche se a
gestirlo, si vocifera, sia la malavita organizzata, e non la criminalità casuale delle "villas".
""", is_chat: true, chat_map_id: beacon_hill_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Magione", description: """
In Avellaneda, tutti sanno che una delle magioni più protette, circondata da mura e da un alto cancello
in ferro battuto che impediscono l'accesso, è di proprietà di una facoltosa famiglia italiana
emigrata in Argentina ormai decenni addietro, ed ancora proprietaria di buona parte dei terreni
nei dintorni.\n
La verità è che la Magione è di proprietà dei Giovanni, attraverso un elaborato sistema di
prestanome. All'interno della Magione è notoriamente concesso l'accesso solo ai più stretti
collaboratori della Famiglia.
""", is_chat: true, chat_map_id: beacon_hill_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Barracas", description: """
Nonostante il nome, Barracas è un quartiere molto ricco, a ridosso della Provincia. Sede di molte
fabbriche di successo, adesso le sue vie sono popolate di bar e ristoranti, e la sua è una vita
notturna molto movimentata. Tutti sanno che però è sempre meglio trattenersi in un locale e
non percorrere a piedi le distanze da un locale all'altro, e chiedere sempre un taxi per spostarsi.
""", is_chat: true, chat_map_id: beacon_hill_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "El Castillo", description: """
Il vecchio edificio abbandonato del Castillo è un esempio di mala politica: fu cominciato come
il primo edificio, simbolo di un quartiere che doveva far concorrenza a Puerto Madero, ma poi
arrivò il Corralito, il default della nazione, e quello che rimase è uno scheletro fatiscente
ormai inglobato di fatto nella giurisdizione della Provincia. Alto addirittura quindici piani,
di cui solo gli ultimi cinque protetti da delle vetrate ormai cadenti, l'edificio è in stato
di completo degrado, abbandonato alla presenza di senza tetto, spacciatori di vario tipo e
prostitute.
""", is_chat: true, chat_map_id: beacon_hill_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Complesso Industriale", description: """
""", is_chat: true, chat_map_id: aeroporto_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Autopista clandestina", description: """
""", is_chat: true, chat_map_id: aeroporto_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Seduction", description: """
""", is_chat: true, chat_map_id: aeroporto_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chiesa sconsacrata", description: """
""", is_chat: true, chat_map_id: aeroporto_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 1", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 2", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 3", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 4", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 5", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})

# Vtm.LocationsSeedsHelpers.update_chat_entries(confiteria_del_molino_id, anticamera_id)
