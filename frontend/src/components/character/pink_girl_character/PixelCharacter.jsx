import { useRef, useEffect, useState, useCallback } from "react";

const W = 128;
const H = 192;
const PIXEL = 4;

const PALETTE = ["#cfc2b5", "#d0c2b5", "#ccc4b3", "#d0c4b5", "#cec5b4", "#d1cab7", "#cfc6b4", "#d0c9b8", "#cfc6b8", "#d2cab7", "#d3cbbb", "#d2c6b9", "#cec5b6", "#cdc4b5", "#d5d0c3", "#d4cabc", "#d3ccbc", "#cdc4bf", "#4f3041", "#352537", "#472539", "#342c38", "#dedace", "#cdc6bc", "#d3c9bb", "#cdc3bd", "#cf8b9d", "#fcc2ca", "#fbcac9", "#fdcdc8", "#f6cdcc", "#fcd1d0", "#df99aa", "#c27c8f", "#ebc3c3", "#fecad1", "#fdcacc", "#cf969f", "#a0697d", "#f1c9c9", "#8f5171", "#fcc7cb", "#fecdcf", "#d3cab5", "#915773", "#8d4b6a", "#fdcac8", "#d4c7b8", "#6e4559", "#d0b2b8", "#2d2131", "#c9bdbd", "#c4bcb8", "#b1a6a5", "#fcf1e0", "#f9e9d8", "#fcf9ef", "#fee9d9", "#cab9c1", "#f8ddd3", "#feedda", "#ebd2ce", "#c1b7b6", "#322737", "#2a1a2a", "#2a2432", "#fefef3", "#fdfcf1", "#c9c4be", "#fcfdf1", "#fcfce9", "#fcfdeb", "#fcfeed", "#fefde9", "#fefdeb", "#bfb4b5", "#c6b8bd", "#fefeee", "#fefeec", "#fafee7", "#fdfee7", "#fbfde8", "#fdffea", "#fcfee9", "#c4b8b8", "#cab7c2", "#c3b4b9", "#fbfee9", "#feffeb", "#fbfeeb", "#cab8bb", "#cfcab8", "#c9b8be", "#d0cbb7", "#fcffea", "#cbb8be"];
const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-_=+[]{}|;:<>?/~\u00f9\u00fa\u00fb\u00fc\u00fd\u00fe\u00ff\u0100";

const NEUTRAL_ROWS = [
    `lllllllllllllllllllllllllllllllllllllllllllllllllFFFAFFFFFEEEFEEEEEEEEFFFFEFGGGGGGA957lllllllllllllllllllllllllllllll5þ555555555`,
    `lllllllllllllllllllllllllllllllllllllllllllllllllFFFFFFOFFFFEEEEFFFFFFEEEEEFEFFGGGA9Allllllllllllllllllllllllllllll7l5þ555555555`,
    `llllllllllllllll77llll77llll77llll77lllllllllllFFFFFFEKJJJJJJJJJJJJJLLLLLLLIEEEGEFGGllllllllllllll77lll777llll77l7777þþ955555555`,
    `llllllll7777llll77lll77üllll77lll77üllllllllllllFFEEFzKKJJKKKKKKKKKKKJKKKKKIEEFFEFFGFFlAlllllllll77ü7ll777lll77ü777üüüþ955555555`,
    `lllllh5þ77777ll577775555777l5555þþ555555A577llOEIIKLKIQWRYVVVVVYbQQbZZZZZZWnKJJJJIEFAFFFllhh776677777777777755555555555555555595`,
    `llllh5555577599A55555955þ55A955þþþ555555AAAAFOFEKIKJKKbQZSfZZfZRQQQQRRRRZRbbKK#KKKYEEEFFlFllAAAA55555555555555555555555555555595`,
    `llll55555555þþþ555555555þþþþ55þþþþ555559GGGFFFoKciZVVVVSgkbbiiccQQQQQQQQZZgggaaSWWKKKKFFOBlAAAAAþþþþ5555555555555555555555555595`,
    `llllþ5555555þüþ555555555üüþþ5þþþþþ555555GGFFEEKKijgVUaffkkWWccccWQQQQQQQZaakaaafWb#KIKEEFFGGAAAAþþþþ5555555555555555555555555595`,
    `llll5þþ555555555555555555555555555557767FGKLLIxUZgaaTTSfaaZZZRRRijQQRRRRaakTSaakYZZZbWKKKKFFAllllh665555555555555555555555555595`,
    `llll5þþ55555555555555555555555555555lllllMJKKKVgTkTkkaZfRRRfZZRRejQQRRRRRfagZaaaggZZQbIIImEFGFFlllþþ5555555555555555555555555595`,
    `llll5þþ55555555555555555555555557777lOOOLIQXdZaTTkaaZfXQQQQQXQQQQQQQQQQQQQQQZZZZaaaggZUVKKIoFFFlFl9þ5555555555555555555555555595`,
    `llll5þþ555555555555555555555555577779AOFKIQQdkkaaZZZZZQXXXXXXXQQQXXXXXQQQQQQZfRRRkkTTgVgKKKKYEFFFlA95555555555555555555555555595`,
    `llll5þþ55555555555555555555555775lllFFImQXagTTTaaZjjjjRZkkafRRbQRZSSSSaaffmjjjXXXXSSggggUUbbIIFFGGAA955555555555555555555555þ599`,
    `llll5þþ55555555555555555555555777lBFFMImbQakTTTakfijjjRfaaaRRYbbRZkTkkkkafmmmmQXXXagggTTTkWbIKEYFFGG955555555555555555555555559G`,
    `llll5þþ55555555555555555555555579FFBIIQXaaSSTkTgQXZZZZSkaaaRbbZaaSkTSSSSSSaaZZfffRXQaTTTTkkRQWoKEHGGA9955555555555555555555559AA`,
    `llll5þþ5555555555555555555555557OFFEIIQWkSkkkkkaQbkTkgaTkkafbbffTkkTkkkkSSSSkkkkSRbbRkkTTTaUWWKKzHOþA9A95555555555555555555599AA`,
    `llll5þþ5555555555555555555555555BGImbbafSkkkbbkkkkSSTTTTTaQQZfakTTTkTTSSSSSSfffaaRRRQQkTTTaSZRnbIKFAFGG995555555555555555555þþGA`,
    `llll5þþ55555555555555555555555576EIIbQSSkkkkbbkkTTkkgRkTaaXXafkkTTTkTTSSSSSSfffaaafRbWkTTTakfUn+IKEGFGG995555555555555555555þþGA`,
    `FFll5þþ555555555555555555555h5AAIJbXsvSkkRWnkkkTkaaYbXaSaaafkSTTTTTkkkkkSSSSijiifaafRRSYTTTTTUsuIKEEGGG955555555555555555555þþGA`,
    `llll5þþ555555555555555555555hhFFIIWnvxSkkRWYkkSTTkRYQXaUSfRRaaTTTTTkkkkkSSSSjijmgafaddSYSSkTTzsuIKzEGGG955555555555555555555þþA9`,
    `llll5þþ5555555555555955þ555579OFIIxxtdTSkYYfkkkTgaQbfRffaRbXkkSSTTkkaaQQfaakgaafciaaSSTSYYkkTzsunnIoEA9A5þþþ55555555555555555595`,
    `llll5þþ5555555555555955þþþ557OOFIIttvSTYYYkkSkkkfRQQaRfaaRbbkkSSTTkkSaQQfakkakaaimfakkTTSnkTTzssWnIIEFAA99þþ55555555555555555555`,
    `llll5þþ5555555555555955þüþ59hBIIzzvvdkfRYRSkSSfRjiRRffffXXRfkkkkTTkkkkffkkkTTTgaaacikkkkSSTkUzysuuIJEFFAAA5555555555555555555555`,
    `llll5þþ5555555555555955þüþ59lFIIVUxvdRRYRkSSSSRRiiafffffXXfgkkkkTTkkkSkakYkkTTTTafiifffaTSkTUUyyvvIKEEFAAA5555555555555555555555`,
    `llll5þþ5555555555555555555AAlOIIUUUddYYRRSvvUfXXRRaSkkfRXXakSSSSSSSSSSkkbWSakkkTgfZRXXTSSTvVdUUTSabWIJFAGG5555555555555555555595`,
    `llll5þþ5555555555555555555AAABIIUUTTSRYRRUvvdRcXRRafkfRYXcakSSSSSSSSSSkkbbRZakkkaaZZbQkkkTvxUSSSSSWWIKEFGG5555555555555555555595`,
    `llll5þþ555555555555555555575AFIIUUTTakkRSdvvdRbWRfffkaXXRfRSSSSSSSSSSSkkRfXXZSTkkaWWRWfkTUyxUSkkSSfZKKEFGG5555555555555555555595`,
    `llll5þþ5555555555555555555577EIIUUTTkSSkTdvxYRWWkfffaaXQRRSSSSSSSSSSSSkkfZXXZkTkkaWWZYfkUzyvdSRRSkfZKJEFGG5555555555555555555595`,
    `Flll5þþ5555555555555555555BFIKzVUfaRnYddxxVVXcvvUSSkSZXQffSSkkkkSSSSSabbZRXQZkTSTUVVQXRdvsvtURbbkSTaZZIJAGA955555555555555555595`,
    `llll5þþ5555555555555555555BFLKdgSSfRYYUUVxUZQcvxUdUUSfXXffkkkkkkSSkkSabWRZQXfSTUUUxxXXRdssvxVfbbakaaSZIJGGA955555555555555555595`,
    `llll5þþ5555555555555555555BFKIUkkRXXfSVxSUSZbcvxdUvvUZjjaaSSSSSSSSSSSfQbYdIIUUxvddxxXXRfvvddgfbbafkTTZIJFFG955555555555555555595`,
    `llll5þþ5555555555555555555OOIIUkkfXcfSVVSSgZbXxxYzvtUZjiaaUdUUddUUSSSRQbYzIIUUvvdzvVXXRdxxUTgRbQffkkTZIJFFFh59555555555555555595`,
    `llll5þþ555555555555555557lFFIKUkZfccfkSSSaiiZZUVxvvvUZjjZUvvUUvsyvUdvvXXvsIIzUvtvvdSaRjjSkkSaZjmffkTkVIKEFGGAA555555555555555595`,
    `llll5þþ555555555555555557OFYIKUkRRccfSSSafiiZZUVxxxxSZjmgUvvUUssyyzdvvQXvsIKzUxvvvUSfRcifkkSkZjmfRRSkZKKEEAAGG555555555555555595`,
    `llll5þþ555555555555555557OIIbbafQQXXfaSaffieZfaTgTgRbbmmgVvvSSyysssvvvXXvvIKUUUUUUSkkfcjfkSSTajmfRbWaRWWIJOhGG995555555555555595`,
    `llll5þþ55555555555555555AFIIbQRRQQccfakffRjifRYaTUUabbmmggvxSSttysyvvvXXvvKKVVTTTTTkkRcjakSSTammYYWWffbbIKOhFFll5555555555555595`,
    `llll5þþ555555555555599999FIIUgkfQQafaaZfQQbbRRWQgTUVIIWWagSUSTSSTSUUvvXXYWcXmmVkaabbRRWWaRkSkTfYWbRRafgZIJF9AGGA5555555555555595`,
    `llll5þþ5555555555555999A9FIIUgkfQQafaaZRXXWWYRbbgTVVIIbWaaaSfSTTTTggxxXXRYXXmmVSgabbRYWWRZakTTfYbQRRaaTZIJFAAGGA5555555555555595`,
    `llll5þþ555555555555599AAAFIKVakfQQafTgZfccWWQQRaaagVIKbWaaafWWkkTTgkbWffQQXXmmVagaRfXQWWccZkTTaRbbRRaaTZIJFAAGGA5555555555555595`,
    `llll5þþ55555555555559999AGIKUSkfQXakTgZficWWXQfaakUzIIWWfffRWWkkTTRkWWkRQQXXmmZfaZfRXXWWccfkkTgRQbRffZTZKJFAAGGA5555555555555595`,
    `llll5þþ55555555555555555hFIKUUafQQakaaaZccWWQQkkffbWIIWQWWWWWWkkTaQbfgaRQQbQQQjmaSaRXQWWccZkaggaQQRRijaVKJFh9AGþ5555555555555595`,
    `llll5þþ55555555555555555AEKKUTafQQakaaZZiiWWbQfSafXbKIbWWWWWWbkkTabbRfgfXXbQQQjjZaaRXXWWciZkaggaQQRRcigZK#EFlAGA5555555555555595`,
    `llll5þþ5555555555555þ5AAIKWWRkaRQQfkkkZZiijjRZfaafjmciRRRRRWfSTTkfQbfafYQQvssVcjXXaRRRQWccZSaggaQQRRciafbnILlFlA5555555555555595`,
    `llll5þþ5555555555555h5AFIIWWRkfRQQffTkZZeicjffaZaZmIciRRRRRWZSTTkaXbaaaRXbvvvViiWWfRRRQWciZSaggaQQRRceaZbWIIlFFl5555555555555595`,
    `llll5þþ5555555555555hhGEIIbWRRQQQQfTTkZZiibWZRciiiiiiiijRRYWaaTTaZimaaQbccmciciiIIRRRRQWeiZkaTaaQQWWiiafbbIKFFFl7555555555555595`,
    `llll5þþ5555555555555hhGEIIbWRRXQQQRTTaZZciWWRfjijjiiijjmfRRWZaTkfRjmZZQbXcmmmmjjIIZRRRWWjjZkTTaZQQWWiiZabbIKFFFl7555555555555595`,
    `Flll5þþ55555555555556hGEIIZffRQXXcfTTTgZiiccicRYImWWmIZZZRjjZaggWWjmZZQbvvvyyvvsbQcQQXiieiZkTTgZmmWWieZadZIKFFF97555555555555595`,
    `Flll5þþ5555555555555hhGEIKZfaRQXXcRTTTafjjiijjRWImQbmKZZZZejZggZbWjjRRbXvvvyvvvybbjeQXijjmZSTTgZmmWWieZTkZIKFFlh7555555555555595`,
    `llll5þþ55555555555þþ5AGGIIZfkZQXccfTagfZjjWWWWQQQQQWIIWWWYijZZZZjjWWQQvvvvvtvvvtvvijWQQXciZkTTTSmmWWieZUTZIJFFFl75þþ555555555595`,
    `llll5þþ55555555555þþ9AGGIKUfkZQXccfTkaZZjjWWWWcXQbbbIIWWWWjjZRZZiiWWXXvtyyyytttysyjjQQQXceZkTTTSmmQWieZVUZIJFFFl75þþ555555555595`,
    `llll5þþ55555555555þþ9AGOIKUkkZecccRTaaZZccWWWWicusssXXWWjjWWbWmmciWWjistyyyyyyyyyyxvmjQXciZSTTTTmmcceiZgUVIJFFll5þþþ555555555595`,
    `llll5þþ55555555555þþ9AGOIKUTkfeiiiRTTgVZccWWWXimusvvcXWWjjWWWWjmicWWImvyyyyyyyyssssvmjQXiiZkTTTTmmcciiZgUUIJFFll5þþþ555555555595`,
    `llll5þþ55555555555559AGEIKUTkfiicifTTagZccjjjmYYJJbbccIcImXjjjuueieivvyyxcXXQQbr##ssQXmeiiZTTTaZmmccieZgTZIJOFFhþþþþ555555555595`,
    `llll5þþ55555555555559AGGIKUTafiicifkTTgZccijimY?J#WbccjcjmcimmusmmmmvyyybXXXQbbn##uubQmjiiaTTTaZmmccieZVTVIJOFFlþþþþ555555555595`,
    `llll5þþ5555555555555þ9GELKUTffiiciZSTTgfImXX#o#J\$@ooJJXWYdvvvyyyyvvvyyyyynXQ#o#oo#o\$#IWWejfTTTUVKKmjQQZVUVIJlFFlhþþþ555555555595`,
    `llll5þþ5555555555555h9GELKUkafjiciZaTTaVImQX##oooo\$o@#zVVyyyssyyyyyyyyyysdYnJ#\$#\$\$\$\$\$mbnejaTTTUVKIjjQQZVUVIJlFFlhþþþ555555555595`,
    `llll5þþ5555555555559þþGGLKUTaZIIbWfSkaZZXX###\$\$oooo#o###bbsyyyyyyyyyyyyycj###oo#o\$\$\$\$oo#ieZkTgVVsuIIQQZUUVIJlFFll559555555555595`,
    `llll5þþ5555555555559þþGGLKUSZZKIbbfakafZXX####ooJKKJJo##Qbyyyyyyyyyyyyyycj#ooL#oJ@\$\$\$oJ#icZkTTSVtuKKQQgUTVIJlFFll559555555555595`,
    `llll5þþ5555555555555þþþELKUkjjSViiaSkabQJ\$##[&@Kmmu%mIKIYbyyyyyyyyyyyyyyElIImI%%mLL\$HMJJKKbbTTTTccQWXXgVTVKJlFFll559555555555595`,
    `llll5þþ5555555555555þþþELKUkjiVViiZakabQJo##+!@Jmmu%mmIotnyyyyyyyyyyyyysxxIImI%ujmL\$HMJJKKbbTTTTXXkYXcggTZKJlFFll559555555555595`,
    `llll5þþ5555555555555þþGELKZkjjvxijfkkTgZjIbr&&LIme##ejILsyyyyyyyyyyyyyyysuLmmi##jmL\$HEccccgTTTTTXXVxXXVgVUKKBFFl9955555555555595`,
    `llll5þþ5555555555555þþGELJZfjjvvijaSkTgZImW+%%LKcc##XXILsyyyyyyyyyyyyyyyysLIcX##iXLLEEccccaTTTTTXXVVXXVgVUKKBFFl9955555555555595`,
    `llll5þþ5555555555559AþGELJZfjjvxijfSkTgZmmbb^%#KccWWXXILyyyyyyyyyyyyyyyyysJKcWQWccIm%unWccaTTTTVcXVVXXVgVVIJBFFl9955555555555595`,
    `llll5þþ5555555555559AþGELJZfjjvvijRSTTVVmmrXuuLIcXWWXcLJssyyyyyyyyyyyyyyys#KcWWWccJr%ubXicaTTTTTXcVxXXggVVIJBFFF9955555555555595`,
    `Flll5þþ5555555555555AGGGLJZkRZKIijfSTTTUmmvvbQuumiWWXcusyyyyyyyyyyyyyyyyys%ucWWWciuuXbVVccaTVTTVVVccXXZVVVKJFFFl955þ555555555595`,
    `llll5þþ5555555555555AGGEKJUkkfKKijZYTTVUmIvvXQuummWWXXsyyyyyyyyyyyyyyyyyyysucXWWjcssbbVgicaTVTUVxviXQQZgVVKJFFFl955þ555555555595`,
    `llll5þþ55555555555559AGEKJUkkfIIejfdTTVVmIstxxYdYYXQgxttyyyyyyyyyyyyyyyyyytvURQXRdYYxxTVcXfTxVVVvxKKQbRgUVKJFFFl955þ555555555595`,
    `llll5þþ5555555555555hAFEIJUTkfIIjmfSTTVVIIstxxYYYYbbTxvtyyyyyyyyssyyyyyyyyvxTkbQRSYYxxTZcXkkxxVVsxKKQbfgUUKJFFFl955þ555555555595`,
    `llll5þþ5555555555559AAGELJUkkfQbKKfSTTgVIItvvxxSVVxTTxxtyyyvyy|||syyyyyyyvvxTTxVYYxxxxUZcXfSxxVVKKQQQbaVUVKJFFFll5þþ555555555595`,
    `llll5þþ5555555555559AAGELJUTkfQQKKfkTTgVIIvtvxTdTTTTTxxtyyyvyy|||syyyyyyyvvxxTTTYYxxxxYRcXfSVVVVKIWWQWgUUVKoFFFl95þþ555555555595`,
    `llll5þþ5555555555555AAGELJdTaRQQKKUkTTgVImXbvvYYTxxxTxttyyyvyyyyhzvyyyyyyyvxxTTTYYxxxviiWQRSTTfVccWQQWgVUVKoFFFA9555555555555595`,
    `llll5þþ5555555555555AAGELJdSaRXQKJZkTTgZIIQbvvllxTTTTxttyyyvyyytYztyyyyyyyvxxTTTYYxxxxicbbfdTTfZccQQQWgVUVKoFFAA9555555555555595`,
    `Flll5þþ5555555559959AAGELJzaaRXQIKUkgTUUIIKKvvtxxTTTTxxtyyyyyyyyvvvyyyyyyyvtxxTTTTvvlb#KbWfSTTZZccQQQQggVUK#FFl9955þ555555555595`,
    `llll5þþ5555555559959AAGELJzaafXXIKUkgTaZIILoyvtxxxxxxxxtyyyyyyyyttyyyyyyyyyvxUxTxxvvn+JKbWaSTTZZccQQQQggVUKoFFFl955þ555555555595`,
    `llll5þþ5555555559559AAGHLJzaafXXKKVkkagZII@JnrvvvvvvvyyyyyyyyyyyttyyyyyyyyyyyyyyyyyymIJ#WWRSTTZZicQQQQggVUKoFFFA955þ555555555595`,
    `llll5þþ5555555559559GAFHLJzaffXXKJVkkggZIIKKWbvtyytyyyttyyyyyyyyyyyyyyyyyyyyyyyyyyytmJooWbaSTTZZciQQQQggVUKoGGFA955þ555555555595`,
    `llll5þþ55555555575þþ9AGHLJUTkfccKJZfbbZZIIjeK#yvyyyyyyyyyyyyytyyyyyyyyyyyyyyyyyyyyys#JIIWWafbWWWiiQQQQaVUVKJGAA9þþþþ555555555595`,
    `llll5þþ55555555575þþ9AFE@#UTkfciIJZRQWZVILeeKJvtyyyyyyyyyyyytvyyvvvyyyyyyyyyyyyyyyssJJIKWWSRQWWWiiQXQQagUVKoGGAAþþþþ555555555595`,
    `llll5þþ55555555575þ9AAFEL#UkkfccJJZfQbZVKLejKKccsyyyyyyyyyyyccWWWWccxyyyyyyyyyyyysJIiiIIWWSfbWWWiiiiRfagTVKoGFFAþþþþ555555555595`,
    `llll5þþ55555555575þ9AFEEo#UkaZccJ@ZfQbZVLLejIIXzsyyyyyyyyyyyccWWWWcityyyyyyyyyyytyJIeeKIWWSfbWWWeiieZZggTZ##FFFFþþþþ555555555595`,
    `llll5þþ55555555559AAAFKKzdSakZicKLVZQQZVLLejjeKKXiyyyyyyyyyyyvyvTxyyyyyyyyyyyyysKKieeeKJakkRbWWWiiiefggaTZmmFFGþ9955555555555595`,
    `llll5þþ555555555599AFFJKUUSSkZicIIVZQbZVJLejjjKKnissyyyyyyyyyyvtxxyyyyyyyyyyyysuoKeeeeJJZSkRbWWWiiiifagaTZmmFFG99955555555555595`,
    `llll5þþ5555555555555OEKKZakafZeeeiKKWbZVKIijjjmmKKKJssyyyyyyyyttytyyyyyyyysznrKKejjeeeKJZSkfbWKIjiiikkgSTZmmFFG99995555555555595`,
    `llll5þþ5555555995555OELKUfkaRZeeiiJKWbZaKKijeemmIKK#uusssyyyyyyyyyyyyyyyyyssr?KKejjeeeJLZakaWWJKiiiikkgSTZmmYFG99995555555555595`,
    `llll5þþ555559AA995559EIKUkfRQWieiiJJbWgaccejeemjeiiiKJJ#ssyyyyyyyyyyyyyytsKKJJieejjeeeLoZakaWWKJeiiiafSSTZmIYFFlAAþþ555555555595`,
    `llll5þþ55555995995559EIKUkfRQWieeiJJbWaaciejeemjeeeeKKKJssyyvyyyyyssyyssssLJoKeejjjeeeKJZaaaWWKJeeeiaaSSzzmIYFFlGG55555555555595`,
    `llll5þþ5555555555555AEIKUSZRQQieieJKWWagciijeemmeeeeiiKKIIImbrtyyyyyccIIIIoJeeeejjjeeeLoZakabbKJeeeigaSSssbnIIFhlG95555555555595`,
    `llll5þþ5555555555555AEIKUkZRQQieieJKWWfgXcmmeemmeemmmmKKIIIIbrsssyssccKKKKoomeiejjjeeeJoZgSabbKJeeeegUSSssQWIIFhlF99555555555595`,
    `llll5þþ55555555555559ELJUTZRQQeeeeJKWWfkRZIIiejeiiKJL@oKXXXXIIKoLLKKXXXXXXo\$IJJKjjeeeeJ#ZaafbbKJeeeegfSSssQWIKFlGAþþ555555555595`,
    `llll5þþ5555555555555AEIKUTZRbQieiioKWWfkZVJ#eeeeeiJ\$\$\$oJXXXXjmKJKKK#XXXXXX#\$\$\$L@meeeeeo#ZaafbbKJeeeeZaSSsvQWIIFAGAþþ555555555595`,
    `llll5þþ5555555555555OEKKUSZfQbeeeeJKWWgkgVKoieeiKJMMMM#JXXXXXXXXXXXXXXXXXX##EEMELLeeee@#ZaafWbKJieeeZfSSvvQbIIFFG9þþ555555555595`,
    `llll5þþ5555555555555FEKKVTZfbWcieeJKWWgkUUKoieimo#MMMMooXXXXXXXcXXXXXXXXXX##MEEH\$LejeeL#ZaafbnKJieeeZfaSvvQbIIHEG9þþ555555555595`,
    `llll5þþ55555555555OEIIzZaaZZKKccejeeWQaaUdKoieIJuurrrroobbbbXXXXXXXXXXbbbb#\$cr&q%%JJeeJ#ZaafJoeeejXXKKfSTSaZIJHAAA55555555555595`,
    `llll5þþ55555555555OFIIUaagUUKKXcjjjjWWZZUdK#iiK@%%rrrroobbQQXXXXXXXXXcbbbb#\$rrq+^%LJejo#ZaZZKKieejXXK#ZSTTTZIJHGAA55555555555595`,
    `llll5þþ55555555555OFIIUSkTUdJKcXjjjjWWZZgUJJieKL@L%u#IoKbbQQQQQQbbbbbbbbbb#@LL^%LLJKeeJ#ZaQQJKejeeXXK#VSTTTZIJEFGA6þ555555555595`,
    `llll5þþ55555555555FFIIfSSTUUKKXXjjjjWWZZggKJiiKLLL%uIL@KbbQQQQQQQbbbbQQbbr#\$L@%%LLIJeeK#gRQQKKejeeXXKJZTTTTfIJHFGA6h555555555595`,
    `llll5þþ5555555555hFEIIZSSTVVjiXcjjjeWWQXZaUzIIiiJI^)^%rXIKQQQQQQbbbbbQbbK#rr%%%%LImeJKbbaZQQLJejejXXjmVTSTgZKoElFFþþ555555555595`,
    `llll5þþ5555555557lFYKIgSTZZZeeXcjjjeWWQQZgVxIIeiJL^(%^riLKQbbbbbbbbbbbWn##rr%%^*\$LieoKWbaZbbKKjjejXXejZfSTgZK#YFFFþþ555555555595`,
    `llll5þþ5555555557OIIVVSaTZKKXXjjjjjjKKQQZSVxJ@LLH+u^MMuuEM#oo#########MM^%%}MM{)+/@J@JUSSUJKejjjjjciiiKKaaaaVZmKFl9þ555555555595`,
    `llll5þþ5555555557OIIVdSaTZKKXXjjjjejJKWQZSVVJJoLr!u^MM()EE##o#########MM<ù-}MM{{!coJ\$JdUSUoJejjjejiiiiLKaZaTTZIIFl9þ555555555595`,
    `llll5þþ55555þþ556OIIZUTSaZjiXXjjjjeeKKWQgTVUJo+r]]--MM-)](MM%%MMMMME%uMMù:::MM]{HMr+\$oZTkZJJeeejjjciiiKKZgTaggIIFFhþ99þþ55555595`,
    `llll5þþ55555þ5577OIIVaTagZjiXXjejeeeJJWbZgVVJ@+r={{~MM]{{)MMuuMMMMEE](MMù:ùùMM{{EEr+\$oUSkZKJmejmjjciccKKZaSSagIIFF9h995555555595`,
    `llll5þþ55555577AOBIIagkfXXjeeejjemL\$\$\$o#ZggVJ@/r]]--MM]{{(MM<<||||_ù;;MMùù<ùEM{(*urr@#fkSZJJLLKIejiccceibbTaTgIKFFAll99555555595`,
    `llll5þþ5555557AAFFIIgTkfXXeiejjeemJo\$#\$oZRaVJ@[+**^^MM%]{;MM-:|||:(]((MMù{<ùEM{(^%M/\$ofkSZJJ@@JImjicijjebbTgTTIKzE9lll5555555595`,
    `7llll5þ5555555FFIIzUSkkRXXeeKKJJJJ??w&oonWZVJo[+IL**MM]{_(MM_::|:<<:=_MMùù{]EM^%ILuM@#ZSbWoo????#ooooIJKbbggkSVZIJFFFAhþ55555595`,
    `llllh5þ5555555FFIIddSSRRQXemJooo##Hww&\$#WWaVJoHqIL%%MM(_=_MM{_<<<::;__MM==](MM%%LLtsK#RRWWo#??w?##\$\$@@@onnxZggVZIKFlFA9þ55555595`,
    `ll77hþþþ555555FFIIUakSnbKJoJ[HHHHpPpPwoJQQZUJ#uuMEILEMMMEMMM]]={{{{{==MMEEEEMMmmuuoJQbQXXXJ#?[![ww/+/[[+@o@#UUgZIIBFFFG955555595`,
    `ll775þþþ555555FFIIZfkSYY###o&ENP&qDDPwoJbQZUKo%uGMILEMMMMMMMuu]{]]]]^^MMMMMMMMmmuu@KWWbQXXJ#?[+++!+!+++q###ozUgZKKEFFFGA55555595`,
    `777755555555ühlFIKZUddK#%%%%{{__==]]pwoJQQWbWnL#%^%^!rIIrrrrMMMMMMMMMMr+++LL!&uu^*LJQbKKQXo#uM%]]]))_{**%%%%L#UVZzIJFFA975þþ5595`,
    `þþþþ555555555OFEIKzzzz##^*-ÿ-:<_||__DHoobQWWWWJ#%%]^&HII++rrzMMMMMMzMMr+++LIrr%%**J#QbKKXX##MM]]{)<<_{)]]*%%L#xxVVIKFF9975þþ5595`,
    `þþþþ55555999hOIIUdo###uu=ÿ~}~~::|||<]%\$JbbKJQQKoMMMEu%%%rrrrrrrrr+++rr+++pu^%^%%##QQQQJImmu-<:::ÿÿÿ|_;ù;--{)úuLJzzIKYFF975þþ5595`,
    `7777555559AAlFIIUd\$###u=]-ÿ}ÿÿÿ||::<)%LonWLJQQK#ttEE~%%%rrrrrrrrrrrrrr+++N^((;^%\$#QWQWJLmmu-<<:_~}}|_;:}--::{u##xxK#zYF975þþ5595`,
    `777755555hhFlFIKdU\$#%%*:<<<<::ÿÿ|:<<:<^^mmJKQQWWI\$};]%MMMM^^]^u^u^^%*^^^EEMMMMu^@#QbIK+rtt--<<<<<<<<<<<<<<<:<)^%#oZUIKFhhhhh5595`,
    `llll55555hlFFYIIUz##-]{;<<<<<<ÿÿ<<<<<:]^Im@KWQQWK#uuu^MMME^^]]={={{{-]]]MMEEEE^^K#WnoJ++Mt]-<<<<<<<<<<<<<<<:<{*%\$#dUIIEFAAAh5595`,
    `llll55999hFEIIUxKJ%*||<<<::<<<ÿÿ{{<<)<ù]MzMtIIQQWXt%^u=_]]MMEEù||_MMEEMM=(ù_^%#oXXIoEErP)]{~ÿÿÿ~<<<<<<<<<<<<<:*%LoZZIIEEFAG99595`,
    `llllhhhh7llEIIUZJ#^}<|||<::<<<ÿÿ]{<<]:_ùMMMMJKbQQX%uus(|={MMMM|||;MMMMMM;_||^%ILQQo#EMMM]){:ÿÿÿ~<<<<<<<<<<<<<:-%\$JZRIIzMOFA99595`,
    `lllllllllFIIUUUZJ#*]||||<<<<<<<<<<<<<<<<}(EzzzKo##@#MM_=__ÿ}{:<<<<::::<<;;<)\$\$ooLJMMEEMM{{::<<<<<<<<<<<<=))~__-%\$\$RZZdIKHFGGA9lB`,
    `llllllllFFIIUgUZJ#uù||||<<<<<<<<<<<<<<<<~(EMMM######MM(ù=<<~<<::::<<::<<<<<)######MMEEEt{:<<<<<<<<<<<<<<{{{)_<-*##dZZZIIFFGGGA58`,
    `llllllllFFIIffQWJ\$%|||||MM<<<<<<<<<<<<<<};_=MMEEEMuuEM){{{<<<:||~ÿÿ~<<;<;<MM%%HMMMEE(((|<:<:<<<<<<<<<<<:22MM)~-*^%L#ZZIKEPFAl9þü`,
    `lllllllFFFIISfbWJ\$%|||||EM<<<<<<<<<<<<<<}ÿ||MMEEEM))EE-]]{__<:||~ÿÿ~<<;;;<EM~~NEEEEGù;||;<:|<<<<<<<<<<<:22MMú~ú-*%\$#ZYI#zEFll9üü`,
    `lllllllEmIYRSfmjo#%|}ÿÿùMM{ÿ<<<<))MM<<<<;;;;____;;;;;;;<MMMMÿ}_|::<{{{MMMM:<<:||<:||<<||<<<)ú{MMù;<~~ÿ]*DNMM::::{%\$oXQZVIKFGFGüA`,
    `lllllllFIIdRRUii##%|~ÿ:{MM{{<<<<{{MM<<<<;;;;~~~~;;;;;;<;MMEE:(__<<){{{MMEE:<<:||<::|ÿ::|<<<{){MMù(<<ÿ;{]NGMM::<:{%\$JQXZVIIEEFFAA`,
    `llllllFYmIdRbbJo%%=(~<{{rr]]<<<:MMMM:<<<<<<<;;;;<<<<<<<<__::MM{(_{]]MMME{{:<<<||)<<:ú~__:<<{{{MMMM={--{{rrMM{<:|ù%@JciZZIKEEFFA5`,
    `llllFlFYIKfRbbJ#%%ù]<){]rr]]<<<:MMMM:<<<<<<<((((<<<<<<<<_<<~GE]=={]]MMMM{{:<<<||)<<:ú~__:<<{{{MMMM={--<<+rMM]<:|ù%\$JccgfIKzEFFA9`,
    `lllFllIIYdRRbbK#*%--::{{MM+r=)<_MM]]<<<<<<<<<<<<<<<<<<<<<<<<ú{MMMMEMs{){<<<<<<<<<<<<<:<<<<<<<<<:MM__{{EMMM^*)<||ÿ%oJccYafZIKFGGA`,
    `lllFFlIIdfRYQbK#*]--::{{MMrr=]={MM{-<<<<<<<<<<<<<<<<<<<<<<<<~{MMEEMM;:<:<<<<<<<<<<<<<:<<<<<<<<<:ME__{]EMMM]])<||_%oJccRZZZIKEFGA`,
    `lllFFFIIffQXiiJ#{{--:<{{Mx++^^MMMM:ÿ<<<<<<<<<<<<<<<<<<<<<<<<<<{{)))))::|<<<<<<<<<<<<<<<<<<<<<<<<MM_={^rrMM]{{:|||%@JccciZZIIEFGA`,
    `lllFFFIIffXXiiK#{{--:<{{Mx++^^MMMM:|<<<<<<<<<<<<<<<<<<<<<<<<<~~ú{{{{{<||<<<<<<<<<<<<<<<<<<<<<<<<ME=]-^r+MM{:{:||}*L@ccciZZIKEEGA`,
    `llFEIIdffZXXiiK#]{:;~-{]MM++EMMM]]~~<<<<<<<<<<<<<<<<<<<<<<<:ÿÿÿ~<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<{]]]MM++MM]~ÿ~}}|%L@cciiZZZZIIEþ`,
    `lFFEIIdSkZXXieJ#{<:;~:::EM++MMMM((}~<<<<<<<<<<<<<<<<<<<<<<<:ÿÿÿ~<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<{)]^MMrrMMù}ÿ~}}<*##cciiZZZZIIEA`,
    `lFFEIIUkkRijKJ%u<;;<<<~~:^LLMM!qMM}}<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<:MMMtMM\$L^]:~<|||~)^%LKiiQQZZIIFl`,
    `OFFEIIfkkfijKL*;|;;)_<}}}%LLMt+!MM;~<<<<<<<<<<<<<<<<<<<<<<<<____<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<:MMMMMMLL^)};<|||~}{^LJiiQQaZIIFF`,
    `AFFYIIRkkZccKL%_<::{)<<:<^LLMt+!{{<_<<<<<<<<<<<<<<<<<<<<<<<<<<<|||:<<<EG<<<<<<<<<<<<<<<<<<<<<<<::^++MMLL%{}~~~~~~~*^@KiiQQfZIIHF`,
    `FFFYIKRkfRiiKL%ù<::{)<<:<^\$LMu+!{{<<<<<<<<<<<<<<<<<<<<<<<<<<)<<:|::<<<MG<<<<<<<<<<<<<<<<<<<<<<<::^!+MM\$\$%{ÿ-ÿÿÿÿÿ~{^\$JiiQQZZIKYl`,
    `OEmmdUfRicijKL%_<<<{EE<:<^rrL\$r+==ÿÿ<<<<<<<<<<<<<<<<<<<<<<EM{(<:ÿÿÿú<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=!!@L++*ù}-ME]-ÿ:ù]#oiiiiZZZVmI`,
    `OEmIUUfZiiijK@%<<<<{MM<:<^rr@\$rr==ÿÿ<<<<<<<<<<<<<<<<<<<<<<EE](<:ÿÿ-ú<<<<<<<<<<<<<<<<<<<<<<<<<<<<<_q!o\$++u<~-MM]-::_{\$#iiiiZZgZII`,
    `FFmIUSfZeiiiK@-}:<<{MM::<*MM@\$%%<<<<<<<<<<<<<<<<<<<<<<<<<<<{MM)<<<<)MM{-<<<<<<<<<<<<<<<<<<<<<<<<)_^%\$oE&<::{MM-<<|:)*%KKieijZUII`,
    `FFmIUfRZiiiiJ\$-|;<<{MM::<*MM@\$^]<<<<<<<<<<<<<<<<<<<<<<<<<<<{MM]:<<{{MM{-<<<<<<<<<<<<<<<<<<<<<<<<<<^%#oE&:ù:{MM-<<|:)-%JKiiiiZZII`,
    `FFIIURQXeiiiJ#u|<<<)MM<<:*MM\$#^]<<<<<<<<<<<<<<<<<<<<<<<<<<<{MM{;:{MMMM{-<<<<<<<<<<<<<<<<<<<<<<<<~:*%\$#HH::ù{MM]<<|<))%LJieieZfII`,
    `FFIIURXQeeiiJ#*_<<<)MM<<:]MM\$#uù<<<<<<<<<<<<<<<<<<<<<<<<<<<{MM{;{{MMMM{-<<<<<<<<<<<<<<<<<<<<<<<<ÿ}]%##HN::ù{MM]<<|<)~%LJieijZdKK`,
    `FFIIdRXQieimK#^ú::ùùMM{ù{{EEcc]}<::<<<<<<<<<<<<<<<<<<<<<<<<<::<<<<::<<<<<<<<<<<<<<<<<<<<<<~ÿÿÿÿÿ~~]%ccH&<:ù{MM]]<<<:)%LIiieiZdUU`,
    `FFIIURXQeeimK#^~::ùùMM{ù:ùEEci%|<::<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<~ÿÿÿÿÿ~~-^icH&<:{{ME]{<<<:<*oIiiiiffSS`,
    `FFIIURQQeeeeo#%{<<ù_EM{(<<{^@@%<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<~ÿÿ~~ÿ~ÿ-%ci^^;{]]ME)-ÿÿÿ~~*LIeiKKgTSS`,
    `FFIIZRQQeeimL#%:<<ù_EE]ù<<:-\$@%<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<~ÿÿ~~ÿ~ÿ-%ii%^({]]ME{;ÿÿÿ~~*LIeiLKZSkf`,
    `AEIIdRXQejKJ%^]~~~~~__ME{]]%\$\$%-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<:<<|<^%ii%]{]qq]{-ÿ-~<:<%LIjeLLZkkS`,
    `FEIIdRXXijJL%^{-~~~~__MM{]]%\$\$%(<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<:<<|_%%im%]{]qq]{-ÿÿ~<:<%@IjeJIZkkS`,
    `FEIIdRQXejJ#^*ù{ÿ~~~<:EE{]]%\$\$[q))))<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<|{&w\$\$%-{]qq]{-ÿ~~||{%oJeejjZaSU`,
    `FEIIdRXXejJ#*úù{ÿ~~~<:EE{]]%\$\$[P{{{{<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<|{&wL\$%ú{]qq]{-ÿ~~||{%@JeejjZaUU`,
    `lEIIURXXejJ#%{:{<<<<{{EM]{%%\$\$wN]{)ÿ<<<<<<<<<<<<<<<<<<<<<<<)EM<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<_<<<|_p?L\$%ÿ)(22--:_ÿ-ÿ}<%@JeeejZRKI`,
    `lEIIURXXjjJ#%{<)<<<<_=EM](%%\$\$wq^]]{<<<<<<<<<<<<<<<<<<<<<<<)EE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<)]]{=p?L\$%{](q2-::<ÿ-ÿ}|^\$KjejjRfKI`,
    `lEIInWXXjjJ#*{:{-ÿÿ|:<){!2%%Lowpq!^^:<<<<<<<<<<<<<<<<<<<~~~~Gs<<<<<<<<<<<<<<<<<<<<<<<<<<<<<:ÿ]^^!Pp?L\$%)!q(=:<~~~-ÿ}_*\$JLJjmRfII`,
    `lEIIbWXXeeJ#*{:{-ÿÿ|:<<{!2%%@o?pqqu^:<::<<<<<<<<<<<<<<<<~~~;Mt<<<<<<<<<<<<<<<<<<<<<<<<<<<<<:ÿ]^^PHwwL@%]!q__ù<~}~-ÿ}^-L@LImmSUKI`,
    `lEIKWWQQWWJ#*)<|<<<:ÿÿ-úqq]%@#wpqpq+_<~ÿ)<~~<<<<<<<<<<<<<<<<::<<<<<<<<<<<<<<<<<<<<<<<<<<<<<:-^+pqpwwL@MM!!_:<<<<<<<:){*%@KZRfaII`,
    `GEKKbWWWWWJ#*):|<<<:ÿÿ-úq!%%@o?pppp!^^=:=)<~<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<{{{-^^H>pýw?@oMM!!(<<<<<<<<:<:*%@KUYSUIK`,
    `GFEEIIWQWWJ#*):|<<<<<<);q+%%@o?pĀý[>p!^=]{MM<:<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<MM]%^%!>[ýýýw?@oMM!q_<<<<<<<<:|<*%JJUdUdKK`,
    `GFEHIKWQWWJ#*):|<<<<__=(2+^^@o?pĀwý>ûq%u]]MM<:::<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ME^^%uH>ýwýĀ??@oMM++_<<<<<<<<:|<*%JJUSUz#J`,
    `AGFHIKQQQeJ#]):|ÿÿÿ~<<<<{{++@@?pýýûûûû[[qq=}||ÿ~}~~|){MM<<<<<<<<<<<<<<<<ú<EE<<<<:|||;<){!qqppýwwĀĀ??@\$[+__<<<<~ÿ-ÿÿ~~~*%@Kdd##FO`,
    `AGFNLKQQiiJ#]):|ÿÿÿ~<<<<{{++Jo?wýýûûûû[[>q=;_ù{)~<<_={MM<<<<<<<<<<<<<<<<)=EE{{{{<<:|){]-!q>[ýýwwĀĀ??@o/+__<<<<~ÿ-ÿÿ~~~*%@Jzz##FO`,
    `9AAOEEKJii@#]=_|<<<<<<<<{{+/Jo??ûûýýýýýýûq=;tt^^{]^^q+({<<<<<<<<<<<<<<<<{^^uq+^^{]]]Mt**qq[ýýýýĀýĀw?@\$++__<<<<~ÿ-~~~~~*%@JJIEFF9`,
    `9997hlo#ii##]=_|____<<<<{]+[@oH?ûûýýýýýýýq^_ttuu^^%^pqs^<<<<<<<<<<<<<<::]^^uD+u^^^%^Mt**p>ýwýýĀûýýw?\$\$++__<<<<~ÿ-~~~~~*%\$@LLFlAA`,
    `9955hFEEJ@u%{{2!_<<~<<<<{{+???oowwĀĀýýýýpq^^2P>>qqqqpqqq)]{{<<~ÿÿÿÿ~ÿ{^^rqppûqqqqqqpqq%%p>[Āýýýýýwoo??[+_<<~<<<<<::::|{%LoHPAAFF`,
    `5555hAEELL^%:{q2_<<~<<<<{]+w??@owwĀĀýý[[++^upPû[[[[[ýpqq^u^]=)<ÿÿÿÿ~{]^uqpppûûûpýpp[q!uu+!>ýýýýýwwo@?wq+_<<~<<<<<:<<<|{%L@EFAAAA`,
    `555557FE\$\$%]ÿùt(ù<<~<<<<{]q&[?@#wwwĀý[qquuqpû[ýý[[[[ĀĀýýýqq+^{<<<<<:^^!qpppûĀûûûý[[[[>+Hs^ýwýýýýww\$@?>q!ù<<~<<<<____:|{%@@HFAAAA`,
    `555557FE\$\$%{ÿùssù<<~<<<<{]qD>?@#?wwĀý[qquuqýýýĀĀýýýýĀwwwwpq+^]_<___ù^^!ppýĀûý[[ûĀû>>ý>qEu^pwýýýý?w\$L?[q!ù:<~<<<<____<|{%@oHO9GAA`,
    `555579GE\$\$^-:{q!]{{:<<<<;)%%q?@#wwĀýww>!_u[>ýýýýýýýýýýýýý[q>MM:-_{]^!qqýĀýĀĀĀýýýýýýýýýpquu>wýýwwww\$@?p^^{)((<<<<)=ME<|]%@\$HAAA99`,
    `55557OFE\$\$^-:ù!!]]{{<<<<;)]]![\$#wwwýýý>+=u[>ýýýýýýýýýýýýý[ý>MMù~_{]^!![ýĀýĀĀĀýýýýýýýýý[quu>wýýwwww\$@?&(u{)((<<<<{{MM<:{%@\$OAFA99`,
    `55559OHE\$\$%]|:{)NN]]__ù(;;ù_+[\$\$??wwppq!uu[>ýýýýýýýýýýýýĀýĀ[MM_;_{]^!qýwĀýýýĀýýýýýýýýý[quu!pwwwwww\$@w&(]{((){{={2q()-ÿ-*L\$GGFFAA`,
    `55559OH&#\$^]||{]qq(=__ù(;;_|qw\$\$??ww[[!+uuw[ýýýýýýýýýýýýĀĀw[MM_;_{]^!pýwĀýýýĀýýýýýýýýý[quu+pwwwwww\$@wE(-{(()]]]]2q()-~ù*\$#EEFFAA`,
    `5þhh5EoL%%^-}~:)2Or+22;ÿ<;=sEEL\$?w[[[quu!>[ýûýwwýýýýýýýýýýý[MM_|<{]]qq[wwwwwýýýýýýýýýýý[qqu^q[wwww@\$tM;ù-]](G72q22)=<<)]^u\$oGEG5`,
    `5þhh5E@\$^%]{}~:)ND>p>qu]{]^uHH@#ww[q>>uu!>ûwýýýýýýýýýýýýýýý[MM_|<{^^qp[ýýýýýýýýýýýýýýýý[>qu^qqýýýwL\$MM={*^^(DNqq!+{;<<;ù^%\$\$GGG5`,
    `5þhhAE@\$%]|:}|:<{t!ûûû+!^^!PH?@oww[qq!^u!>ý?wýýûýýýýýýýýýýýýq!(_<_qpqpýýýýýýýýýýýýýýýýý[>q^uqqûýýw@\$wq]^^uqDqqqq^=:||::<{%\$@GGGþ`,
    `5þhhAEL\$%ù||}|:<ÿt!ûûû>q^%HpH?@owpqq+!us>pĀ?wýûûýýýýýýýýýýýýqq__<_qwppýýûûûûýýýýýýýýýýý[>p^u!+ûppw@o?p^u^uqp0qqqu(:|||:<ÿ%\$\$GGGþ`,
    `þþþþGEL\$*ÿ|;}}~~;]Hûûû>>qppPw?o@[[q+u^+pûûýwýýýýýýýýýýýýýýýý[q_=:_ûwûýwwýýýýýýýýýýýýýýýý[qq+uuqppwJo?pqqqqqqûqD2{:<|||||<%\$\$GGGG`,
    `þþAAGEL\$u~|}}~<<<]!Pûûqqqpppp?o@[[q+^u!ýûýýýýýýýýýýýýýýýýýýýûq=]{_pwýýýýýýýýýýýýýýýýýýýýý[pq%u>ppwJo?pqqûûûûpq+q]{<ÿ||||<^\$\$GGGG`,
    `þþAAGE@\$--~}~<CEs]u^qpqqppppp?o@[qq+^u>[ýĀýýýýýýýýýýýýýýýýýý>!^u==pwwýý[ýýýýýýýýýýýýýýýýw[qEsu&ppH@o?pûûûûqq>!u]^{MM|||:|*\$\$GFFF`,
    `GGGGGE\$\$(-~}~<2Es_(u!+qpppppp?oo[pENtt>wwĀýýýýýýýýýýýýýýýýýý>!^u=upwwý[[ýýýýýýýýýýýýýýýýw[[Esu&qpH@owpûûûp!+++^]^-MM||:<|{\$#EEFF`,
    `GAAEoo[Mu*~~__4Güü]^%%I@wwwww?rrwHstPH>ûýýýýýýýýýýýýýýýýýýýýw[!qME>w[[[[ýýýýýýýýýýýýýýýýĀ[[[q+uupEcr?ýûpýpmm%u^^!qqü:::<::u%L#EB`,
    `GGGELLH!u;úÿ<_2þCE=uusLowwwwwwccHHut&>ûýýýýýýýýýýýýýýýýýýýýýýý>qzM[ý[[[[ýýýýýýýýýýýýýýýýý[[[q+uuDEcr?ýpýwpmm^u^%&&!+ù::ù{;u%@oPB`,
    `GGGE\$\$%uq2{~;___ME+++!qpLLwwwwmmHHuu!pýĀýýýýýýýýýýýýýýýýýýýý[[ý[û[>[[[[[ýýýýýýýýýýýýýýýý[[[[[quuqHLJ?[ý?mmww>!!!N&]])){{++^u@oHF`,
    `FGGE\$\$%u!ü((;<__EE++!!>+LIw???mmEHuu!pĀĀýýýýýýýýýýýýýýýýýýýýû[??Āû>[[[[[ýýýýýýýýýýýýýýýý[[[[ýpuuEELL?ww?mIwý[!++qN(={{{tüü^u@oFF`,
    `GGGE\$\$%ú{sN+{;<<{{{{]u+>[[[?LoHHuspqûýwwýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýý[[û>MM??L#?[ýý[>p!%%*]]{]=!Gu(**LoOF`,
    `GGGE#\$u;;(+r;{<<{{{{{uq&!![wL@wpstp[ýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýý[ýû>zM??@Jw[+!+r++)ú]]{{{(+2u(u%L@7N`,
    `GGGE\$#&E;(+!+q{:{{{{]u^u%u^%\$o?ýû>ûûwýýûýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýwý[>ûû??oouMuuuu(()-{{::!!!q](q[\$@üü`,
    `GGGE\$#wEs;rrrr{{====^uuuttsu\$#?wûûûĀwýûûýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýww[[ûû??oosMuuu^uuu^{{::r+!+)(![\$@üü`,
    `A9GE\$#&&_{-ú{{]]r++!!qqq08H?o#?ýýýý[ýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýûû??#@?ýqpppq!!q!!]=]{{ÿ)=qHo@üü`,
    `A9GE\$#&2_{{-:{{]+qqqq>q>qq[w##?ûýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýûûw?\$@H[ûûp[pqqq+r::]{{{{]qHoo7O`,
    `A9GE@op2=={{::ú--{]]!qûqqwoJ??wĀýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýûý?w@@rr/ýp>qru(_:~}{{]]]]qw@@FF`,
    `A9GELowp=={{_<~ú}ÿ__+++!q?JJ??ĀĀ[[[[ýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýûý?w@@rr!qp!!r=}_:}}ÿ{]^^]q&@@FF`,
    `FlGE@\$wpqD^^{:||||<<_=^utu@@?w[ûýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýûpw?@@EHHH%%^]<~_<~ÿ{]Dqqqpp@@OO`,
    `FlGE@\$?pqq^^]{<ÿ|<<<=]uuMt@o?w[ûýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýww?@@HHHHu^]{:ÿ<<ú-^^pqqqpp@o7B`,
    `FhGH\$\$?pûqqq!q)~<<<{]u!!q?@o?w[ûýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýĀwww@owwýp!!]:<}~--*qq>ûûýpw@o2N`,
    `FhGN\$\$?wûûpq+q]]<<){]uqqq?@o?w[ûýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýýwwww@owwwpp2{:<}~-*^!pýûûýww@@üN`,
];

const SMILE_ROWS = [
    `0011220000111111000010011100000100011311000011111111435677879A5566666677BB66CCDD22222222013333330303333012033333331111CCCC33DC0B`,
    `001022000001110000220001100022000001111101001100100000EEEEFFEEFFFFFFFFFFGAFFCCDD44642222011333300300330011033333331111CCCC33DC0B`,
    `000000000000000000000001000022220000000000001113CD335HIJKKLLJLKKKKLLJLKKKIII7778B7333000111333111133130311111333331133CCCC3D003B`,
    `0000011111000001000000000000DD1000010011DD0011BBHFEFEMIKKKJKKKKKJKKKKKKKKIIKEENFFO0B33030111031111CC1111111011111111DCCCCC3D033B`,
    `0000DDDDCCDD22DD220000000000DDDD222CCCC8DCDD338PIKIIKKQQRSTTUUVWQXQQYZZaSRQQKKKKJKB9BBBB113120002DCCDD2DDDDDDCDDDCCCDC4433DD233B`,
    `11DDDDDDCCCC24CDDC11CCDDDDDDDDDD222DDDC88C4467BFIKKKKKQQZVZZZZZRQQQQZZZZRRQbKJJJKKEEEFOB33BB2CCD22DDDDDDDC33CCCCCCCCCC4430DD2033`,
    `1100DDDD333044CCCCCCCCDDDDDDDDDD22D22DC888487FIKccdVVVZZaZXWccceQQQQQQXQfffaSgaaWWKIIKFh11BB3333222DDDDC3344CCCC44CC44443D2222DC`,
    `0000DDDD333344CCCCCCCCDDDDDDDDDD2222DDC887BOOFKIccUVggSSafXWiccjXQQQQXXQfSkkSgggWWIIIKMEFFBB3B00222222DC3344CCCC44CC44443D2222DC`,
    `00202DDD333344CCCCCCC1DDDDDDDDD00222DD335EKKKJYgZZZgTTSSgSgZZZZZijQQfgaaSkSkSTggaZZZWWIIIIBBB342246222D133CCCCCCCCCC444430DDDD00`,
    `0000DDDD333344CCCCCCC1DDDDDDDDD0022D113lOEKKKKZaTTkkSSaaZZZZZZZZjjQQRafaafffSSagggVVWWIIIIFHBB44446622D133CCCCCCCCCC44443033DD00`,
    `0000DDDDD133CCCCCC3333DDDDDDDDD2222D113EIIQQRUaaSSSSSabQQQQQQQQQQQQQQQQQQXWbaaaaTVgVgZZZImIIBl13336622333333CCCCCC4444444433DD00`,
    `0000DDDDD133DCCC1130DDDDDDDDDDD22211BBBEIIQQfakaSSffZZYXXXXXXXQQXXXXXXXXXQWWZZfaagTTTVVVKIIKFFlBBB6622333333CCCCCC4444444433DD30`,
    `0000DDDDDD33DC4433DDDDDDDDDDDDD2113llGIJbQfakkkkSgeieeZgaaaRRRbQRRffkkkSSSjjjjXXXXaTSTTgagWWIIFOBBB3DDD1033333CC4444444444CDD066`,
    `0000DDDDDC44CCCC33DDCDDDDDDD00001B3lFEIKbQkkkSSSSZejjjfkTTfRRRQQRSkkkkkkSkmImmXXXXZaSTkkTTnWIKFFBBBBDD2003DD03CC4444444444CDD366`,
    `0000DDDD4CC4CCCC4DDDDDDDDDDDDD001B3BLoQQZZkSkkkfQbfgZZSSTSSfWbRfRSSSSSSSSkYfSfRRRRQXkgTTTTgZWWKKPOC6DC0003DDDC44334444444433DC03`,
    `002222DD4CC4CCCC4DDDDDDDDDDDDD001l48JLQXakSSRRSRXXSSaaSSSTaRWWfSSSSSSSSSSSSSSSkkSfXXRaTTTTUZWWIIpHq6BB0033CCCCCC334444444433CC03`,
    `002DD0DD4CC444C4CCDDDDDDDDDC33336CKJbXaakkSgQQfRkkkkTTSSSTXXRffaSSkkkkSSSSSSkkkkSfRRXXgTTTTgRZnWKKEB33110333CCCC46444444CC433334`,
    `0100D0DD4CC4444DDCDDDDDDDDDCBB3B27KKbQkkkkSfQQRSSSkaZZSSSgXcffTTkSkkkkSSSSkkRfffSfRRbQaTSSTTSTbrKIEB331103CCCCCC46334444CC433034`,
    `00112DDD44CC444DDDDDDDDDDDDC66lFJoWQstSkSfWWRRSSSSaRQXRkaaffffSSkkkkSSSSSkSgjjiiaSffRRRSSTTTTUsuIIBB2611DC4CCCCCCC3344CCCCCC4011`,
    `0011DDDD44CC444DCCDDDDDD22DC66hOKJQYsvSkkRWWkkSSSkfRXXZSSaZZSSSSTkkkSYRRYSSfmmeeafSSSkSRdSSTTUuuIKwEq811DD4CCCCCCC3344CCCCCC4011`,
    `0000DDDC444CCC44CCCDDDD1222D677NJJxtvRSRkRRRkkSSkkXXRfSSkfQcfaSSSSSkkaXXRkSSRfkfijffkkkkWWTTTUsuWWIIH66400DCCCCC4444CCCCCC444210`,
    `0000DDDC444CCCCCCCCCCDD1222247EEoLtsvSSYYYRkSSSSRRQXRkSSafXcfaSSSSSkkRXXRkSSSkkammffkkkkkWTTTUsuWnIIP888111133CC4444CCCCCC444431`,
    `0000DDDDDDCC444CCC44CD00222032JKYUtvYRRYRkRkSSkfimRfSSkZQQfRSSSSSSSSSaSggWkkkkkkafcjSkkkkTTTTUssssIIENN8BB11CC44444CCCCCCCCC4444`,
    `0000DDDDDDCC444CCC44DD002203l2IKdSyvdRRYRSSkSfRRjmRfSSkaXXaaSSSSSSSSSSTTTYSkSSkTTaiiRSkkSTSTTUssssIIEEHN331BCC44444CCCCCCCCC44CC`,
    `0000DDDD24CC444CCCDDDDDDDDC8G8IKYSSSSYWRRYvvdZXcRRffSSSfXXfSSSffSSSSSSTgbQRSSSkkTaRRXXaSSTvxSTSSfaWYIIFB8846CC44CC4CCCCC44CCCC33`,
    `0000DCDD44CC444CCDDDDDDDDC87A8IKdkSSSRWRRYvvSZXcRRSSSTabXcfSSSffSSSSSSkZQQRfRSSkTgfRWQfkSTvtdSSaaSWnIIF8CC22CC44CC4CCCCC44CCCCBB`,
    `0022DDDD44444444CDDDDDDDDD889AIKdSSkSRRRRYvvRfWQRSSSSgbXRRRfSSSSSSSSSSVVfRcXRSSkTgWWZWfkSSyvTSSaaaaZKIHN8822DC44444CCCCCCCCCCBBB`,
    `0000DDDC44444442DDDDDDDDDDCOGEJKYSSkRRSSRYvvRRWQSSSkSVXXWRRfSSSSSSSSSSVVafcXZSkkTgWWfYfSddtyTSRbaSaZJKHE2822DD44444CCCCCCCCCCBBB`,
    `00002DC4444444DDDDDDDDDCCC6EIKUUSSSkWWRSvvTZiivsSSkkTZXXfSSSSSkkSSSSSabbZZccZSkkkSxxXXRRvyyykfXXaSSSUVJJ878C33DCCCCCCCCCCCCCCCC1`,
    `00002CC4444444DDDDDDDDDCC86FKIUSSkaRYWSTxvgZQjvvSSSSSaXXakkSSSkkSSSSSSWWZZccZUSdSUxxXXRRssyvgaWXaSSSSZKJE78833DCCCCCCCCCCCCCCCC1`,
    `0000DC332444DDDDDDDDDDDD336EIKUSTfccfkxxSSTZWevvdYvvdZejaaddSSdddSSkSSWWgVmmZUvvUgvxXXRRyvTUgabQafSSSVKJOO3300DCCCCCCCCCCCCCCC3B`,
    `0111DC334444CDDDCDDDDDDD136FKKUSTfccaSxxaaZZWjvvRYyyTgijaaSSSSRdSSSSYYQWVzmmVxvsUUvxXXafyvTUgabbafSSSVKJE73300DCCCCCCCCCCCCCCCBB`,
    `0001CDCC44444DDD44DDDDDD3O9EKKUkTZccaSSSSZijZZSxxtsyTZijVUuuTSssssSSssQQssmmVVvsssSdRfmmRSTSTVjjgaTSkZJJEO6CC8CCCCC8CCCCCCCC3BBB`,
    `2000DDDC44444DDD44DDDCCD3EGFJKfkSZccaSSSSZijZfSVxvvvTZejVduuSSssssSdssQQssmmfdvsssSSkfciRkSTTVjjfgfZSZJoEE23C8CCCCCCCCCCCCCCBBBB`,
    `200022DD44444DD8DDDDDCCD6BIIWQRfcWXcZfSSSgiiZfkSUVVSbbmmVVssSksssssvvsQQssmmdSSSTdSSkkciRkSSaVjjfZQXaaWWJIE311CCCCCCCCCCCCCCC8CB`,
    `220022DD44444DDDDDDDDD226OIIQQRaXQjmfaSSaZieZfYfagaSWWjmgUssSkvssssvvvXXssmIUdRkSSRRkkciRkSkkVmjYYWXggWYKIE301DCCCCCCCCCCCCCCCCB`,
    `0000222DDCDCDDDDDDDDDD666CIIUakaQQZZaaaRXXQXRfQXaSTVIIWWgTSSSkkkkkddxvXXRYXXjmfkkkQQkRWWRkSkSTRRbbYRaaZZKIE811334444CCCC44CC4CC8`,
    `0000222DDDDDDDDDDDDDDD666BIIUTkVQQfaaaaaXXWWRfXXSTSVIIWWgTSSagSSSSgTxxccRRXXmmakkSXXaRWWffYSSTSRQXffgaTVKIFB313B4444CCCC44CCC4C8`,
    `0000DDDDDDDDDDDDDDDDDD33h8IIZTTgQQSSSaaZeeWWQXfaSaVVIIWWggaaWWkSkTVVQXfaQQXXjmSkSSaZXXWWccfaTTagQXffaaTVJIFN33CCCC3444CC33DD34C8`,
    `0000DCCCDCCDDDDDDDDCCC33l8IIVTTgQQSSSaaZeiWWQQfSSgVVIIWWgkkgbWkkkTSfQXagQQccmmfSSSagXXWYccZfSSSgXXfffgTVJIEO33CCCC34CCCC33DD34C8`,
    `0000D4444444DD4DDDDCCC469OIIgkTgQQSSaaffiiWWQQRSkgQbmIWWWWWWWWkkkaQbaRSVQQQXXQjjSkaZXXWWccZaSSSgXXRfeiaZIIEF30CCCDCCCCCCCC33CC8B`,
    `0000D4444444DC4DDDDDDC627OIIUaTgQQSSaaffiiWWccRSkgQbIIQQWWWWXikkkgQQffSgQQXXXQjjkkaRXcWRccZaSSSfQXRfeigZKKME!0DDDDDCCCCCCC33CCCB`,
    `0101D4CC44444444CDDCC86BLKWWfTkaQQSSSaaaijjmRZfkTVcIccRRRRRRRfSkkgQQakabQXsystejXigaSZQWccZfSSSaQQRfjcagWWKJFB110DDCCCCCCC3DDD33`,
    `1001D4CC44444442CCCCC86FLJQQfTkZQQSSaaaZiicmRafakVcmccRRRRRRRSkkkgXQaSfZQQssssiiWcggafQWccRfSSSgQQRfjeagWWKJDB110DD8CCCCCC0DDD03`,
    `120024CCCC4D444444CC66hELJQQRZQQQQkSSakZiiQbfZciiiciccciRRRWRSkkSZcmkaXQccmcccXcmIVgaZQQccZfSSSgQQQQiifTWWKLOOBBDCD4CCCCCC33CC3B`,
    `000144CCCC4D244444CC66hFLJQQfZQQQQkkaakRiiWWRRciiicccceiZZRiZSkkaZmmkaXXicmiijjjmmZZZZQWccZfSkSgQQQQeefgXQKL0BB111D4CCCCCCCC443B`,
    `1101CCCCCCCCDD4444CC33BGLJZfaZQQiiZTTTaZiiciiiYYmIWbmIZZgZeegSkkWWmmggXXvyyyyyvvQQcQXWccccfSagkUmmQQeiaTkVJL0BB133DCCCCCCCCCCC33`,
    `1111CC44CCCCDD44443033BG@JZfaZQQceZTTTkZjjjjjjRWmIQbIIgggZjjgkaabWmmafXXtvyyyyvvQQcWRWccjjZSSgkVmmQQiifTSUK@0BB133CCCCCCCCCCCC3B`,
    `1101CC24CCCCDD4444CC657GLJUSSaQQcigTgagZjjQWWWXXQXQQIIQQQQjjZkagjjWWWWvttvvvvvvvvvccWWQQiiZgkTkgmmQWiifSTVJJOB3303CC4CCCCCCC4103`,
    `1101CD44CCCC444444CC657NLJUSSfQWcegTgnSYjjQbWWiXQXQQIIbQQbmmZaaajjWWXXtttvvvvvvyyyccWWQQeeRkkkSUmmQWeifSSVKJOB33DDDD4CCCCC44413B`,
    `0011D444CC444444CCCC6567LJZSSfjjijgkTgVZccQQbWjcvyysccbQIIWWWWmmccWWImtvyyyyssyyyyttmmQWeeZfkkSdmmiiejZTTVJJBB3022224CCCC444333B`,
    `0111D444444244CCCCCC5567LJZSSZjeieakTgVZccQbWYjIsyyvccbWmmWWWRXIciWWmIvyyyssyvvttsvymmQWeeffkkkUmmiijeZSTVJJ0B3022444CCCC444333B`,
    `000344CC444DDCCCCCC8876FLKUSSfjeiegaTTVVccjeiIRdo#cXccIcIIcKjjuujjjjvtyyzXXXQQbYJJvvWQmjeeZSkkkVmmiijjaUTVJJD810226444CC44413303`,
    `033344CC444DCCCCCCC8876GLJUSSfjeijgSTTVZcciiiIRZ##WWccIXmmXIjjuujjjmtyyybccXQQbYoovsQQjjeeZSSSkVmmccjjfUTVKJ28102264443344410333`,
    `01332444444444CCCCCC697F@JZSSZjeejZSTTTVIIccJ#o#\$L\$#oKQWbbvsyxsytyvytyyyyijj@\$o#o#ooo#YZijZSSkkUJLjjXQZUTVJJ26300224443344CCDDDD`,
    `01332224444444CCCCCC656G@JZSSfjeimZSTTTUIIcco\$\$o\$\$\$\$ooVVTyyyvvyyyvvvtyyyynWWoo\$\$\$\$\$\$oXWRejZSkkSSKImjXXZUSVJJ863100DD444444CDDDDC`,
    `1100DDD4444444CCCCCD886G@JUSSaIKbXZSTTTVXX#\$\$\$\$\$o\$oo\$o##bbttttttvvttvyyyXc#ooooo@@\$\$\$\$\$#jjaSkkST%%ooXXZUgVJJ86310DDDCCC444DDD130`,
    `330000D4444444CCCCCC886O@JUkSaIKQQZSTTTVXXo\$\$#\$oIIIIKK#obbvtvvvvvvttvyzxXe#o@oKKII\$#\$\$@oejakkkST^%J#XXfUgVJJ84311DCCCCC444CCC13B`,
    `11030DDD4CC44444C42C666G@JUammvvjjZTTgXX#L\$#!H\$Jee%%jmL#xbyvtvvvvvvvtyyszEJImm%%mI\$LMM\$oJ#bQkkkUiiYWXXfTgVJL00111DCCCC4444443333`,
    `11110DDD4CC44444C4C8666E@JUamjxvieZTTgXQ\$oo#q&\$Jjj%%jmJ\$ybvttvvvvvvvtysuME@Imm%%emL@MM\$oJJbQkkkgccbWccfTgVJJ30110DDC444444443333`,
    `00DD0824CCC4DD4444C8657ELJZajjvvieaSTggVeoQcq&\$Jmj##ie@oyttvvvvvvvvtyyysss\$Imm##eeLLMMXXcefRYkkVccxvccZTTVJJB3110DDD444444CCCC3B`,
    `0024C344CCC4DD2444CC657G@JZajjyyieanTSSVmIbru%#Jcc##jiJ@yyttvvvvvvvtyyysys\$JXX##je\$LMMcXiedkkSkgccvvccZTgVJJB3B102DDDD44CCCCCCBB`,
    `01DDCC44CCC4DD4444DD877H@JZgjjysieaYTSSVIIQX%%\$#ciQQXXI\$yyttvvvvvtvttvyyyy@JXQXWXXL#%^WbiiRkkkVVccvvccVTVVJJB61B0D2DDDD4CCCCC8BB`,
    `0001CC44CCC4444444CC877G\$JfgmmtyieaRTTTVIIXX*%\$KcjWWXXJLyyvtvvvvtttttvyyyy@JcWWWXXLI%uYXeiRkkkVVicxvccVSVVJ@B61102DDDCC4CCCC88BB`,
    `0000CC44CC44444CCC88657E@JUkdVJsciaYTTgVIIvtXXu%mmWWXc^(yyvvvvvvtttttttyyt%%iWWWie%ujixvmcRkxxYfxvciccfUgVJ@031102DDCC44CCCC88BB`,
    `0100CC44CC44244CC888597E@JUkSV##ciZWTTgVIIsyXX%%mmWWXQsyyytvvvvvtttttttyyysuiWWWeI^^eexxmcRkxxSdxxjiQXZUgVJ@001102DDCCCCCCCCCC3B`,
    `000044444442D44CC888338E\$JUSSZ##ciaWTTTVIIsyvvYYYYXQVxvtttvvttvvvvtttttvyyvtdYQbYdUYvvxxicfSxxSfvvooWWgTTVJJ010002DCCCCCCCCCCC3B`,
    `010024444444C44CCC88l38E\$JUSaZ##ciaWTTTVKIsyxxWWWWXXxxvtttvvtvttttvvtvtvyytvVkQXYddYtxxxjcfkxxSfvs#JWWZTTVoJ010002DCCCCCCCCCCC3B`,
    `0011DC4444444444CC88888E@JUSaZXX##aYTTTVKIsyxxxYTTTdTTxxvvvvvt)-_(vvttvvvvxxTkdTYYdYxxTxicaSxxSU##XXWbfUTVJJ01110DDCCCCC4444443B`,
    `0011DC44444444DDCCC8877E@oUSaZXX##gSTTSVKIsyxxxYTTTTTUxxvvvvvt=)_(ytttvvtvxxTTTTYYxxxxTxiiZSxxSZ##WQWbfUTxJJ0B110DDC444444441133`,
    `200022444444444444C866BG@JdSTgXX##dSSSSVKIYWvxYYTTTTTTxxvvvvvytsbxyvvtttxvxxTTTTYYxxxxmmXXZSSTSZicQQWbaTTVJJB133008C33CC44CC3333`,
    `0133334444CC444442DC66BG@@USSgXX##dkSTSVJKQXtxYnTTTTTTxxvvvvvvtxYxvtvvttxvxxTTTTYYxxxxXXXXfSkSSdieQQQbZTTVJJB13300DCDDCC44CC3330`,
    `1133DCCC44CCCC442DDDBB7E@@USagXXo#USkkTVLLJovvxvTTTTTxxxtttttttvdvvvvvvvtvxvVTTTTTxtYn##XXfSkkTUiiQQQQaTgxJJ001102222D24DC4133B0`,
    `1133CCCCCCCCCC442DDDBB7E@JUSSaXX##UakaTVLLooyvvvTTTTTxxtttvvttvtvvvvvvvvtvxtVTTTTxttdn##cXaSSkSdiiQQQQfTgxJJ000102222D42D84133B0`,
    `003346CCCCCCCCCDDD08C87E@oVSSgXX##VakaTVLL\$#WWttvvtvvvvvttvvttttttttvttttttvvvvvvvyymj@#XXRkSSSfieQQQQfTgxJ@qD0000222444DC4344B3`,
    `00B346CC44CCCCDDDD00C87E@JUSTgcc##UaagTVLLo#WWvttttvvyvvtvvvttttvvtttvttttttvvttvyysjm##ccakkkSReiQQQQfTgxJ@q20003444444CC433300`,
    `003BC8CC4444CCDDDD24667NLJUSTgcc\$#ggQXaVLLie#ottttttttttvvttvvvvttvvvxtvtttttvtttvysKJIIbQffcbbWiiQQQQgTVxJ@2DD222664C4444443D00`,
    `000333CC4444DDDD2D22657OLLUTTgcc\$#ggQQgV\$\$eeooytttttttttyycxvvvvvvvvvcxttttttvttvyysKJIIbQfaQWbWeeQQQQaTVxo@2DDD24664C4444243D00`,
    `00DD3C44444DDD222D22667E@@USgVic\$\$UVQQgx\$\$eeo#cmyyvvvvttvycmXXbbbWXXmXdtttttttttvtJJieL@QQafQWbbeiijZfgVVVJ@2DDD22CCCCCC42DDDCDD`,
    `00113844444DDD22DD6466NEJJUTgVic\$#UVQQgx\$\$eeo#XbssyvvvttvvbXiiYYWWccjzvvttttttttvsJJeeLLXXaaQWbbeiiiRSaVVV#JD8CC42DDCCCC44DDDCCD`,
    `0333C8CC444444DD221B6EJKVZTkTVic\$#VgQQVx\$\$eeeiI#XIyyvvttvvyyyyvtxxvtsyyvvtvyyyvyoJeeeeL@UkSkQWWWeiiiZaSgVVmIFOCCDD22D444CC4444CC`,
    `0033C8CCCCCC4444DC1B5EKKUaSSSVicooVVQQVx#@eeeiJoYKyyyvvvvyvyyyvxxxvyyyyvvvyyyyttJJeeeeJoUkkkbWbWeiiigkSgVVmIFO8C2D22D444CD4444CC`,
    `0033C8CCCCCCCCCCCC67hEIKVkSSSgeiiiLoQQgxJ@jeeemm####ssyyyyyvttttvvyyyvvvtyytnnJ#eejeee@\$USSTbWo\$miiiakSTVVIIFB3046DDDDC4CD64CC44`,
    `003344CCCC88CCCCC867lEKKVkSkaVeeee@JQQaVo@jjeem#####ssssyyyyvvvyvvyyyyvvyysunn##emjeeeL\$dSTgbWooeiiiakSTUVIIFO3366DDDDC4CC44CC44`,
    `0133DCCCC8666CCCC8889EKIVkSVQWeeeeLLQQRVcXjeeijmjjjmKKo#tyyyvvyyvvyyyyyyysJJJoieemjeei@\$VTTVbW@\$eiiiZSSTTVIIEF968CDDDD4444CCCCC8`,
    `0B3308C8CC666CCCCCC89ELIVSSgQbeeeeLLQQaVXXjeeemIjejjKKJ#vysssstyyyysttyysuJLJoeeemjeeiL\$VTTVbW@\$eiiiZSSTUzKKME8688DC444444CCCCC8`,
    `00CC0CCCCCCCCCCC4CCChELKUTTVQWeeeeLLQQgVccjeeemIcceeQrKJ#III+byvyyyscXKKII@@ieeeemjeeiL\$VTTVbW@@eiiiaSSYssWRIKH40BDC44CCCCCC44CB`,
    `00CC3CCC8CCCCCCC4CC8hEJIUkTVbWeeeeLLQQgVXcmmjemIccmmieKJKKKI+nssssssXXKKKK\$@mieejmjeei@\$VTSgbWo\$iiiiaSSYssWbILF60BDCCCCCCCCC44CB`,
    `00CCC8666CCCC8CCCC88hEJKUkSgbWeeee@LQQgVUxILeeccccK\$LLKocXXcmmLLLJLLXXcXXX\$\$\$\$@@jmjeei@\$UkSSbXo\$eiiidSSYstQWIKEB6666CCCCCCC444C8`,
    `01CC88466CCC88CCCC88hELKUkTgbWjeeiLoQQgTTx\$\$ieciico#\$@JocccXmmJJ@oJJcXXXXX\$\$\$@\$\$mmieei@\$UkSaWbo\$eiiidSSYstQQKJEB6466CCCCCCC444C8`,
    `013B8C4666CC88CCCCC89FLKgkTgbbeeeiL@QQgTgVo\$eecXKKttsuJoccccccccXXXXcccXXX\$\$w[[[LLjeei@\$VkSSbb@@iiiefkSSstQQKLE862C8CCCCCCC444C8`,
    `113BCC4666CCCCCCCCCD8EJIUkaVbQjjei@JQQgTgVo\$iecX#ouuu%JJcccccccccccccccccc\$\$w[!&##ieeiL@gkSaWboLjiijVUdSssQXKJE866CCCCC88CC444C8`,
    `11CCCCC88CCC4DDDD66E##xVgVTVo#ccjjemQQgTgVo\$iiLo%%rrrr@JbbbbXcccccccccQbbb@\$Im!+%%ooeiL@dkkao@jjjjXXJJUSSSaVKKE833DDDCC666C444DD`,
    `11DD44CCCCCC4DDCC46FKIUagVTVo#cXjjjjQQgTgV\$\$ieL#%%rrrr@Jbbbbccccccccccbbbbo\$rr++%%ooei@\$dkSg@@mjjjXXooVSTTkVKKE830DDDCC6CCC4DDDD`,
    `0130DCDD44CC44CC46lEIIUkTTTVooccjjjmQQVTVVo\$ieL#\$#%^#i@JbbbbQQQbQQQQbQbbbb@\$I\$%%LLLoee\$\$UZcc#@mjjjXXooUTTTkVKLH3302222CCCC44DD22`,
    `11300DDC44CC44CC46hEIIdkTTTV#ocXjjjjQQZVVUo#ciL#\$#%uoJoJbbbbQQQQQQQQQQbbbWo@L@%^LLIKeiLoVZXX\$@mjjjccJJUSSSkVKLE3302222DC4442DDDD`,
    `01000DCCCCCCCC88465EIIUSTTgVeiXXjjjjQQijVaUx##mj\$#%*%%ccKKQQQQQQQQQQQQbWo#cc%%^^LLmmL@nWggXX\$@mjjjWYiidSSSTVKJMl112622DDD4DDDDDD`,
    `000308CCCCCCCC8867hFKKUkTVUVeeXXjjjjWQQXVTUVIIme\$#%%*%ccJobQQQQQQQQQQbWYo#cc%%]]L@mmL@bbggXX\$@mjjjWYicUaSSTVKIMF236644DDD4DDDDDD`,
    `0000C8CCCCCCCC88hC##UUSTTVJ#XXmjjeei\$@XXVTTVo\$\$#EE^-EE*-+!JJ@@\$\$@@@LLLMM(]{}N2]|!H@@@oVUTVL@eejjjjcccX@#gkTTUxKIPC662444444DDDDC`,
    `00014444CC444488hAKIdaSTTVJJXXmjjeeeL@QQVTTVo\$@orru-EE]}!qLL\$\$@@@@@@LLMM(|;}N&)|!io@@\$VSTV@@mjjjjjccccoogkTTTVIIHC664444444DDDDC`,
    `0000DC4444442446hBIIdaSSTVeeWQmjjjee@LQXVTTV@\$+r*:;)HE]};;H&^uwHHHHr(uMM)|;;GG==MMrr\$oVSTV@@mjjjjjcccco#gkTTTVIIO86411224442DD03`,
    `0000DD44DDDDDD46hBIIUkSSaZeeQQmjjeee@@QQVTTVo\$rr:};)EE]}<{HEu^&&&&H+})EM-|;;&N=(rrrr\$oUTTV@@mjjjjjcccco#ZZTTTVIIG82200224444DDDC`,
    `2200DD44DDDDDD3368IIdSSVXXeeeeejje@LLLo@VTVxo\$rr<<({EE];<<EG_};;)(<<;;MM]);;NP__]*rr\$#VTTV\$@\$\$\$IiicccciiccUTTVIIF76600034443DD10`,
    `0000DD44DDDDDD3397KIdkSgXXjjejjjjmLLLL@@Zagxo\$+r{))(HE(;;<EG||;;;;}};<MM-);;EP__*^sr@oVTVV\$@\$\$\$IeiccimeeccSTTVKIEE8C10014443DDBB`,
    `0000DDDDDDDDD6lFIKZZfTTgXXjiLLLLLLww&&@@WWgVo\$>rLo])HE-<<<EE(_;;;;<<__MM)<;<FN_)IIsM@oVgWWo\$??[?@@@@JmLLccaTUUUVKI86CD208CCCCC1B`,
    `0022DDDDDDDDD63FIIZSSfZZXXjjLLLLL@ppp&L@WWgVo\$pHIL**HEs;<<EE;_;;;;))__MM]___EN]uILu^ooVZWW@\$///wo@@@L@@@ccVVdUTVIKN6CD20DCCCCCBB`,
    `00DD2DDDDD2D679EIIdSUfYWo@Jo/H&&HH&ppH@@ccVxo#%]HMKKHEEEEEME(_;;;;_===MMMMpEEMIIu%\$JWQQQXX@@/++!r++c+++r#\$LLUTUVIKB8880BDCCCCC88`,
    `002D2DDDDDDD699FIIUSUaYn#@\$\$+&HHHHH&p&L\$QQVxoL%*pELLMEMMMMMMuu==__==^^MMMMqEEEIm^%ooQQQWQQoL/>++rrrrrrr+\$\$L#VVUVKIEFq83BCC44CCC8`,
    `00D22D2DD2DC7AccIIUkSV##%%%%{)==__==qH@\$QQWWWQo#u]%*rrKLrrrrMMMMMMMMMMrrr+oo[EMM%%ooQWKKQQ@@uM^***]]==]*%%%%##UUVVKKPDD8DC44CCC8`,
    `00DDDD2DD2DC6FmmzdxUUd##%-));<))___(Hp\$\$QQWWWW@@%]]]rrLLrrrrMMMMMMMMMMrrrroorc*%%%ooWWLKQQ#otM-*))<<__)*]]*u##xUVVKKHPDCDC44DDDC`,
    `00002222D265lFKIVV\$\$\$o%%{)((~~())___:*\$oQQLKQb@LMMMM-**%rrrrr+rrrrrrrrrrrr^^==*^#JQQQQLIiiu%;;<<;;<<))))-]])*uo#VVKKHNN6004442CD`,
    `01302222CD65lFKKZV@#\$#%]))(()))))___<^\$oYYLLbQJJMMMM****crrrrrrrrrrrrrrrrr](;s**#oQWQWoLeiu{<<<;;;;<))))-]-]<*\$#xxKJEEO7332444CD`,
    `0133DD224466hFIIVZ@\$%%**))))))))))<_<<)^eeLLQQQQK#{{]]EEEE%^^^]]u^**--^^MMEMMMu%ooQWL#rrED]])))))))))))))___<}%%##UVKKF74222CCC8`,
    `0003DD2D6669hFKKVU\$L])<<)))))))())<_<<<]ieLLQQQQK#{{]]qEHH{_______{{<<_ùMMMMN&(^JKRRLJrrMG]])))))))))))))___<<<%\$#VVKKO84426CCC8`,
    `0001330066AMLJxx#\$%*<;<;)))))));))))__<(1Pu%KJQXQQH^^]^%^%ONNN=|__EEEEEE{{{{]*JoWQKKEHrr]=-)(())))))))))____)))%\$#VZIKEN8C228CDD`,
    `0001000046AMIIVx##%-;;;;)))))))<))))))<)xtEEKoXQQQ^%us==_ùEEEE(__;EEEEEE<<__*%JIWQKKEHME])--))))))__))______)))%\$odZIKEHPN22DDD2`,
    `0011004467JJVVVxo#%-;;;;))))))))))))))<;)-EEzzJo@@#@MM(_;;())(};<<-u----;<<<IIIIIIwHHHMM{)))____==__))________)%#\$RRdUKJ&DDD3300`,
    `0001006648IIVgVVo#*;;;;<;:))))))))))))__<)EEMM#ooo\$@rE(_;;;;;;;;<;<<{{<<<<<:\$ILLKJHFPPMM{)______==))))_ù]]*%__(^##YZUgKKHNCC3300`,
    `0000233368IIggQWo\$^;;;;<ME)))))___==______--EEEEEEu^EM]_;<|};;;;~~))))__;<MMu^EEEEH!^{)<))____))__)(;;(=+!EE))ú*%%#\$VZKJHP83038D`,
    `1001033l6AIKgaQbo\$*<;;;<EE)))))___={______))EENNN&;{q&(ù))__;;;;;;))))__:<MMs:+EEEH+_|}}))____<<__)(;;]]r+EE))~*]%\$\$fZKKEFDB038D`,
    `000023hFIKUUgViio\$*<))-]EE--))))__MM{{____)):)))==<<]]{{EMMM};;<;;__==MMME*]<<<<){{{==____))))tM___(;;-^r+EE)<))]%\$\$QXVVKKNN88CC`,
    `000003hFKKUSTZei\$#u<))-]ME--))))(=EM()____){:{{{))<<){{{OMEE;;||;;____EMEE]<<<<<{{<<))____))))tM____<<-*r+EE)<==]%@\$QQVVIK8N888C`,
    `0011465FKKUabWo#%%]())**rr**))<;MMMM)<____)))))){))____)]]]]MG__;;){EEME*]{)<;;<))==úú____))))MMMMù)úú)urXEM)<<<]%@\$ccVVIKGODCDC`,
    `0201666FKKUgbW\$#u*])))**rr**{)<:EMME]:____)))))))))____))){{EE(___({MEME*]{)<<<<))==))____))))MMMM()))=urc22)<<<]%o#ccVVIKHE2DCC`,
    `000062JKZZUgbWo#%---))**MMrr{)|{EE%*{)___)))))))))))))))))===(EEEEMttM]-{{))))))___)))______))]-MM(_<<2MMq(^--<<{%##ccaUUVIKH864`,
    `000342KKZgRYWWo#%;--))**MMrr{)}(EE**))___)))))))))))))))______EEEEEttM{{))__==_____)))______)){{MM(_<<AME!(*--<<<^##ciagTVKKH864`,
    `000B68KKUZXXiio\$%()-))]*MMrr**MEMM*<))))))))))))))))))))______()){]))(__________________)))))){{MM;;<]rrMM**-(;;<*##cciiZVIKH8B6`,
    `001l4FKJZZQXieo\$%;)-))]%Mzrr**MMMM)<))))))))))))))))))))______<;<<--))__________________)))))){{MM;<<]rrME**-);;})##icciZVKKEEN8`,
    `1l1OIIdYggQXejo\$*ú;_<<)*MMrrpHMM;)<<___)))))))))))))))))))))<;;<=={{))<<________________)))))){{<{_)MMrrMM%-));<<*\$\$iiciggVVIIq6`,
    `1l1FIIUSSaQXejo\$-ú;_;;<*MMrrMMMM;(<<___)))))))))))))))))))))<<<<==))))))________________)))))){{<=({EMrrME%)((();%L@jcciZagVIIF7`,
    `3llOIIdSSVcj##%%);));;;<}%@@MMrr&!;;<_))))))))))))))))))))))<<;;;<____)))))))))))))_____)))))){{!qttMMLL%**)<<<<)*%u#oiiQQgxIIEA`,
    `77lFIIdSSgimoo%*)}));;;<;%\$\$MMrrEM:;<_))))))))))))))))))))));;;;;;(___))__)))))))))_____))))){{{MMMtMMLL%);;;;;<<<;%\$\$iiQQgVIIEG`,
    `7AlOIIdSdgii#\$%*-;))<;<<<%\$@MMrr*<<<))))))))))))))))))))))));;;;;;;<<<))))))))))))))))))))))))){{]rrMM@@%{;;;<;<<<)%#\$ciQQgVIIEG`,
    `AGFFIIdSSaii#\$%*]<))<<<<<%\$\$MMr+]|<;))))))))))))))))))))))));<<;;;;<<<(]){))))))))))))))))))))){:{rrMM@@%{<<<<<<<<)%#\$ciQQgVKIFE`,
    `5EKKUgSgeiiiJ#*]{)){EE))<*+r@#rr{<))())))))))))))))))))){)ME<<<;;;<<{{MM{{)_______))))))))))))){{{rrJorr%)<)NNu*<<;^#oiiejVVVVII`,
    `5EKKUTSZjiiiJ\$%)))){EE))<*rr@@r+{<)))))))))))))))))))))){{EE**<;;;<<){ME{{)_______))))==))))__)){{rrJ@rr%:;)EM-*<<<uL\$ciieaVVVII`,
    `9EJKUSUZeiico#%;<_))EE{);*MML\$%-<_))))__))))))))))))))))<;=(EE-<<<<ùME%*{<____)))))))___))___)))));^L@Er]-{{EM*;((<{*%##iiijVVII`,
    `9FKKUSSZeiico#*};_))EE));*MM@\$u{<_______))))))))))))__))<;;:EE)|__<ùMM]))<____)))))))________)))))(u@@Hr<<){ME*;;;<)-%\$oiieeVVII`,
    `hEKIUaWQeiii\$#^;(_<)EM));*MM\$\$u)____<<))))))))))))))____))<:EE(<<{EMMM))______))))))<_______)))))))%\$\$Hq]]**ME*;;<<<)%\$oiiieaVII`,
    `hEIIUgQbeiiio#%=__<)MM();*Mz\$\$^<____))))))))))))))))____))<;EE(<<{MMMM{)______))))))<_____)))))))))%\$\$Hq]]**ME*;__<<)%\$oiiiegg#K`,
    `AGIKUaQWeiimL#%)))^^MM;;<{Mzii*<)())))))))))))))))))________])))_{]]]]))______))))))))__))))((((úú)umm&&]]**ME-;))))<%\$oiiiegaUU`,
    `AGKKUgbWeiimL#%)))^^ME<;;)MEmi%<))))))))))))))))))))__________))_){{))))______))))))))__))))((()úú)%mm&&]]**ME*<()))<%o@iiieYUST`,
    `AFKKUgbWeeimo#^{))**MM<<<<{^\$@%;))))__)))))))))))))))_________==)))))))))_____)))))___=)))))((()))]*mm%-))]]ME-<;))){%\$@iiLoVTTT`,
    `GEIIUabWeicmo\$u]))]]GEù<<<<*@@%;))))____)))))))))))))_________==)))))))))___)))))))___=)))))()()))]%mmu]{{){MEu;;)){{%@@ciLLVTTT`,
    `GEIIUaQXeiJ\$%%*]<<<:=]NE]-<%@@%<))))__))))))))))))))))__))==))))__)))))))=____))))____))))))))))))]^mmu-ù{+c**~~))){]%\$@iiLLVTTT`,
    `GEIIUaQXci@\$%**]<;<<_{GE]]<%@@%;))<<))))))))))))))))))__))==__<<____)))))=____))))__))))))__))))))(%mm%-|^+r**~~))){-%\$LiiLLUTTT`,
    `GEIKUgQXci\$\$%*]{;;;;_^NE]-<%@@rr*-))))__))))))))))))))==))))ùù]]))__=)))))))__))))))))))))____))<)EE##%-<]+r**)(;;){-%@\$iieeVTUT`,
    `GEIIUgQXci\$#%]])<<;<_^EE]-<%\$@>>*-))))__))))))))))))))==))){%u]]))__=)))))))__))))))))))))))__));{HE\$@%-<]+r**((;;))-%o\$iiejVTUV`,
    `EEIIUaQXci\$\$%]()))))__EE]]:%@@>q]-**))))))))))))))))))));}<;MM]]___)))))))))))))__))))))))))))))<{HE@@%)<_+r<;;;;;)))%o\$ieejVVim`,
    `EEIIUaQXii\$#%-()))))__NE))<%@@[!==**))))))))))))))))))));}<;MM)]___)))))))))))))__))){)))))))){{_=&E@@%{{src<<;;;;())%\$oiiejVVim`,
    `GEIKRRXXie\$#%-)*~~))__=]+&{%LJp!!D*---)))_))))))))))))));;<;MM**;__)))))))))))))))))))))))))))**qqPE@@%]+!*-))}};(;<]%\$\$@@jjVVim`,
    `GEKKWWQXjj##%-)*~ú))__<)qq{%@L[>!p]_<<úú)_))))))))))))))<<<}MM**<__)))))))))))))))))))))))))))-%+ûPH\$\$^]!!*]]-));(<<-u##LJmmVVIm`,
    `GEKKWWWWWW\$#u)__)))))(-úq&{*LJ[>>pqr<<~~<<))__))))))))))))<;*-**))))))))))))))))))))))))))()ú)q+>qûH\$\$txq+-*--))))))-{%%\$#UUUVII`,
    `EMKKQQWWWW\$#^)__))))))úúqq<*JJ[>>q>r));;<<<<______))))))))<<**%*))))))))))))))))))))))==))====p>>[>H\$\$st!!u*))))))))-)<%\$#dkUVKL`,
    `GEEEJJbWWW\$#u)<<))))))<;q!;%LJ?>>>!!++]_<<MM<<))))____<;____]]--))))))))))<<))))))))){MM{{]]!!+>/>>&\$\$st+qu*{)))))))<<<%\$#dTTVJL`,
    `AGGEJJbWWW\$#u);;))))))<<Dr_%JLw>>/!+++u_<:EE<<(()(____<<__)))))))))))))){{<<{))))))){{EE{{{=+[!>/>>&\$\$tt+D**{)))))((;<;%\$#dTUV#J`,
    `5AFNooWWWc##%)<;())))))<{)+HJL[[>>!!++++!r])<<;;;;<<<;!G{_))))))))))))){{;ü!]-;;<;;<{{]-r+!!>[>!/[qH#\$w+****{)))((((;<)^##dSK#EE`,
    `7A9NoJWWcc##%)<;)))))))<)-0wJJ/[>>!!+++!!q]{;:<<<<<<<ùEM{_))))))))))))){{{EE]];;;<<<{{]]r!>>>>>!/[qH\$\$[+****{)))((((<;)%\$#dS#olA`,
    `6959BFKKcco#%)<<))))))==_^2wJL/>!!////!!>q{{tt]]]]]]!+]{<_==)))))))))){){{]*q+]---{{MG]]+!>>>>>>/[qH\$\$[+-***))))((~~<<)^\$\$#JFO3l`,
    `7955A6KKcXo#^<__))))))))ù^qwo@/[>>////>>>q{{tt^^%%%%++]=<_==)))))))))){{{{]^p+]]--^^st]]+>>>[>>>>ýqH\$\$[!****{)))()(()))%\$\$o#O533`,
    `7A66lFFE@ou%]<qr{)))))))ù]![[w##w/////>>>q]{+q!qqqqqq>+r]{))))))(()){{**++!q>p!pqq!qq!u*+>>[[/>[>&oo[[p!**{)))))))(())<%\$\$wpB333`,
    `8766lFEE\$\$%*]<q+{)))))))_]![pH\$\$/>////>!!q*-!!>>qqqqq>>+***:))))()){]]*%+>>>>>>[>>>>>!^^+!>[>//[>&\$\$[ppq**))))))))(())<^#\$&83333`,
    `DDD8BOFE\$\$%-]]u()))))))_=(+>q[\$\$[/////>!^^>>>>>q[[[>>>qpqqqq**))))))*%Hq![qq[>>>>!!>>pHMu^+>>>/>>&\$\$[qpq*]))))))))==));^\$\$H82664`,
    `22DC3BlE\$@%--](s{))))))_={+>>w\$\$[/+///>!]]!!!!>>>>>>>>>q>>>!**))))){*%pp>>!>>>!!!+!!qqpMs)+>>>//>p\$\$wqPq*]))))))))==();%\$\$H82644`,
    `D22DC8lE#\$%{)]rr{)))))))){*^!w\$\$[/+/!>[!]]!///[[[[[[[/[[!!>!tM{)))]%r+!!///[>/>>!!/[[[>p^]!>////[&\$\$w&(]){))))))){M8<<)%\$\$O88CCC`,
    `2D2D88lE\$\$%))-rr;){)))))){]]qw\$\$[///>>>!=]!/+//[[[[[////!!!+MM;)))]^+!!////[//>>>>>[[>>q^]!>>///>p\$\$[Es)<<<<))___ùE2<<(u\$\$86CDC8`,
    `DDC887GE\$\$%*<<])qH(<<<){))ù_q[\$\$[>>>>q[q=^!>////////////!!!+MM^_)){*++!!///>[[>>>>>>>>>!^^!!!!//>p\$\$pE(];<<<)(_(EG*(<;;u\$\$Fl0388`,
    `DD6687EM\$\$u-<<)^HE=_ù_{{))ùùPH\$\$[[>>>q!!(u+[///////////[!!++MM^_)){%+!!!/[///[>>>>>>>>>+^^!+>!>>>&\$\$[E(]<<<<{)((GE;<;<;u\$#qE0BBB`,
    `DC665E\$@%%^-();*OFr!!+(<<<<(MM@\$wpqqp+^u++!!//////////////!!MM^_<{{]+!!!/>///[[[[[[[[[[+rrtuq>[[p&\$@uM)=:<_(EE+qOE;<;;;u%%\$\$PO77`,
    `C8655E@\$%*-*((<*rr+q>>{<<<]uME\$\$wpppp+uu+!!!//////////////!+Mx(_<{*u+++!>>///[>//[[[[[[>!!suqqpppHL\$sM]=;<__GHpûrr;;;;;<)%\$\$NOAA`,
    `88777EL\$%-));;;<]u+ûq>>r]s!HpH@\$wpppp!^^+!!!////////////////++^<<;+/>>!!>>>/////[[[///[[>!suqqpppH@\$wp(===qqPppq*-<;;;;;<%\$\$NA55`,
    `88797EL@%-));;;;]u+û>>>rusqppH@\$pppprr^u+!!!////////////////!+u<;;+/>>!!>>>/////[[[//[[[>!uur!HppH@\$[pu]^^ppppqq]:;;;;;;<^\$\$OGA5`,
    `O755AEL@%)((;;<;)%û[>>>qqqpppH@\$ppqr^^!!qq>!////////////////+!^<;;!/!!//////////>/[[[[[[>q!r%^pppH@@[pqpppppPpqq]{;;;;;;|*L\$EFAA`,
    `7755AEL@%))(;<;<)*P!>>>>>>qppH@\$ppqr^u!!>[>>////////////////++^<;<+/!!/////////////[[[[[>>!r^^pppH@@[pqqqqppPp!r]{;;;;;;|*L@GFAA`,
    `A75A9E@@^-;};}qq(*uu!!>>>q>ppp@\$ppqruu+![[//////////////////!+u_<)!///!!/////////////>[[>>!Eu^PppH@@[pqqqpppHq^{]^MM;;;<;*L@EFA9`,
    `7A5A5ML\$%*<};;qPs^(]rrp>>[qppp@@HqMrxx+>[>//////////////////!+u]{]![>/!!///////////////[[>!Eu^+!HH@@[pqqqqprrr)ù]^MM((;<;-\$\$HEqO`,
    `OO5E##&u%*-;;<qDqq(ú)%##>[pppHrrEp(tEE/>////////////////////>!++BE!///+////////////////[[[!!pD^]FEccwpqqppmIu;_ù!+++};--)<*%JJFF`,
    `AO5E\$\$!+%*);;<+2qD{ú)^##ppppHHrrEE%t+/[>/////////////////////>!!MM!///////////////////////!!>+u=HEccwp>pppIIu__ùO&rr}<--]{)%LJ+F`,
    `O79E\$\$%%rr](;;_ùEE+++>!HII/pHHImEE**+!>>/////////////////////+!!++/////////////////////////[>!u_HE@\$Hp[wmI[ý>>!+H&(-úú){Eq)%JJrF`,
    `O75E\$\$%*rr({;;__EE+++pq[IIwwHHImEE^u+!>/////////////////////++/////////////////////////////>>p^_EM\$\$[p/[II+>>>++Eq;<úú);q+{%JJFO`,
    `A95E\$\$%]]]!!)(;;|_(({)rr>[+w@#wHsu+!>!///////////////////////////+++///////////////////////[>q+rxt??##+//+/[/r*]]-)){)q!)-)%JJHB`,
    `AAAE\$\$%])]q!;(;;_____(q!qq!M\$\$wqu^>//////////////////////////////+++////////////////////////>[>+ttpw@\$+++++++q(;<<));;qq]]%%JJHB`,
    `GGGE\$#Hx;uqqqr<<______==*u%%\$\$w[!!>+>//////////////////////+////////////////////////////////>[[qq>[H\$\$uE_=__ù_}<);))rqqq**NMLJHB`,
    `FGGE\$\$HM;*qqqr__(_====^^tt%%\$\$[>>//>>>/////////////////////+////////////////////////////////[[[qqqpw\$\$%x====]]]]=_{{rqq+**EMJJN6`,
    `AGGE\$\$HO({ú--)_=p>pppqp>EMMM\$#[!//[/[[/////////////////////////////////////////////////////[[[[[>p[w\$\$wpqqppqqppHN**()--<*EEJJN7`,
    `AGGE\$\$pq((ú~()_=r!!!p>qqqpHM##/!!!//[///////////////////////////////////////////////////////[[>>>q[w@\$Hpqppppppq!P**((<<;*HEJJO6`,
    `AAGE\$\$[q-)));;;<**]]!!qqq[\$\$w[+!!!///////////////////////////////////////////////////////////[[[>ppH\$#rr+pppqq%]]]<<()<<<*EEJJE6`,
    `AAAE\$\$[+]=));;;<<<_ùrr++!w\$#[q>>!!//////////////////////////////////////////////////////////////>ppH\$#rr+Hqqq+*-))<<))__;:HHJJ86`,
    `OFGE\$\$[+>+]);;;;<<__={:_s%\$\$w[>>>!//////////////////////////////////////////////////////////////>ppH#\$EEEr*%]-)-))<<<ùr!!pHHII86`,
    `FFAEL\$[>>!]==)<;;;___ù:|s^\$\$/>>>>>[/////////////////////////////////////////////////////////////[ppH#\$MEEr]]{{;<;;<<((PHpPHHILE7`,
    `AFFE\$@[>qp!+!N<<<<==)(+!>w\$\$[[>>[///////////////////////////////////////////////////////////////[wpH\$\$/![Hpq));(;;<*qH&&ppHHIJ6F`,
    `AAFEL@[>>q>>!p**__==<%>!>w\$\$[[>>[///////////////////////////////////////////////////////////////[ýpH\$\$+![[ûp();(;;-*ppppppPEKLEE`,
];

// Pre-parse palette to RGB
const PAL_RGB = PALETTE.map(hex => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
]);

// Find pixels that differ between the two frames
function getDiffPixels() {
    const diffs = [];
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const ni = CHARS.indexOf(NEUTRAL_ROWS[y][x]);
            const si = CHARS.indexOf(SMILE_ROWS[y][x]);
            if (ni !== si) diffs.push({ y, x, from: ni, to: si });
        }
    }
    return diffs;
}

function drawRows(ctx, rows) {
    const imageData = ctx.createImageData(W * PIXEL, H * PIXEL);
    const d = imageData.data;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const idx = CHARS.indexOf(rows[y][x]);
            const [r, g, b] = PAL_RGB[idx];
            for (let py = 0; py < PIXEL; py++) {
                for (let px = 0; px < PIXEL; px++) {
                    const i = ((y * PIXEL + py) * W * PIXEL + (x * PIXEL + px)) * 4;
                    const char = rows[y][x];
                    d[i] = r;
                    d[i + 1] = g;
                    d[i + 2] = b;
                    d[i + 3] = (char === 'l' || char === '0') ? 0 : 255;
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function drawBlended(ctx, t) {
    // t=0 → neutral, t=1 → smile
    const imageData = ctx.createImageData(W * PIXEL, H * PIXEL);
    const d = imageData.data;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const ni = CHARS.indexOf(NEUTRAL_ROWS[y][x]);
            const si = CHARS.indexOf(SMILE_ROWS[y][x]);
            const [nr, ng, nb] = PAL_RGB[ni];
            const [sr, sg, sb] = PAL_RGB[si];
            const r = Math.round(nr + (sr - nr) * t);
            const g = Math.round(ng + (sg - ng) * t);
            const b = Math.round(nb + (sb - nb) * t);
            for (let py = 0; py < PIXEL; py++) {
                for (let px = 0; px < PIXEL; px++) {
                    const i = ((y * PIXEL + py) * W * PIXEL + (x * PIXEL + px)) * 4;
                    const charNeutral = NEUTRAL_ROWS[y][x];
                    const charSmile = SMILE_ROWS[y][x];
                    const isBgNeutral = (charNeutral === 'l' || charNeutral === '0');
                    const isBgSmile = (charSmile === 'l' || charSmile === '0');

                    d[i] = r;
                    d[i + 1] = g;
                    d[i + 2] = b;

                    // Simple crossfade for alpha
                    const alphaNeutral = isBgNeutral ? 0 : 255;
                    const alphaSmile = isBgSmile ? 0 : 255;
                    d[i + 3] = Math.round(alphaNeutral + (alphaSmile - alphaNeutral) * t);
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

export default function PixelGirl({ scale = 0.25, emotionTrigger = null }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const tRef = useRef(0); // 0=neutral, 1=smile
    const [smiling, setSmiling] = useState(false);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (canvasRef.current) {
            drawRows(canvasRef.current.getContext("2d"), NEUTRAL_ROWS);
        }
    }, []);

    const triggerAnimation = useCallback((target) => {
        if (animating) return;
        setAnimating(true);
        const start = tRef.current;
        const startTime = performance.now();
        const DURATION = 400; // ms

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / DURATION, 1);
            // ease in-out
            const ease = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            const t = start + (target - start) * ease;
            tRef.current = t;

            const ctx = canvasRef.current?.getContext("2d");
            if (ctx) drawBlended(ctx, t);

            if (progress < 1) {
                animRef.current = requestAnimationFrame(animate);
            } else {
                tRef.current = target;
                setSmiling(target === 1);
                setAnimating(false);
            }
        }

        animRef.current = requestAnimationFrame(animate);
    }, [animating]);

    const toggleSmile = useCallback(() => {
        triggerAnimation(smiling ? 0 : 1);
    }, [smiling, triggerAnimation]);

    // Watch for external emotion triggers
    useEffect(() => {
        if (emotionTrigger && emotionTrigger.t) {
            // "happy" -> 1 (smile), anything else -> 0 (neutral)
            const target = emotionTrigger.emotion === "happy" ? 1 : 0;
            triggerAnimation(target);

            // automatically revert to neutral after 2.5s
            const timer = setTimeout(() => {
                triggerAnimation(0);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [emotionTrigger, triggerAnimation]);

    useEffect(() => () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            fontFamily: "'Courier New', monospace",
        }}>
            <div style={{
                position: "relative",
                transform: `scale(${scale})`,
                transformOrigin: "bottom center",
                width: W * PIXEL * scale,
                height: H * PIXEL * scale,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center"
            }}>
                <canvas
                    ref={canvasRef}
                    width={W * PIXEL}
                    height={H * PIXEL}
                    style={{
                        imageRendering: "pixelated",
                        display: "block",
                        filter: smiling
                            ? "drop-shadow(0 0 16px #e8a8b860)"
                            : "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
                        transition: "filter 0.4s ease",
                    }}
                />
            </div>

            {/* <button
                onClick={toggleSmile}
                disabled={animating}
                style={{
                    padding: "8px 24px",
                    background: smiling ? "#7a2040" : "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(4px)",
                    color: smiling ? "#ffd0d8" : "#ffffff",
                    border: `1px solid ${smiling ? "#c06080" : "rgba(255,255,255,0.4)"}`,
                    borderRadius: "16px",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    cursor: animating ? "default" : "pointer",
                    fontFamily: "'Courier New', monospace",
                    transition: "all 0.3s ease",
                    opacity: animating ? 0.6 : 1,
                }}
            >
                {animating ? "· · ·" : smiling ? "↩ neutral" : "✨ make her smile"}
            </button> */}
        </div>
    );
}