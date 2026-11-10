// Province seed table for the 1936 world.
// Name|map unit (modern country polygon)|lat|lon|owner|pop (millions)|development 0-5|resources (c=coal i=iron o=oil r=rubber, digit=richness)|terrain|victory points
// terrain: p plains, f forest, h hills, m mountains, d desert, j jungle, u urban, s marsh
var PROV_RAW = `
London|United Kingdom|51.5|-0.1|ENG|12|5||u|30
Birmingham|United Kingdom|52.5|-1.9|ENG|9|5|c2i1|p|8
Manchester|United Kingdom|53.6|-2.2|ENG|11|5|c3|h|8
Cardiff|United Kingdom|51.6|-3.4|ENG|3|3|c3|h|3
Glasgow|United Kingdom|55.9|-4.2|ENG|5|4|c2i1|h|6
Belfast|United Kingdom|54.6|-5.9|ENG|1.3|3||p|3
Dublin|Ireland|53.3|-6.3|IRE|3|1||p|8
Paris|France|48.85|2.35|FRA|9|5||u|30
Lille|France|50.6|3.1|FRA|5|4|c3|p|5
Metz|France|48.9|6.3|FRA|4|4|i4c1|h|6
Lyon|France|45.75|4.85|FRA|6|3||h|6
Marseille|France|43.3|5.4|FRA|5|3||h|6
Bordeaux|France|44.85|-0.6|FRA|4.5|2||p|4
Nantes|France|47.6|-2.2|FRA|5|2||p|3
Toulouse|France|43.6|1.45|FRA|3|2||p|3
Cayenne|France|4.9|-52.3|FRA|0.04|0||j|1
Berlin|Germany|52.5|13.4|GER|8|5||u|30
Hamburg|Germany|53.55|10|GER|6|4||p|8
Essen|Germany|51.45|7|GER|12|5|c5i1|u|12
Hanover|Germany|52.4|9.7|GER|5|3|i2o1|p|4
Frankfurt|Germany|50.1|8.7|GER|6|4||h|6
Stuttgart|Germany|48.8|9.2|GER|5|4||h|5
Munich|Germany|48.15|11.6|GER|7|3||h|8
Leipzig|Germany|51.3|12.4|GER|8|5|c2|p|6
Breslau|Poland|51.1|17|GER|4.5|3|c3|p|5
Stettin|Poland|53.45|14.55|GER|2|2||p|3
Allenstein|Poland|53.8|20.5|GER|1|1||f|2
Königsberg|Russia|54.7|20.5|GER|1.4|2||p|4
Warsaw|Poland|52.25|21|POL|6|3||u|20
Łódź|Poland|51.75|19.45|POL|4|3||p|5
Kraków|Poland|50.05|19.95|POL|5|2||h|6
Katowice|Poland|50.25|19|POL|2|4|c4i1|u|5
Poznań|Poland|52.4|16.9|POL|3.5|2||p|5
Danzig|Poland|54.2|18.5|POL|1.5|2||p|6
Lublin|Poland|51.25|22.55|POL|3|1||p|3
Białystok|Poland|53.15|23.15|POL|2|1||f|2
Wilno|Lithuania|54.7|25.3|POL|1.2|1||f|4
Baranowicze|Belarus|53.15|26|POL|1.5|0||s|1
Brest-Litovsk|Belarus|52.1|23.7|POL|1.5|0||s|2
Lwów|Ukraine|49.85|24|POL|4|2|o1|h|6
Równe|Ukraine|50.6|26.2|POL|2|0||p|2
Kaunas|Lithuania|54.9|23.9|LIT|2|1||p|8
Memel|Lithuania|55.7|21.15|LIT|0.15|1||p|2
Riga|Latvia|56.95|24.1|LAT|1.9|1||f|8
Tallinn|Estonia|59.4|24.7|EST|1.1|1||f|8
Helsinki|Finland|60.2|24.9|FIN|2.3|2||f|10
Oulu|Finland|65|25.5|FIN|0.9|0||f|2
Viipuri|Russia|60.7|28.75|FIN|0.5|1||f|3
Leningrad|Russia|59.9|30.3|SOV|6|4||u|20
Moscow|Russia|55.75|37.6|SOV|12|5||u|30
Murmansk|Russia|68.97|33.1|SOV|0.5|1||f|3
Petrozavodsk|Russia|61.8|34.3|SOV|0.5|0||f|1
Arkhangelsk|Russia|64.5|40.5|SOV|1.5|1||f|3
Syktyvkar|Russia|61.7|50.8|SOV|0.5|0|c2|f|1
Smolensk|Russia|54.8|32|SOV|4|1||f|4
Kursk|Russia|51.7|36.2|SOV|6|1|i3|p|3
Voronezh|Russia|51.7|39.2|SOV|5|2||p|3
Rostov|Russia|47.2|39.7|SOV|4|3|c2|p|5
Stalingrad|Russia|48.7|44.5|SOV|3|3||p|15
Krasnodar|Russia|45|39|SOV|3|1|o1|p|3
Grozny|Russia|43.3|45.7|SOV|3|1|o3|m|4
Gorky|Russia|56.3|44|SOV|6|4||f|6
Kazan|Russia|55.8|49.1|SOV|5|2|o1|f|4
Kuibyshev|Russia|53.2|50.1|SOV|5|2||p|5
Ufa|Russia|54.7|56|SOV|3|1|o2|h|2
Molotov|Russia|58|56.3|SOV|3|2||f|3
Sverdlovsk|Russia|56.8|60.6|SOV|3|4|i3|h|6
Chelyabinsk|Russia|55.2|61.4|SOV|2.5|4|i4c1|h|5
Omsk|Russia|55|73.4|SOV|3|1||p|3
Novosibirsk|Russia|55|82.9|SOV|4|2|c4|f|4
Norilsk|Russia|69.3|88.2|SOV|0.1|0|i1|f|1
Krasnoyarsk|Russia|56|92.9|SOV|2|1||f|2
Irkutsk|Russia|52.3|104.3|SOV|2|1||f|3
Chita|Russia|52|113.5|SOV|1|0||f|2
Yakutsk|Russia|62|129.7|SOV|0.4|0||f|1
Khabarovsk|Russia|48.5|135.1|SOV|1|1||f|3
Vladivostok|Russia|43.1|131.9|SOV|1|2||h|10
Okha|Russia|53.6|142.9|SOV|0.1|0|o1|f|1
Toyohara|Russia|46.95|142.7|JAP|0.3|0|c1|f|1
Magadan|Russia|59.6|150.8|SOV|0.2|0||f|1
Petropavlovsk|Russia|53|158.65|SOV|0.1|0||m|1
Anadyr|Russia|64.7|177.5|SOV|0.05|0||f|1
Minsk|Belarus|53.9|27.6|SOV|3|2||f|8
Vitebsk|Belarus|55.2|30.2|SOV|1.5|1||f|2
Gomel|Belarus|52.4|31|SOV|1.5|1||s|2
Kiev|Ukraine|50.45|30.5|SOV|7|3||p|15
Vinnitsa|Ukraine|49.2|28.5|SOV|4|1||p|2
Kharkov|Ukraine|50|36.2|SOV|6|4||p|8
Stalino|Ukraine|48|37.8|SOV|5|5|c5i1|p|6
Dnepropetrovsk|Ukraine|48.45|35|SOV|5|4|i4|p|5
Odessa|Ukraine|46.5|30.7|SOV|4|2||p|6
Sevastopol|Ukraine|44.6|33.5|SOV|1|1||h|5
Czernowitz|Ukraine|48.3|25.9|ROM|0.8|0||h|1
Uzhhorod|Ukraine|48.6|22.3|CZE|0.7|0||m|1
Alma-Ata|Kazakhstan|43.25|76.9|SOV|2|1||m|3
Karaganda|Kazakhstan|49.8|73.1|SOV|1.5|1|c3|p|2
Guryev|Kazakhstan|47.1|51.9|SOV|1|0|o2|d|1
Aktyubinsk|Kazakhstan|50.3|57.2|SOV|1|0||p|1
Tashkent|Uzbekistan|41.3|69.3|SOV|6|1||d|4
Ashgabat|Turkmenistan|37.95|58.4|SOV|1.2|0|o1|d|1
Frunze|Kyrgyzstan|42.9|74.6|SOV|1.4|0||m|1
Stalinabad|Tajikistan|38.55|68.8|SOV|1.4|0||m|1
Tiflis|Georgia|41.7|44.8|SOV|3.4|1||m|4
Yerevan|Armenia|40.2|44.5|SOV|1.2|1||m|2
Baku|Azerbaijan|40.4|49.9|SOV|3|3|o5|h|10
Stockholm|Sweden|59.3|18.1|SWE|3|3||f|10
Gothenburg|Sweden|57.7|12|SWE|2.3|3||f|4
Kiruna|Sweden|67.85|20.2|SWE|0.9|1|i5|f|3
Oslo|Norway|59.9|10.75|NOR|1.9|2||m|8
Bergen|Norway|60.4|5.3|NOR|0.5|1||m|2
Narvik|Norway|68.4|17.4|NOR|0.5|0||m|3
Copenhagen|Denmark|55.7|12.6|DEN|3.7|3||p|8
Godthaab|Greenland|64.2|-51.7|DEN|0.02|0||m|1
Reykjavik|Iceland|64.15|-21.9|DEN|0.12|0||m|2
Amsterdam|Netherlands|52.4|4.9|HOL|8.5|4||p|12
Brussels|Belgium|50.85|4.35|BEL|8.3|4|c2|p|12
Luxembourg|Luxembourg|49.6|6.1|LUX|0.3|3|i2|h|3
Bern|Switzerland|46.95|7.45|SWI|4.2|4||m|10
Vienna|Austria|48.2|16.4|AUT|4.5|3||u|15
Innsbruck|Austria|47.3|11.4|AUT|2.2|1|i1|m|3
Prague|Czechia|50.1|14.4|CZE|5|4|c2|h|15
Karlsbad|Czechia|50.23|12.87|CZE|1.5|3|c2|m|3
Reichenberg|Czechia|50.77|15.06|CZE|1.5|3||m|3
Brno|Czechia|49.2|16.6|CZE|3|3||h|4
Bratislava|Slovakia|48.15|17.1|CZE|2.5|1||h|4
Košice|Slovakia|48.7|21.25|CZE|1|0||m|1
Budapest|Hungary|47.5|19.05|HUN|5|3||p|12
Debrecen|Hungary|47.5|21.6|HUN|4|1||p|2
Bucharest|Romania|44.4|26.1|ROM|5|2||p|12
Ploiești|Romania|44.95|26|ROM|2|2|o4|h|4
Cluj|Romania|46.8|23.6|ROM|5|1||m|3
Timișoara|Romania|45.75|21.2|ROM|1.5|1||p|2
Iași|Romania|47.15|27.6|ROM|3|0||p|2
Constanța|Romania|44.2|28.6|ROM|1|1||p|2
Chișinău|Moldova|47|28.85|ROM|2.5|0||p|2
Sofia|Bulgaria|42.7|23.3|BUL|4|1||m|8
Varna|Bulgaria|43.2|27.9|BUL|2.2|0||p|2
Athens|Greece|38|23.7|GRE|4|1||h|10
Salonika|Greece|40.6|22.95|GRE|2.8|1||m|3
Belgrade|Serbia|44.8|20.5|YUG|5|1||h|12
Zagreb|Croatia|45.8|16|YUG|3.8|1||h|4
Ljubljana|Slovenia|46.05|14.5|YUG|1.2|2||m|2
Sarajevo|Bosnia and Herz.|43.85|18.4|YUG|2.5|0|i1|m|2
Cetinje|Montenegro|42.4|18.9|YUG|0.4|0||m|1
Skopje|Macedonia|42|21.4|YUG|1|0||m|1
Pristina|Kosovo|42.65|21.15|YUG|0.6|0||m|1
Tirana|Albania|41.3|19.8|ALB|1|0|o1|m|5
Rome|Italy|41.9|12.5|ITA|7|3||u|25
Milan|Italy|45.45|9.2|ITA|9|5||p|10
Turin|Italy|45.05|7.7|ITA|5|5||h|6
Venice|Italy|45.45|12.3|ITA|6|3||p|5
Florence|Italy|43.8|11.25|ITA|5|2||h|4
Naples|Italy|40.85|14.25|ITA|7|2||h|6
Palermo|Italy|38.1|13.35|ITA|4|1||h|4
Cagliari|Italy|39.2|9.1|ITA|1|0|c1|h|1
Madrid|Spain|40.4|-3.7|SPA|5|2||h|15
Barcelona|Spain|41.4|2.15|SPA|4|3||h|8
Seville|Spain|37.4|-6|SPA|5|1||p|5
Bilbao|Spain|43.25|-2.9|SPA|3|3|i3c1|m|4
Valencia|Spain|39.5|-0.4|SPA|3|1||h|4
Corunna|Spain|43.35|-8.4|SPA|3|0||h|2
Zaragoza|Spain|41.65|-0.9|SPA|1.5|1||h|2
Lisbon|Portugal|38.7|-9.15|POR|5|1||h|10
Porto|Portugal|41.15|-8.6|POR|2|1||h|2
Istanbul|Turkey|41|29|TUR|3.5|2||u|10
Ankara|Turkey|39.9|32.85|TUR|4|1||h|10
Izmir|Turkey|38.4|27.1|TUR|3|1||h|4
Adana|Turkey|37|35.3|TUR|2.5|0||h|2
Erzurum|Turkey|39.9|41.3|TUR|3|0|c1|m|2
Nicosia|Cyprus|35.1|33.3|ENG|0.3|0||h|2
Famagusta|N. Cyprus|35.25|33.8|ENG|0.1|0||h|1
Valletta|Malta|35.9|14.5|ENG|0.25|1||u|5
Damascus|Syria|33.5|36.3|FRA|2.5|0||d|4
Beirut|Lebanon|33.9|35.5|FRA|0.9|1||m|3
Jerusalem|Israel|31.8|35.2|ENG|1|1||h|5
Nablus|Palestine|32.2|35.25|ENG|0.4|0||h|1
Amman|Jordan|31.95|35.9|ENG|0.3|0||d|1
Baghdad|Iraq|33.3|44.4|IRQ|2|0|o1|d|8
Mosul|Iraq|36.35|43.15|IRQ|1|0|o3|h|3
Basra|Iraq|30.5|47.8|IRQ|0.7|0|o2|s|3
Kuwait|Kuwait|29.4|48|ENG|0.08|0|o1|d|2
Riyadh|Saudi Arabia|24.7|46.7|SAU|1.5|0||d|6
Jeddah|Saudi Arabia|21.5|39.2|SAU|1.5|0||d|4
Dhahran|Saudi Arabia|26.3|50.1|SAU|0.3|0|o3|d|2
Sana'a|Yemen|15.35|44.2|YEM|2.5|0||m|5
Aden|Yemen|12.8|45|ENG|0.6|0||d|5
Mukalla|Yemen|14.5|49.1|ENG|0.3|0||d|1
Muscat|Oman|23.6|58.5|ENG|0.4|0||d|2
Abu Dhabi|United Arab Emirates|24.45|54.4|ENG|0.08|0||d|1
Doha|Qatar|25.3|51.5|ENG|0.03|0||d|1
Manama|Bahrain|26.2|50.6|ENG|0.09|0|o1|d|1
Tehran|Iran|35.7|51.4|PER|5|1||m|10
Tabriz|Iran|38.1|46.3|PER|3|0||m|3
Abadan|Iran|30.35|48.3|PER|2|1|o5|d|6
Shiraz|Iran|29.6|52.5|PER|2.5|0||m|2
Mashhad|Iran|36.3|59.6|PER|2.5|0||d|2
Kabul|Afghanistan|34.5|69.2|AFG|7|0||m|6
Delhi|India|28.6|77.2|RAJ|30|1||p|15
Lucknow|India|26.85|80.95|RAJ|55|0||p|5
Calcutta|India|22.6|88.4|RAJ|45|2|c3i2|p|15
Bombay|India|19.1|72.9|RAJ|28|2||h|10
Madras|India|13.1|80.3|RAJ|45|1||p|6
Hyderabad|India|17.4|78.5|RAJ|20|0||h|3
Nagpur|India|21.15|79.1|RAJ|20|0|c1i1|f|2
Ahmedabad|India|23|72.6|RAJ|15|1||p|3
Mysore|India|12.97|77.6|RAJ|15|0||h|2
Jaipur|India|26.9|75.8|RAJ|13|0||d|2
Srinagar|India|34.1|74.8|RAJ|4|0||m|1
Gauhati|India|26.15|91.75|RAJ|9|0|o1|j|2
Karachi|Pakistan|24.9|67|RAJ|5|0||d|4
Lahore|Pakistan|31.55|74.35|RAJ|20|1||p|5
Peshawar|Pakistan|34|71.5|RAJ|4|0||m|2
Quetta|Pakistan|30.2|67|RAJ|1|0||m|1
Dacca|Bangladesh|23.7|90.4|RAJ|35|0||s|4
Thimphu|Bhutan|27.5|89.6|RAJ|0.3|0||m|1
Kathmandu|Nepal|27.7|85.3|NEP|6|0||m|5
Colombo|Sri Lanka|6.9|79.9|ENG|5.7|0|r1|j|4
Rangoon|Myanmar|16.8|96.15|ENG|9|0|o1r1|j|5
Mandalay|Myanmar|21.97|96.1|ENG|6|0||j|2
Bangkok|Thailand|13.75|100.5|SIA|10|0|r1|j|10
Chiang Mai|Thailand|18.8|99|SIA|4.5|0||j|2
Vientiane|Laos|17.97|102.6|FRA|1|0||j|1
Phnom Penh|Cambodia|11.55|104.9|FRA|3|0|r1|j|2
Hanoi|Vietnam|21|105.85|FRA|9|0|c1|j|5
Hue|Vietnam|16.45|107.6|FRA|5|0||j|2
Saigon|Vietnam|10.8|106.7|FRA|5|0|r3|j|5
Kuala Lumpur|Malaysia|3.15|101.7|ENG|4|0|r5|j|5
Kuching|Malaysia|1.55|110.35|ENG|0.5|0|o1r1|j|1
Jesselton|Malaysia|5.98|116.07|ENG|0.3|0|r1|j|1
Singapore|Singapore|1.3|103.8|ENG|0.6|2||u|10
Brunei|Brunei|4.9|114.9|ENG|0.03|0|o2|j|1
Batavia|Indonesia|-6.2|106.8|HOL|20|1|r2|j|10
Surabaya|Indonesia|-7.25|112.75|HOL|22|0|r1|j|5
Medan|Indonesia|3.6|98.7|HOL|4|0|r3o1|j|3
Palembang|Indonesia|-3|104.75|HOL|4|0|o4r2|j|5
Pontianak|Indonesia|-0.03|109.3|HOL|0.8|0||j|1
Balikpapan|Indonesia|-1.25|116.85|HOL|2|0|o3|j|4
Makassar|Indonesia|-5.15|119.4|HOL|4|0||j|2
Ambon|Indonesia|-3.7|128.2|HOL|0.6|0||j|1
Kupang|Indonesia|-10.2|123.6|HOL|1.5|0||j|1
Hollandia|Indonesia|-2.5|140.7|HOL|0.3|0||j|1
Dili|Timor-Leste|-8.55|125.6|POR|0.45|0||j|1
Manila|Philippines|14.6|121|PHI|8|1||j|10
Cebu|Philippines|10.3|123.9|PHI|4|0||j|3
Davao|Philippines|7.1|125.6|PHI|3|0||j|2
Port Moresby|Papua New Guinea|-9.45|147.2|AST|0.4|0||j|2
Lae|Papua New Guinea|-6.7|147|AST|0.3|0||j|1
Rabaul|Papua New Guinea|-4.2|152.2|AST|0.4|0||j|2
Tulagi|Solomon Is.|-9.1|160.15|ENG|0.09|0||j|1
Port Vila|Vanuatu|-17.7|168.3|ENG|0.05|0||j|1
Nouméa|New Caledonia|-22.3|166.45|FRA|0.05|0|i1|h|1
Suva|Fiji|-18.1|178.45|ENG|0.2|0||j|1
Nanjing|China|32.05|118.8|CHI|35|1||p|20
Shanghai|China|31.2|121.5|CHI|15|3||u|20
Hangzhou|China|30.25|120.15|CHI|20|0||h|4
Fuzhou|China|26.1|119.3|CHI|12|0||m|3
Guangzhou|China|23.1|113.3|GXC|32|1||h|10
Nanning|China|22.8|108.3|GXC|13|0||h|3
Kunming|China|25.05|102.7|YUN|12|0||m|4
Guiyang|China|26.6|106.7|YUN|10|0||m|2
Changsha|China|28.2|113|CHI|28|0||h|5
Nanchang|China|28.7|115.9|CHI|16|0||h|3
Wuhan|China|30.6|114.3|CHI|26|2|i2|p|15
Chongqing|China|29.55|106.55|SIC|25|0||m|10
Chengdu|China|30.65|104.05|SIC|27|0||p|5
Xi'an|China|34.3|108.9|CHI|10|0||h|5
Yan'an|China|36.6|109.5|PRC|1.5|0||m|5
Zhengzhou|China|34.75|113.65|CHI|33|0||p|5
Xuzhou|China|34.2|117.2|CHI|20|0||p|4
Jinan|China|36.65|117|CHI|30|0|c2|p|5
Qingdao|China|36.07|120.4|CHI|8|1||h|4
Peiping|China|39.9|116.4|CHI|18|1|c2|p|15
Tianjin|China|39.1|117.2|CHI|10|2||p|6
Taiyuan|China|37.9|112.55|SHX|11|0|c4|m|4
Kalgan|China|40.8|114.9|CHI|2|0||h|2
Hohhot|China|40.8|111.7|SHX|3|0||p|2
Lanzhou|China|36.05|103.8|XSM|6|0|o1|m|3
Xining|China|36.6|101.8|XSM|1.5|0||m|1
Urumqi|China|43.8|87.6|SIK|2.5|0|o1|d|5
Kashgar|China|39.45|76|SIK|1.7|0||d|2
Lhasa|China|29.65|91.1|TIB|1|0||m|5
Chamdo|China|31.15|97.2|TIB|0.5|0||m|1
Chengde|China|40.97|117.95|MAN|4|0||m|2
Mukden|China|41.8|123.4|MAN|12|3|c3i3|p|10
Hsinking|China|43.9|125.3|MAN|8|1||p|10
Harbin|China|45.75|126.65|MAN|8|1||p|5
Qiqihar|China|47.35|124|MAN|3|0||p|2
Hailar|China|49.2|119.7|MAN|0.5|0||p|1
Dairen|China|38.9|121.6|JAP|1.5|3||h|5
Hong Kong|Hong Kong|22.3|114.2|ENG|1|2||u|10
Taihoku|Taiwan|25.05|121.5|JAP|5.5|1||m|4
Ulan Bator|Mongolia|47.9|106.9|MON|0.75|0||p|5
Keijo|South Korea|37.55|127|JAP|14|1||h|6
Heijo|North Korea|39|125.75|JAP|8|2|c2i2|m|4
Tokyo|Japan|35.7|139.7|JAP|20|5||u|30
Osaka|Japan|34.7|135.5|JAP|16|5||u|15
Nagoya|Japan|35.2|136.9|JAP|10|4||h|8
Hiroshima|Japan|34.4|132.45|JAP|7|3||h|5
Fukuoka|Japan|33.6|130.4|JAP|9|4|c3|h|6
Sendai|Japan|38.25|140.9|JAP|6|1||m|3
Sapporo|Japan|43.05|141.35|JAP|3|1|c2|m|3
Rabat|Morocco|34|-6.85|FRA|5|0||h|4
Marrakech|Morocco|31.6|-8|FRA|2|0||m|1
Tetuan|Morocco|35.57|-5.37|SPA|0.8|0|i1|m|2
Villa Cisneros|W. Sahara|23.7|-15.9|SPA|0.03|0||d|1
Algiers|Algeria|36.75|3.05|FRA|3.5|1||h|5
Oran|Algeria|35.7|-0.65|FRA|1.5|0||h|2
Constantine|Algeria|36.35|6.6|FRA|2|0|i1|m|2
Colomb-Béchar|Algeria|31.6|-2.2|FRA|0.2|0||d|1
Tamanrasset|Algeria|22.8|5.5|FRA|0.2|0||d|1
Tunis|Tunisia|36.8|10.2|FRA|2.6|0||h|4
Tripoli|Libya|32.9|13.2|ITA|0.5|0||d|4
Benghazi|Libya|32.1|20.05|ITA|0.3|0||d|3
Sabha|Libya|27|14.4|ITA|0.05|0||d|1
Cairo|Egypt|30.05|31.25|EGY|8|1||d|10
Alexandria|Egypt|31.2|29.9|EGY|4|1||d|6
Aswan|Egypt|24.1|32.9|EGY|4|0||d|1
Khartoum|Sudan|15.6|32.5|ENG|4|0||d|3
El Fasher|Sudan|13.6|25.35|ENG|1.5|0||d|1
Juba|S. Sudan|4.85|31.6|ENG|2|0||j|1
Addis Ababa|Ethiopia|9|38.75|ETH|6|0||m|10
Harar|Ethiopia|9.3|42.1|ETH|3|0||h|3
Gondar|Ethiopia|12.6|37.45|ETH|4|0||m|3
Asmara|Eritrea|15.3|38.9|ITA|0.6|0||m|2
Mogadishu|Somalia|2.05|45.3|ITA|1|0||d|2
Berbera|Somaliland|10.4|45|ENG|0.35|0||d|1
Djibouti|Djibouti|11.6|43.15|FRA|0.05|0||d|1
Nairobi|Kenya|-1.3|36.8|ENG|3.3|0||h|3
Kampala|Uganda|0.3|32.6|ENG|3.7|0||j|1
Dar es Salaam|Tanzania|-6.8|39.3|ENG|5.2|0||h|2
Kigali|Rwanda|-1.95|30.05|BEL|1.7|0||m|1
Usumbura|Burundi|-3.4|29.35|BEL|1.7|0||m|1
Léopoldville|Dem. Rep. Congo|-4.3|15.3|BEL|4|0||j|3
Stanleyville|Dem. Rep. Congo|0.5|25.2|BEL|4|0|r2|j|1
Élisabethville|Dem. Rep. Congo|-11.65|27.5|BEL|2.5|1|i2|h|3
Brazzaville|Congo|-4.25|15.25|FRA|0.8|0||j|2
Libreville|Gabon|0.4|9.45|FRA|0.4|0||j|1
Yaoundé|Cameroon|3.85|11.5|FRA|2.5|0||j|1
Bangui|Central African Rep.|4.4|18.55|FRA|1|0||j|1
Fort-Lamy|Chad|12.1|15.05|FRA|2|0||d|1
Niamey|Niger|13.5|2.1|FRA|1.8|0||d|1
Bamako|Mali|12.65|-8|FRA|3.5|0||d|1
Atar|Mauritania|20.5|-13.05|FRA|0.4|0||d|1
Dakar|Senegal|14.7|-17.45|FRA|1.7|0||p|5
Bathurst|Gambia|13.45|-16.6|ENG|0.2|0||p|1
Bissau|Guinea-Bissau|11.85|-15.6|POR|0.4|0||j|1
Conakry|Guinea|9.5|-13.7|FRA|2|0||j|1
Freetown|Sierra Leone|8.5|-13.2|ENG|1.8|0||j|2
Monrovia|Liberia|6.3|-10.8|LIB|1|0|r1|j|5
Abidjan|Côte d'Ivoire|5.35|-4|FRA|3|0||j|1
Ouagadougou|Burkina Faso|12.35|-1.5|FRA|3|0||p|1
Accra|Ghana|5.55|-0.2|ENG|3.5|0||j|2
Lomé|Togo|6.15|1.2|FRA|0.8|0||j|1
Porto-Novo|Benin|6.5|2.6|FRA|1.3|0||j|1
Lagos|Nigeria|6.45|3.4|ENG|10|0||j|4
Kano|Nigeria|12|8.5|ENG|10|0||p|2
Santa Isabel|Eq. Guinea|1.6|10.3|SPA|0.17|0||j|1
Luanda|Angola|-8.8|13.25|POR|2|0||p|3
Nova Lisboa|Angola|-12.8|15.75|POR|1.5|0||h|1
Lusaka|Zambia|-15.4|28.3|ENG|1.4|0|i2|h|2
Salisbury|Zimbabwe|-17.8|31.05|ENG|1.3|0|c1|h|2
Zomba|Malawi|-15.4|35.3|ENG|1.6|0||h|1
Lourenço Marques|Mozambique|-25.95|32.6|POR|2|0||p|2
Beira|Mozambique|-19.8|34.85|POR|2.5|0||j|1
Gaborone|Botswana|-24.65|25.9|ENG|0.26|0||d|1
Windhoek|Namibia|-22.55|17.1|SAF|0.3|0||d|1
Johannesburg|South Africa|-26.2|28.05|SAF|4|3|c3i2|h|10
Cape Town|South Africa|-33.9|18.4|SAF|3|2||h|6
Durban|South Africa|-29.85|31|SAF|2.6|1|c1|h|3
Maseru|Lesotho|-29.3|27.5|ENG|0.56|0||m|1
Mbabane|eSwatini|-26.3|31.15|ENG|0.15|0||h|1
Tananarive|Madagascar|-18.9|47.5|FRA|3.9|0||j|3
Toronto|Canada|43.7|-79.4|CAN|3.7|4||p|10
Montreal|Canada|45.5|-73.6|CAN|3.1|3||f|10
Halifax|Canada|44.65|-63.6|CAN|1.1|1|c1|f|4
St. John's|Canada|47.55|-52.7|CAN|0.3|0||f|2
Labrador|Canada|53.3|-60.4|CAN|0.02|0|i2|f|1
Winnipeg|Canada|49.9|-97.1|CAN|1.6|1||p|2
Churchill|Canada|58.77|-94.17|CAN|0.02|0||f|1
Edmonton|Canada|53.55|-113.5|CAN|0.8|1|o2|p|2
Yellowknife|Canada|62.45|-114.4|CAN|0.02|0||f|1
Whitehorse|Canada|60.7|-135|CAN|0.01|0||m|1
Vancouver|Canada|49.25|-123.1|CAN|0.8|2||m|4
New York|United States of America|40.7|-74|USA|17|5||u|30
Boston|United States of America|42.35|-71.05|USA|8|5||h|8
Washington|United States of America|38.9|-77.05|USA|6|3||p|30
Pittsburgh|United States of America|40.45|-80|USA|10|5|c5i1|h|8
Detroit|United States of America|42.35|-83.05|USA|6|5||p|10
Chicago|United States of America|41.85|-87.65|USA|12|5||u|15
Cincinnati|United States of America|39.1|-84.5|USA|9|4|c2|h|5
Charlotte|United States of America|35.2|-80.85|USA|7|2||h|3
Atlanta|United States of America|33.75|-84.4|USA|9|2||h|5
Miami|United States of America|25.8|-80.2|USA|2|1||s|3
Birmingham AL|United States of America|33.5|-86.8|USA|5|2|i2c2|h|3
New Orleans|United States of America|29.95|-90.1|USA|5|1|o2|s|5
Memphis|United States of America|35.15|-90.05|USA|5|1||p|2
St. Louis|United States of America|38.63|-90.2|USA|6|3||p|5
Minneapolis|United States of America|44.98|-93.27|USA|5|2|i5|f|4
Kansas City|United States of America|39.1|-94.6|USA|4|1||p|2
Bismarck|United States of America|46.8|-100.8|USA|2|0||p|1
Oklahoma City|United States of America|35.5|-97.5|USA|3|1|o4|p|2
Dallas|United States of America|32.8|-96.8|USA|3.5|1|o3|p|3
Houston|United States of America|29.75|-95.35|USA|3|2|o5|p|5
Denver|United States of America|39.75|-105|USA|2|1|c1|m|2
Helena|United States of America|46.6|-112|USA|1.2|0||m|1
Salt Lake City|United States of America|40.75|-111.9|USA|1|0|i1|m|1
Albuquerque|United States of America|35.1|-106.6|USA|0.5|0||d|1
Phoenix|United States of America|33.45|-112.07|USA|1|0||d|1
Seattle|United States of America|47.6|-122.3|USA|2.7|3||m|5
San Francisco|United States of America|37.8|-122.4|USA|3.5|3||h|10
Los Angeles|United States of America|34.05|-118.25|USA|3.5|3|o4|h|10
Anchorage|United States of America|61.2|-149.9|USA|0.06|0||m|2
Honolulu|United States of America|21.3|-157.85|USA|0.4|1||h|10
San Juan|Puerto Rico|18.45|-66.1|USA|1.7|0||j|2
Mexico City|Mexico|19.4|-99.1|MEX|7|1||m|12
Guadalajara|Mexico|20.7|-103.35|MEX|3|0||h|3
Monterrey|Mexico|25.7|-100.3|MEX|2|1|i1|h|3
Tampico|Mexico|22.25|-97.85|MEX|2|0|o4|j|3
Oaxaca|Mexico|17.1|-96.7|MEX|2|0||m|1
Mérida|Mexico|21|-89.6|MEX|1|0||j|1
Chihuahua|Mexico|28.6|-106.1|MEX|1.5|0||d|1
Hermosillo|Mexico|29.1|-111|MEX|0.7|0||d|1
Guatemala City|Guatemala|14.6|-90.5|GUA|2.2|0||j|5
Belize|Belize|17.5|-88.2|ENG|0.06|0||j|1
Tegucigalpa|Honduras|14.1|-87.2|HON|1|0||j|5
San Salvador|El Salvador|13.7|-89.2|ELS|1.6|0||h|5
Managua|Nicaragua|12.1|-86.25|NIC|0.7|0||j|5
San José|Costa Rica|9.95|-84.1|COS|0.6|0||j|5
Panama City|Panama|9|-79.5|PAN|0.6|0||j|6
Havana|Cuba|23.1|-82.4|CUB|4.2|0||p|6
Port-au-Prince|Haiti|18.55|-72.35|HAI|2.6|0||m|5
Santo Domingo|Dominican Rep.|18.5|-69.9|DOM|1.6|0||h|5
Kingston|Jamaica|18|-76.8|ENG|1.1|0||m|2
Nassau|Bahamas|25.05|-77.35|ENG|0.07|0||p|1
Port of Spain|Trinidad and Tobago|10.65|-61.5|ENG|0.45|0|o1|j|2
Bogotá|Colombia|4.6|-74.1|COL|6|0||m|8
Medellín|Colombia|6.25|-75.6|COL|2.7|0|o1|m|2
Caracas|Venezuela|10.5|-66.9|VEN|2.5|0||m|6
Maracaibo|Venezuela|10.65|-71.6|VEN|1|0|o5|j|4
Georgetown|Guyana|6.8|-58.15|ENG|0.34|0||j|1
Paramaribo|Suriname|5.85|-55.2|HOL|0.15|0||j|1
Quito|Ecuador|-0.2|-78.5|ECU|2.3|0||m|5
Lima|Peru|-12.05|-77.05|PRU|4|0|o1|d|8
Cuzco|Peru|-13.5|-72|PRU|2.5|0||m|1
Iquitos|Peru|-3.75|-73.25|PRU|0.2|0|r1|j|1
La Paz|Bolivia|-16.5|-68.15|BOL|2.7|0|i2|m|5
Santiago|Chile|-33.45|-70.65|CHL|3.5|1||h|8
Antofagasta|Chile|-23.65|-70.4|CHL|0.5|0|i2|d|2
Punta Arenas|Chile|-53.15|-70.9|CHL|0.2|0||m|1
Buenos Aires|Argentina|-34.6|-58.4|ARG|7|2||p|12
Córdoba|Argentina|-31.4|-64.2|ARG|3|0||p|3
Tucumán|Argentina|-26.8|-65.2|ARG|1.5|0||h|1
Mendoza|Argentina|-32.9|-68.85|ARG|1|0||m|1
Comodoro Rivadavia|Argentina|-45.85|-67.5|ARG|0.3|0|o2|d|1
Montevideo|Uruguay|-34.9|-56.2|URU|2|1||p|6
Asunción|Paraguay|-25.3|-57.6|PAR|1|0||j|5
Rio de Janeiro|Brazil|-22.9|-43.2|BRA|6|2||h|12
São Paulo|Brazil|-23.55|-46.65|BRA|7|2||h|10
Belo Horizonte|Brazil|-19.9|-43.95|BRA|7|0|i4|h|3
Salvador|Brazil|-12.97|-38.5|BRA|5|0||j|3
Recife|Brazil|-8.05|-34.9|BRA|6|0||j|3
Porto Alegre|Brazil|-30.05|-51.2|BRA|4|0|c1|p|3
Goiânia|Brazil|-16.7|-49.25|BRA|0.9|0||p|1
Cuiabá|Brazil|-15.6|-56.1|BRA|0.6|0||j|1
Manaus|Brazil|-3.1|-60|BRA|0.5|0|r3|j|1
Belém|Brazil|-1.45|-48.5|BRA|1.5|0|r1|j|2
Stanley|Falkland Is.|-51.7|-57.85|ENG|0.002|0||h|1
Sydney|Australia|-33.87|151.2|AST|2.7|3|c2|h|10
Melbourne|Australia|-37.8|144.95|AST|2|3||p|6
Brisbane|Australia|-27.47|153.03|AST|1|1||h|3
Adelaide|Australia|-34.93|138.6|AST|0.6|1|i2|p|2
Perth|Australia|-31.95|115.85|AST|0.45|1||d|3
Alice Springs|Australia|-23.7|133.9|AST|0.01|0||d|1
Darwin|Australia|-12.45|130.85|AST|0.02|0||j|2
Auckland|New Zealand|-36.85|174.75|NZL|0.8|1||h|5
Wellington|New Zealand|-41.3|174.8|NZL|0.35|1||h|5
Christchurch|New Zealand|-43.5|172.6|NZL|0.45|1||h|2
`;
if (typeof module !== 'undefined') module.exports = PROV_RAW;
