// Province seed table for the 1936 world.
// Name|map unit (modern country polygon)|lat|lon|owner|pop (millions)|development 0-5|resources (c=coal i=iron o=oil r=rubber, digit=richness)|terrain|victory points
// terrain: p plains, f forest, h hills, m mountains, d desert, j jungle, u urban, s marsh
var PROV_RAW = `
London|United Kingdom|51.5|-0.1|ENG|4.2|5||u|30
Birmingham|United Kingdom|52.5|-1.9|ENG|9|5|c2i1|p|8
Manchester|United Kingdom|53.6|-2.2|ENG|3.85|5|c3|h|8
Cardiff|United Kingdom|51.6|-3.4|ENG|1.47|3|c3|h|3
Glasgow|United Kingdom|55.9|-4.2|ENG|1.75|4|c2i1|h|6
Belfast|United Kingdom|54.6|-5.9|ENG|1.3|3||p|3
Dublin|Ireland|53.3|-6.3|IRE|3|1||p|8
Paris|France|48.85|2.35|FRA|3.05|5||u|30
Lille|France|50.6|3.1|FRA|2.45|4|c3|p|5
Metz|France|48.9|6.3|FRA|1.96|4|i4c1|h|6
Lyon|France|45.75|4.85|FRA|2.1|3||h|6
Marseille|France|43.3|5.4|FRA|1.75|3||h|6
Bordeaux|France|44.85|-0.6|FRA|2.21|2||p|4
Nantes|France|47.6|-2.2|FRA|2.45|2||p|3
Toulouse|France|43.6|1.45|FRA|3|2||p|3
Cayenne|France|4.9|-52.3|FRA|0.04|0||j|1
Berlin|Germany|52.5|13.4|GER|8|5||u|30
Hamburg|Germany|53.55|10|GER|2.1|4||p|8
Essen|Germany|51.45|7|GER|5.88|5|c5i1|u|12
Hanover|Germany|52.4|9.7|GER|3.5|3|i2o1|p|4
Frankfurt|Germany|50.1|8.7|GER|2.1|4||h|6
Stuttgart|Germany|48.8|9.2|GER|3.5|4||h|5
Munich|Germany|48.15|11.6|GER|3.43|3||h|8
Leipzig|Germany|51.3|12.4|GER|3.92|5|c2|p|6
Breslau|Poland|51.1|17|GER|2.21|3|c3|p|5
Stettin|Poland|53.45|14.55|GER|0.98|2||p|3
Allenstein|Poland|53.8|20.5|GER|1|1||f|2
Königsberg|Russia|54.7|20.5|GER|1.4|2||p|4
Warsaw|Poland|52.25|21|POL|2.94|3||u|20
Łódź|Poland|51.75|19.45|POL|1.96|3||p|5
Kraków|Poland|50.05|19.95|POL|2.45|2||h|6
Katowice|Poland|50.25|19|POL|1.4|4|c4i1|u|5
Poznań|Poland|52.4|16.9|POL|2.45|2||p|5
Danzig|Poland|54.2|18.5|POL|1.05|2||p|6
Lublin|Poland|51.25|22.55|POL|2.1|1||p|3
Białystok|Poland|53.15|23.15|POL|1.4|1||f|2
Wilno|Lithuania|54.7|25.3|POL|1.2|1||f|4
Baranowicze|Belarus|53.15|26|POL|1.05|0||s|1
Brest-Litovsk|Belarus|52.1|23.7|POL|1.5|0||s|2
Lwów|Ukraine|49.85|24|POL|1.96|2|o1|h|6
Równe|Ukraine|50.6|26.2|POL|1.4|0||p|2
Kaunas|Lithuania|54.9|23.9|LIT|1.4|1||p|8
Memel|Lithuania|55.7|21.15|LIT|0.15|1||p|2
Riga|Latvia|56.95|24.1|LAT|0.93|1||f|8
Tallinn|Estonia|59.4|24.7|EST|0.77|1||f|8
Helsinki|Finland|60.2|24.9|FIN|1.13|2||f|10
Oulu|Finland|65|25.5|FIN|0.9|0||f|2
Viipuri|Russia|60.7|28.75|FIN|0.5|1||f|3
Leningrad|Russia|59.9|30.3|SOV|2.94|4||u|20
Moscow|Russia|55.75|37.6|SOV|4.05|5||u|30
Murmansk|Russia|68.97|33.1|SOV|0.5|1||f|3
Petrozavodsk|Russia|61.8|34.3|SOV|0.5|0||f|1
Arkhangelsk|Russia|64.5|40.5|SOV|1.5|1||f|3
Syktyvkar|Russia|61.7|50.8|SOV|0.5|0|c2|f|1
Smolensk|Russia|54.8|32|SOV|4|1||f|4
Kursk|Russia|51.7|36.2|SOV|2.1|1|i3|p|3
Voronezh|Russia|51.7|39.2|SOV|2.45|2||p|3
Rostov|Russia|47.2|39.7|SOV|4|3|c2|p|5
Stalingrad|Russia|48.7|44.5|SOV|2.1|3||p|15
Krasnodar|Russia|45|39|SOV|1.05|1|o1|p|3
Grozny|Russia|43.3|45.7|SOV|1.47|1|o3|m|4
Gorky|Russia|56.3|44|SOV|2.94|4||f|6
Kazan|Russia|55.8|49.1|SOV|3.5|2|o1|f|4
Kuibyshev|Russia|53.2|50.1|SOV|1.75|2||p|5
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
Minsk|Belarus|53.9|27.6|SOV|2.1|2||f|8
Vitebsk|Belarus|55.2|30.2|SOV|0.52|1||f|2
Gomel|Belarus|52.4|31|SOV|0.74|1||s|2
Kiev|Ukraine|50.45|30.5|SOV|7|3||p|15
Vinnitsa|Ukraine|49.2|28.5|SOV|1.4|1||p|2
Kharkov|Ukraine|50|36.2|SOV|2.94|4||p|8
Stalino|Ukraine|48|37.8|SOV|2.45|5|c5i1|p|6
Dnepropetrovsk|Ukraine|48.45|35|SOV|2.45|4|i4|p|5
Odessa|Ukraine|46.5|30.7|SOV|2.8|2||p|6
Sevastopol|Ukraine|44.6|33.5|SOV|1|1||h|5
Czernowitz|Ukraine|48.3|25.9|ROM|0.56|0||h|1
Uzhhorod|Ukraine|48.6|22.3|CZE|0.7|0||m|1
Alma-Ata|Kazakhstan|43.25|76.9|SOV|2|1||m|3
Karaganda|Kazakhstan|49.8|73.1|SOV|1.5|1|c3|p|2
Guryev|Kazakhstan|47.1|51.9|SOV|0.7|0|o2|d|1
Aktyubinsk|Kazakhstan|50.3|57.2|SOV|0.7|0||p|1
Tashkent|Uzbekistan|41.3|69.3|SOV|6|1||d|4
Ashgabat|Turkmenistan|37.95|58.4|SOV|1.2|0|o1|d|1
Frunze|Kyrgyzstan|42.9|74.6|SOV|1.4|0||m|1
Stalinabad|Tajikistan|38.55|68.8|SOV|1.4|0||m|1
Tiflis|Georgia|41.7|44.8|SOV|3.4|1||m|4
Yerevan|Armenia|40.2|44.5|SOV|1.2|1||m|2
Baku|Azerbaijan|40.4|49.9|SOV|3|3|o5|h|10
Stockholm|Sweden|59.3|18.1|SWE|1.44|3||f|10
Gothenburg|Sweden|57.7|12|SWE|1.61|3||f|4
Kiruna|Sweden|67.85|20.2|SWE|0.65|1|i5|f|3
Oslo|Norway|59.9|10.75|NOR|0.98|2||m|8
Bergen|Norway|60.4|5.3|NOR|0.5|1||m|2
Narvik|Norway|68.4|17.4|NOR|0.4|0||m|3
Copenhagen|Denmark|55.7|12.6|DEN|2.19|3||p|8
Godthaab|Greenland|64.2|-51.7|DEN|0.02|0||m|1
Reykjavik|Iceland|64.15|-21.9|DEN|0.12|0||m|2
Amsterdam|Netherlands|52.4|4.9|HOL|3.27|4||p|12
Brussels|Belgium|50.85|4.35|BEL|2.27|4|c2|p|12
Luxembourg|Luxembourg|49.6|6.1|LUX|0.22|3|i2|h|3
Bern|Switzerland|46.95|7.45|SWI|4.2|4||m|10
Vienna|Austria|48.2|16.4|AUT|2.21|3||u|15
Innsbruck|Austria|47.3|11.4|AUT|1.54|1|i1|m|3
Prague|Czechia|50.1|14.4|CZE|3.5|4|c2|h|15
Karlsbad|Czechia|50.23|12.87|CZE|1.05|3|c2|m|3
Reichenberg|Czechia|50.77|15.06|CZE|1.5|3||m|3
Brno|Czechia|49.2|16.6|CZE|1.47|3||h|4
Bratislava|Slovakia|48.15|17.1|CZE|2.5|1||h|4
Košice|Slovakia|48.7|21.25|CZE|0.7|0||m|1
Budapest|Hungary|47.5|19.05|HUN|1.75|3||p|12
Debrecen|Hungary|47.5|21.6|HUN|2.8|1||p|2
Bucharest|Romania|44.4|26.1|ROM|3.5|2||p|12
Ploiești|Romania|44.95|26|ROM|1.4|2|o4|h|4
Cluj|Romania|46.8|23.6|ROM|2.45|1||m|3
Timișoara|Romania|45.75|21.2|ROM|1.05|1||p|2
Iași|Romania|47.15|27.6|ROM|2.1|0||p|2
Constanța|Romania|44.2|28.6|ROM|0.49|1||p|2
Chișinău|Moldova|47|28.85|ROM|1.75|0||p|2
Sofia|Bulgaria|42.7|23.3|BUL|1.96|1||m|8
Varna|Bulgaria|43.2|27.9|BUL|1.08|0||p|2
Athens|Greece|38|23.7|GRE|1.96|1||h|10
Salonika|Greece|40.6|22.95|GRE|0.67|1||m|3
Belgrade|Serbia|44.8|20.5|YUG|1.72|1||h|12
Zagreb|Croatia|45.8|16|YUG|3.8|1||h|4
Ljubljana|Slovenia|46.05|14.5|YUG|1.2|2||m|2
Sarajevo|Bosnia and Herz.|43.85|18.4|YUG|0.88|0|i1|m|2
Cetinje|Montenegro|42.4|18.9|YUG|0.28|0||m|1
Skopje|Macedonia|42|21.4|YUG|0.7|0||m|1
Pristina|Kosovo|42.65|21.15|YUG|0.42|0||m|1
Tirana|Albania|41.3|19.8|ALB|0.49|0|o1|m|5
Rome|Italy|41.9|12.5|ITA|4.9|3||u|25
Milan|Italy|45.45|9.2|ITA|6.3|5||p|10
Turin|Italy|45.05|7.7|ITA|5|5||h|6
Venice|Italy|45.45|12.3|ITA|2.94|3||p|5
Florence|Italy|43.8|11.25|ITA|2.45|2||h|4
Naples|Italy|40.85|14.25|ITA|3.43|2||h|6
Palermo|Italy|38.1|13.35|ITA|1.96|1||h|4
Cagliari|Italy|39.2|9.1|ITA|0.7|0|c1|h|1
Madrid|Spain|40.4|-3.7|SPA|1.75|2||h|15
Barcelona|Spain|41.4|2.15|SPA|3.6|3||h|8
Seville|Spain|37.4|-6|SPA|1.35|1||p|5
Bilbao|Spain|43.25|-2.9|SPA|2.6|3|i3c1|m|4
Valencia|Spain|39.5|-0.4|SPA|2.1|1||h|4
Corunna|Spain|43.35|-8.4|SPA|2.1|0||h|2
Zaragoza|Spain|41.65|-0.9|SPA|1.05|1||h|2
Lisbon|Portugal|38.7|-9.15|POR|5|1||h|10
Porto|Portugal|41.15|-8.6|POR|2|1||h|2
Istanbul|Turkey|41|29|TUR|1.72|2||u|10
Ankara|Turkey|39.9|32.85|TUR|1.37|1||h|10
Izmir|Turkey|38.4|27.1|TUR|2.1|1||h|4
Adana|Turkey|37|35.3|TUR|1.75|0||h|2
Erzurum|Turkey|39.9|41.3|TUR|1.03|0|c1|m|2
Nicosia|Cyprus|35.1|33.3|ENG|0.3|0||h|2
Famagusta|N. Cyprus|35.25|33.8|ENG|0.1|0||h|1
Valletta|Malta|35.9|14.5|ENG|0.25|1||u|5
Damascus|Syria|33.5|36.3|FRA|2.5|0||d|4
Beirut|Lebanon|33.9|35.5|FRA|0.63|1||m|3
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
Lucknow|India|26.85|80.95|RAJ|26.95|0||p|5
Calcutta|India|22.6|88.4|RAJ|31.5|2|c3i2|p|15
Bombay|India|19.1|72.9|RAJ|19.6|2||h|10
Madras|India|13.1|80.3|RAJ|45|1||p|6
Hyderabad|India|17.4|78.5|RAJ|14|0||h|3
Nagpur|India|21.15|79.1|RAJ|20|0|c1i1|f|2
Ahmedabad|India|23|72.6|RAJ|10.5|1||p|3
Mysore|India|12.97|77.6|RAJ|15|0||h|2
Jaipur|India|26.9|75.8|RAJ|13|0||d|2
Srinagar|India|34.1|74.8|RAJ|4|0||m|1
Gauhati|India|26.15|91.75|RAJ|9|0|o1|j|2
Karachi|Pakistan|24.9|67|RAJ|5|0||d|4
Lahore|Pakistan|31.55|74.35|RAJ|9.8|1||p|5
Peshawar|Pakistan|34|71.5|RAJ|4|0||m|2
Quetta|Pakistan|30.2|67|RAJ|1|0||m|1
Dacca|Bangladesh|23.7|90.4|RAJ|24.5|0||s|4
Thimphu|Bhutan|27.5|89.6|RAJ|0.3|0||m|1
Kathmandu|Nepal|27.7|85.3|NEP|6|0||m|5
Colombo|Sri Lanka|6.9|79.9|ENG|5.7|0|r1|j|4
Rangoon|Myanmar|16.8|96.15|ENG|6.3|0|o1r1|j|5
Mandalay|Myanmar|21.97|96.1|ENG|4.2|0||j|2
Bangkok|Thailand|13.75|100.5|SIA|10|0|r1|j|10
Chiang Mai|Thailand|18.8|99|SIA|4.5|0||j|2
Vientiane|Laos|17.97|102.6|FRA|1|0||j|1
Phnom Penh|Cambodia|11.55|104.9|FRA|3|0|r1|j|2
Hanoi|Vietnam|21|105.85|FRA|6.3|0|c1|j|5
Hue|Vietnam|16.45|107.6|FRA|5|0||j|2
Saigon|Vietnam|10.8|106.7|FRA|5|0|r3|j|5
Kuala Lumpur|Malaysia|3.15|101.7|ENG|2.8|0|r5|j|5
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
Nanjing|China|32.05|118.8|CHI|24.5|1||p|20
Shanghai|China|31.2|121.5|CHI|10.5|3||u|20
Hangzhou|China|30.25|120.15|CHI|14|0||h|4
Fuzhou|China|26.1|119.3|CHI|5.88|0||m|3
Guangzhou|China|23.1|113.3|GXC|32|1||h|10
Nanning|China|22.8|108.3|GXC|9.1|0||h|3
Kunming|China|25.05|102.7|YUN|12|0||m|4
Guiyang|China|26.6|106.7|YUN|7|0||m|2
Changsha|China|28.2|113|CHI|13.72|0||h|5
Nanchang|China|28.7|115.9|CHI|11.2|0||h|3
Wuhan|China|30.6|114.3|CHI|12.74|2|i2|p|15
Chongqing|China|29.55|106.55|SIC|17.5|0||m|10
Chengdu|China|30.65|104.05|SIC|18.9|0||p|5
Xi'an|China|34.3|108.9|CHI|7|0||h|5
Yan'an|China|36.6|109.5|PRC|1.05|0||m|5
Zhengzhou|China|34.75|113.65|CHI|11.5|0||p|5
Xuzhou|China|34.2|117.2|CHI|14|0||p|4
Jinan|China|36.65|117|CHI|30|0|c2|p|5
Qingdao|China|36.07|120.4|CHI|5.6|1||h|4
Peiping|China|39.9|116.4|CHI|12.6|1|c2|p|15
Tianjin|China|39.1|117.2|CHI|7|2||p|6
Taiyuan|China|37.9|112.55|SHX|11|0|c4|m|4
Kalgan|China|40.8|114.9|CHI|2|0||h|2
Hohhot|China|40.8|111.7|SHX|1.47|0||p|2
Lanzhou|China|36.05|103.8|XSM|2.94|0|o1|m|3
Xining|China|36.6|101.8|XSM|1.5|0||m|1
Urumqi|China|43.8|87.6|SIK|2.5|0|o1|d|5
Kashgar|China|39.45|76|SIK|1.7|0||d|2
Lhasa|China|29.65|91.1|TIB|1|0||m|5
Chamdo|China|31.15|97.2|TIB|0.5|0||m|1
Chengde|China|40.97|117.95|MAN|4|0||m|2
Mukden|China|41.8|123.4|MAN|5.88|3|c3i3|p|10
Hsinking|China|43.9|125.3|MAN|5.6|1||p|10
Harbin|China|45.75|126.65|MAN|3.92|1||p|5
Qiqihar|China|47.35|124|MAN|2.1|0||p|2
Hailar|China|49.2|119.7|MAN|0.5|0||p|1
Dairen|China|38.9|121.6|JAP|1.5|3||h|5
Hong Kong|Hong Kong|22.3|114.2|ENG|1|2||u|10
Taihoku|Taiwan|25.05|121.5|JAP|5.5|1||m|4
Ulan Bator|Mongolia|47.9|106.9|MON|0.75|0||p|5
Keijo|South Korea|37.55|127|JAP|14|1||h|6
Heijo|North Korea|39|125.75|JAP|5.6|2|c2i2|m|4
Tokyo|Japan|35.7|139.7|JAP|20|5||u|30
Osaka|Japan|34.7|135.5|JAP|16|5||u|15
Nagoya|Japan|35.2|136.9|JAP|7|4||h|8
Hiroshima|Japan|34.4|132.45|JAP|7|3||h|5
Fukuoka|Japan|33.6|130.4|JAP|4.41|4|c3|h|6
Sendai|Japan|38.25|140.9|JAP|4.2|1||m|3
Sapporo|Japan|43.05|141.35|JAP|3|1|c2|m|3
Rabat|Morocco|34|-6.85|FRA|2.45|0||h|4
Marrakech|Morocco|31.6|-8|FRA|2|0||m|1
Tetuan|Morocco|35.57|-5.37|SPA|0.39|0|i1|m|2
Villa Cisneros|W. Sahara|23.7|-15.9|SPA|0.03|0||d|1
Algiers|Algeria|36.75|3.05|FRA|3.5|1||h|5
Oran|Algeria|35.7|-0.65|FRA|1.5|0||h|2
Constantine|Algeria|36.35|6.6|FRA|2|0|i1|m|2
Colomb-Béchar|Algeria|31.6|-2.2|FRA|0.2|0||d|1
Tamanrasset|Algeria|22.8|5.5|FRA|0.2|0||d|1
Tunis|Tunisia|36.8|10.2|FRA|1.82|0||h|4
Tripoli|Libya|32.9|13.2|ITA|0.35|0||d|4
Benghazi|Libya|32.1|20.05|ITA|0.21|0||d|3
Sabha|Libya|27|14.4|ITA|0.05|0||d|1
Cairo|Egypt|30.05|31.25|EGY|5.6|1||d|10
Alexandria|Egypt|31.2|29.9|EGY|1.96|1||d|6
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
New York|United States of America|40.7|-74|USA|11.9|5||u|30
Boston|United States of America|42.35|-71.05|USA|8|5||h|8
Washington|United States of America|38.9|-77.05|USA|4.2|3||p|30
Pittsburgh|United States of America|40.45|-80|USA|7|5|c5i1|h|8
Detroit|United States of America|42.35|-83.05|USA|4.2|5||p|10
Chicago|United States of America|41.85|-87.65|USA|8.4|5||u|15
Cincinnati|United States of America|39.1|-84.5|USA|6.3|4|c2|h|5
Charlotte|United States of America|35.2|-80.85|USA|7|2||h|3
Atlanta|United States of America|33.75|-84.4|USA|6.3|2||h|5
Miami|United States of America|25.8|-80.2|USA|2|1||s|3
Birmingham AL|United States of America|33.5|-86.8|USA|3.5|2|i2c2|h|3
New Orleans|United States of America|29.95|-90.1|USA|5|1|o2|s|5
Memphis|United States of America|35.15|-90.05|USA|3.5|1||p|2
St. Louis|United States of America|38.63|-90.2|USA|6|3||p|5
Minneapolis|United States of America|44.98|-93.27|USA|5|2|i5|f|4
Kansas City|United States of America|39.1|-94.6|USA|2.8|1||p|2
Bismarck|United States of America|46.8|-100.8|USA|2|0||p|1
Oklahoma City|United States of America|35.5|-97.5|USA|3|1|o4|p|2
Dallas|United States of America|32.8|-96.8|USA|3.5|1|o3|p|3
Houston|United States of America|29.75|-95.35|USA|2.1|2|o5|p|5
Denver|United States of America|39.75|-105|USA|2|1|c1|m|2
Helena|United States of America|46.6|-112|USA|0.84|0||m|1
Salt Lake City|United States of America|40.75|-111.9|USA|1|0|i1|m|1
Albuquerque|United States of America|35.1|-106.6|USA|0.35|0||d|1
Phoenix|United States of America|33.45|-112.07|USA|1|0||d|1
Seattle|United States of America|47.6|-122.3|USA|1.89|3||m|5
San Francisco|United States of America|37.8|-122.4|USA|3.5|3||h|10
Los Angeles|United States of America|34.05|-118.25|USA|2.45|3|o4|h|10
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
Kiel|Germany|54.32|10.13|GER|1.8|3||p|3
Bremen|Germany|53.08|8.8|GER|1.26|3||p|4
Münster|Germany|51.96|7.63|GER|3.6|4||p|3
Cologne|Germany|50.94|6.96|GER|2.52|5|c3|u|6
Kassel|Germany|51.31|9.48|GER|1.5|2||h|3
Dresden|Germany|51.05|13.74|GER|2.4|5||h|5
Magdeburg|Germany|52.13|11.63|GER|1.68|4||p|3
Nuremberg|Germany|49.45|11.08|GER|2.1|3||h|5
Würzburg|Germany|49.79|9.95|GER|1.8|3||h|2
Freiburg|Germany|47.99|7.85|GER|1.5|3||m|2
Rostock|Germany|54.09|12.1|GER|0.84|3||p|2
Saarbrücken|Germany|49.24|6.99|GER|1.26|3|c2|h|3
Koblenz|Germany|50.36|7.59|GER|0.84|3||h|2
Regensburg|Germany|49.01|12.1|GER|1.47|2||h|2
Oppeln|Poland|50.67|17.93|GER|1.35|2|c2|p|2
Köslin|Poland|54.19|16.17|GER|0.6|1||p|1
Schneidemühl|Poland|53.15|16.74|GER|0.42|1||f|1
Liegnitz|Poland|51.21|16.16|GER|0.94|2||p|2
Bydgoszcz|Poland|53.12|18.0|POL|1.05|1||p|3
Toruń|Poland|53.01|18.6|POL|0.45|1||p|2
Radom|Poland|51.4|21.15|POL|1.8|2||p|2
Kielce|Poland|50.87|20.63|POL|1.5|1|i1|h|2
Tarnów|Poland|50.01|20.99|POL|1.05|1||h|2
Rzeszów|Poland|50.04|22.0|POL|0.9|0||h|2
Częstochowa|Poland|50.81|19.12|POL|0.6|3||p|3
Płock|Poland|52.55|19.7|POL|1.2|2||p|2
Siedlce|Poland|52.17|22.29|POL|1.26|2||p|1
Kalisz|Poland|51.76|18.09|POL|0.84|2||p|1
Grodno|Belarus|53.68|23.83|POL|0.6|0||f|2
Pinsk|Belarus|52.11|26.1|POL|0.45|0||s|1
Łuck|Ukraine|50.75|25.34|POL|0.6|0||f|2
Tarnopol|Ukraine|49.55|25.59|POL|1.2|1||p|2
Stanisławów|Ukraine|48.92|24.71|POL|0.84|1|o1|h|2
Rouen|France|49.44|1.1|FRA|2.7|4||p|4
Caen|France|49.18|-0.37|FRA|1.89|4||p|2
Brest|France|48.39|-4.49|FRA|1.5|1||h|3
Rennes|France|48.11|-1.68|FRA|1.05|1||p|2
Orléans|France|47.9|1.9|FRA|1.26|4||p|2
Tours|France|47.39|0.69|FRA|0.05|4||p|2
Dijon|France|47.32|5.04|FRA|1.8|2||h|2
Strasbourg|France|48.58|7.75|FRA|1.2|4||p|5
Reims|France|49.26|4.03|FRA|0.05|4||p|3
Amiens|France|49.89|2.3|FRA|1.5|3||p|2
Limoges|France|45.83|1.26|FRA|1.35|1||h|2
Clermont-Ferrand|France|45.78|3.08|FRA|1.26|2||m|2
Grenoble|France|45.19|5.72|FRA|0.84|2||m|2
Nice|France|43.7|7.27|FRA|1.5|2||m|3
Montpellier|France|43.61|3.88|FRA|1.05|2||h|2
Ajaccio|France|41.93|8.74|FRA|0.7|2||m|1
Poitiers|France|46.58|0.34|FRA|0.94|1||p|1
Dunkirk|France|51.03|2.37|FRA|1.05|3|c1|p|2
Besançon|France|47.24|6.02|FRA|0.84|3||h|2
Plymouth|United Kingdom|50.38|-4.14|ENG|0.9|2||h|3
Southampton|United Kingdom|50.9|-1.4|ENG|3.6|4||p|3
Norwich|United Kingdom|52.63|1.3|ENG|2.52|4||p|2
Newcastle|United Kingdom|54.98|-1.62|ENG|3.3|4|c3|h|4
Leeds|United Kingdom|53.8|-1.55|ENG|2.31|4|c2|h|4
Edinburgh|United Kingdom|55.95|-3.19|ENG|1.5|4||h|5
Aberdeen|United Kingdom|57.15|-2.09|ENG|1.05|3||h|2
Inverness|United Kingdom|57.48|-4.22|ENG|0.7|3||m|1
Liverpool|United Kingdom|53.41|-2.98|ENG|1.54|5||u|5
Bristol|United Kingdom|51.45|-2.59|ENG|0.63|2||h|3
Dover|United Kingdom|51.13|1.31|ENG|1.68|4||p|2
Antwerp|Belgium|51.22|4.4|BEL|2.49|4||u|5
Liège|Belgium|50.63|5.57|BEL|1.74|3|c2i1|h|3
Rotterdam|Netherlands|51.92|4.48|HOL|1.45|4||u|5
Groningen|Netherlands|53.22|6.57|HOL|1.78|3||p|2
Genoa|Italy|44.41|8.93|ITA|2.7|5||h|5
Bologna|Italy|44.49|11.34|ITA|1.5|1||p|4
Trieste|Italy|45.65|13.78|ITA|1.26|2||h|3
Bari|Italy|41.12|16.87|ITA|2.1|1||p|3
Ancona|Italy|43.62|13.52|ITA|0.74|1||h|2
Reggio Calabria|Italy|38.11|15.65|ITA|1.2|0||m|2
Taranto|Italy|40.46|17.25|ITA|1.47|1||p|3
Pescara|Italy|42.46|14.21|ITA|2.1|2||h|1
Bolzano|Italy|46.5|11.35|ITA|1.26|2||m|2
Catania|Italy|37.5|15.09|ITA|0.84|0||h|2
Sassari|Italy|40.73|8.56|ITA|0.3|0||h|1
Granada|Spain|37.18|-3.6|SPA|1.5|0||m|3
Málaga|Spain|36.72|-4.42|SPA|0.24|0||h|3
Valladolid|Spain|41.65|-4.72|SPA|1.5|1||p|3
Badajoz|Spain|38.88|-6.97|SPA|1.05|0||p|2
Murcia|Spain|37.98|-1.13|SPA|0.9|0||h|2
Salamanca|Spain|40.96|-5.66|SPA|1.05|1||p|2
Toledo|Spain|39.86|-4.02|SPA|0.7|1||h|2
Oviedo|Spain|43.36|-5.85|SPA|0.9|0|c2|m|3
Almería|Spain|36.84|-2.46|SPA|0.17|0||h|1
Lleida|Spain|41.62|0.62|SPA|0.45|0||h|2
Malmö|Sweden|55.6|13.0|SWE|0.69|2||p|3
Sundsvall|Sweden|62.39|17.31|SWE|0.9|2||f|1
Trondheim|Norway|63.43|10.39|NOR|0.57|1||m|3
Aarhus|Denmark|56.16|10.2|DEN|0.51|2||p|2
Turku|Finland|60.45|22.27|FIN|0.69|1||p|3
Tampere|Finland|61.5|23.76|FIN|0.48|1||f|2
Tartu|Estonia|58.38|26.72|EST|0.33|0||p|2
Daugavpils|Latvia|55.87|26.52|LAT|0.57|0||f|2
Liepāja|Latvia|56.51|21.01|LAT|0.4|0||p|1
Šiauliai|Lithuania|55.93|23.31|LIT|0.6|0||p|1
Pilsen|Czechia|49.75|13.38|CZE|0.45|2|c1|h|4
Olomouc|Czechia|49.59|17.25|CZE|0.9|2||h|2
Ostrava|Czechia|49.83|18.28|CZE|0.63|2|c3i1|h|3
Budějovice|Czechia|48.97|14.47|CZE|1.5|3||h|2
Banská Bystrica|Slovakia|48.74|19.15|CZE|0.3|0||m|2
Graz|Austria|47.07|15.44|AUT|1.35|2||m|3
Linz|Austria|48.31|14.29|AUT|0.94|2|i1|h|3
Salzburg|Austria|47.8|13.04|AUT|0.66|0||m|2
Szeged|Hungary|46.25|20.15|HUN|1.5|2||p|2
Pécs|Hungary|46.07|18.23|HUN|1.05|2|c1|h|2
Győr|Hungary|47.68|17.63|HUN|0.7|2||p|2
Miskolc|Hungary|48.1|20.78|HUN|1.2|0|i1|h|2
Brașov|Romania|45.66|25.6|ROM|0.6|1||m|3
Craiova|Romania|44.32|23.8|ROM|1.5|1||p|2
Galați|Romania|45.44|28.05|ROM|0.3|0||p|2
Oradea|Romania|47.07|21.93|ROM|1.5|0||p|2
Sibiu|Romania|45.79|24.15|ROM|1.05|0||m|2
Bălți|Moldova|47.76|27.93|ROM|0.9|0||p|1
Cetatea Albă|Ukraine|46.19|30.34|ROM|0.75|0||p|1
Novi Sad|Serbia|45.25|19.84|YUG|1.5|0||p|2
Niš|Serbia|43.32|21.9|YUG|0.18|0||h|2
Split|Croatia|43.51|16.44|YUG|0.75|0||m|3
Osijek|Croatia|45.55|18.69|YUG|1.05|0||p|1
Banja Luka|Bosnia and Herz.|44.77|17.19|YUG|0.53|0||m|2
Mostar|Bosnia and Herz.|43.34|17.81|YUG|0.35|0||m|1
Plovdiv|Bulgaria|42.14|24.75|BUL|0.84|0||p|2
Ioannina|Greece|39.66|20.85|GRE|0.59|0||m|2
Larissa|Greece|39.64|22.42|GRE|0.59|0||p|2
Patras|Greece|38.25|21.73|GRE|1.2|0||m|2
Heraklion|Greece|35.34|25.13|GRE|0.84|0||m|2
Shkodër|Albania|42.07|19.51|ALB|0.3|0||m|1
Vlorë|Albania|40.47|19.49|ALB|0.21|0||m|1
Bursa|Turkey|40.19|29.06|TUR|1.05|1||h|3
Konya|Turkey|37.87|32.48|TUR|1.2|0||p|2
Samsun|Turkey|41.29|36.33|TUR|0.84|0||h|2
Trabzon|Turkey|41.0|39.72|TUR|0.9|0||m|2
Diyarbakır|Turkey|37.91|40.24|TUR|0.63|0||h|2
Antalya|Turkey|36.9|30.7|TUR|0.9|0||m|1
Edirne|Turkey|41.68|26.56|TUR|0.73|1||p|2
Sivas|Turkey|39.75|37.02|TUR|0.53|0||m|1
Novgorod|Russia|58.52|31.28|SOV|1.8|3||f|3
Pskov|Russia|57.82|28.33|SOV|1.26|3||f|2
Kalinin|Russia|56.86|35.9|SOV|3.6|4||f|3
Yaroslavl|Russia|57.63|39.87|SOV|2.52|4||f|3
Vologda|Russia|59.22|39.89|SOV|1.8|3||f|2
Ivanovo|Russia|57.0|40.97|SOV|1.26|3||f|2
Tula|Russia|54.19|37.62|SOV|1.68|4|c2|p|4
Ryazan|Russia|54.63|39.74|SOV|0.05|4||p|2
Kaluga|Russia|54.51|36.26|SOV|0.05|4||f|2
Bryansk|Russia|53.24|34.36|SOV|1.8|0||f|3
Orel|Russia|52.97|36.07|SOV|1.26|0||p|3
Tambov|Russia|52.72|41.45|SOV|1.5|1||p|2
Penza|Russia|53.2|45.0|SOV|1.5|1||p|2
Saratov|Russia|51.53|46.03|SOV|1.05|1||p|3
Lipetsk|Russia|52.61|39.6|SOV|1.05|1|i1|p|2
Belgorod|Russia|50.6|36.6|SOV|1.8|3||p|2
Vladimir|Russia|56.13|40.4|SOV|0.05|4||f|2
Velikiye Luki|Russia|56.34|30.53|SOV|0.45|0||f|2
Kirov|Russia|58.6|49.66|SOV|1.5|1||f|2
Astrakhan|Russia|46.35|48.04|SOV|0.3|0||s|2
Elista|Russia|46.31|44.26|SOV|0.9|2||d|1
Ordzhonikidze|Russia|43.02|44.68|SOV|0.9|0||m|2
Makhachkala|Russia|42.98|47.5|SOV|0.63|0|o1|m|2
Stavropol|Russia|45.04|41.97|SOV|0.9|0||p|2
Novorossiysk|Russia|44.72|37.77|SOV|0.63|0|o1|h|2
Chkalov|Russia|51.77|55.1|SOV|0.3|0||p|2
Ulyanovsk|Russia|54.32|48.4|SOV|0.7|1||p|2
Zhitomir|Ukraine|50.25|28.66|SOV|1.2|0||f|2
Poltava|Ukraine|49.59|34.55|SOV|1.26|3||p|2
Chernigov|Ukraine|51.49|31.29|SOV|0.45|0||f|2
Kirovograd|Ukraine|48.51|32.26|SOV|1.5|3|i3|p|2
Zaporozhye|Ukraine|47.84|35.14|SOV|1.05|3||p|3
Nikolaev|Ukraine|46.97|32.0|SOV|1.2|1||p|2
Sumy|Ukraine|50.91|34.8|SOV|0.84|0||p|1
Voroshilovgrad|Ukraine|48.57|39.33|SOV|1.5|4|c4|p|3
Mariupol|Ukraine|47.1|37.55|SOV|1.05|4|i1|p|2
Kerch|Ukraine|45.36|36.47|SOV|0.42|0|i2|p|2
Proskurov|Ukraine|49.42|26.98|SOV|0.84|0||p|1
Uman|Ukraine|48.75|30.22|SOV|0.56|0||p|1
Mogilev|Belarus|53.9|30.34|SOV|0.32|0||f|2
Bobruisk|Belarus|53.14|29.22|SOV|0.9|1||s|2
Mozyr|Belarus|52.05|29.25|SOV|0.32|0||s|1
Polotsk|Belarus|55.49|28.79|SOV|0.22|0||f|1
Baoding|China|38.87|115.46|CHI|5.4|0||p|3
Shijiazhuang|China|38.04|114.51|CHI|3|1||p|2
Datong|China|40.08|113.3|SHX|0.9|0|c4|h|3
Luoyang|China|34.62|112.45|CHI|9.9|0||h|3
Kaifeng|China|34.8|114.31|CHI|6.93|0||p|2
Anqing|China|30.51|117.04|CHI|4.8|0||h|2
Hefei|China|31.82|117.23|CHI|10.5|0||p|2
Yichang|China|30.7|111.29|CHI|7.8|1||m|3
Hengyang|China|26.89|112.57|CHI|8.4|0||h|2
Guilin|China|25.27|110.29|GXC|3.9|0||m|2
Shantou|China|23.35|116.68|CHI|3.6|0||h|2
Wenzhou|China|28.0|120.67|CHI|2.52|0||h|2
Ningbo|China|29.87|121.54|CHI|6|0||p|3
Suzhou|China|31.3|120.58|CHI|4.5|2||p|3
Lianyungang|China|34.6|119.2|CHI|6|0||p|1
Yantai|China|37.46|121.45|CHI|2.4|0||h|2
Handan|China|36.6|114.5|CHI|4.62|0||p|2
Xiangyang|China|32.0|112.12|CHI|5.46|1||p|2
Nanyang|China|33.0|112.53|CHI|0.05|0||p|2
Ganzhou|China|25.83|114.93|CHI|5.88|0||m|2
Zunyi|China|27.72|106.92|YUN|3|0||m|2
Mianyang|China|31.47|104.68|SIC|8.1|0||h|2
Wanxian|China|30.8|108.4|SIC|7.5|0||m|2
Baotou|China|40.66|109.84|SHX|0.63|0|i2|d|2
Yinchuan|China|38.47|106.27|XSM|1.8|0||d|2
Tianshui|China|34.58|105.72|XSM|1.26|0||m|1
Hanzhong|China|33.07|107.03|CHI|3|0||m|2
Yulin|China|38.29|109.73|PRC|0.45|0||d|1
Jinzhou|China|41.12|121.13|MAN|3.6|2||p|2
Andong|China|40.12|124.38|MAN|2.52|2||h|2
Jilin|China|43.84|126.55|MAN|2.4|0||f|3
Mudanjiang|China|44.55|129.63|MAN|2.4|0||f|2
Jiamusi|China|46.8|130.32|MAN|1.68|0||f|1
Heihe|China|50.24|127.49|MAN|0.9|0||f|1
Fusan|South Korea|35.18|129.08|JAP|2.7|3||h|3
Kanko|North Korea|39.92|127.54|JAP|2.4|1|c1|m|2
Kagoshima|Japan|31.6|130.56|JAP|1.89|3||m|2
Niigata|Japan|37.92|139.04|JAP|1.8|0||p|2
Kanazawa|Japan|36.56|136.66|JAP|3|3||h|2
Tobruk|Libya|32.08|23.96|ITA|0.05|0||d|3
Misrata|Libya|32.37|15.09|ITA|0.15|0||d|1
Mersa Matruh|Egypt|31.35|27.24|EGY|1.2|0||d|2
El Alamein|Egypt|30.83|28.95|EGY|0.84|0||d|2
Suez|Egypt|29.97|32.53|EGY|2.4|0||d|4
Sfax|Tunisia|34.74|10.76|FRA|0.78|0||d|2
Casablanca|Morocco|33.57|-7.59|FRA|1.5|0||p|4
Fez|Morocco|34.03|-5.0|FRA|1.05|0||h|2
Aleppo|Syria|36.2|37.13|FRA|0.19|0||d|3
Buffalo|United States of America|42.89|-78.88|USA|3|4||p|4
Philadelphia|United States of America|39.95|-75.17|USA|5.1|5||u|8
Cleveland|United States of America|41.5|-81.69|USA|1.8|5|i1|p|5
Indianapolis|United States of America|39.77|-86.16|USA|2.7|3||p|3
Milwaukee|United States of America|43.04|-87.91|USA|3.6|4||p|3
Jacksonville|United States of America|30.33|-81.66|USA|2.7|1||s|2
Norfolk|United States of America|36.85|-76.29|USA|1.8|2||p|3
San Antonio|United States of America|29.42|-98.49|USA|0.9|1|o2|p|3
Portland|United States of America|45.52|-122.68|USA|0.81|2||f|3
San Diego|United States of America|32.72|-117.16|USA|1.05|2||h|3
Omaha|United States of America|41.26|-95.94|USA|1.2|0||p|2
Nashville|United States of America|36.16|-86.78|USA|1.5|1||h|2
Little Rock|United States of America|34.75|-92.29|USA|1.5|0||f|2
El Paso|United States of America|31.76|-106.49|USA|0.15|0||d|1
Boise|United States of America|43.62|-116.2|USA|0.36|0||m|1
Patna|India|25.6|85.1|RAJ|16.5|0||p|3
Indore|India|22.72|75.86|RAJ|4.5|0||p|2
Amritsar|India|31.63|74.87|RAJ|6|0||p|3
Cuttack|India|20.46|85.88|RAJ|13.5|1||p|2
Vizagapatam|India|17.69|83.22|RAJ|6|0||h|2
Poona|India|18.52|73.86|RAJ|8.4|1||h|3
Allahabad|India|25.44|81.85|RAJ|11.55|0||p|3
Multan|Pakistan|30.16|71.52|RAJ|4.2|0||d|2
Chittagong|Bangladesh|22.35|91.78|RAJ|10.5|0||h|2
Moulmein|Myanmar|16.49|97.63|ENG|2.7|0||j|2
Myitkyina|Myanmar|25.38|97.4|ENG|1.8|0||j|1
Penang|Malaysia|5.41|100.33|ENG|1.2|0|r2|j|2
Haiphong|Vietnam|20.86|106.68|FRA|2.7|0||p|3
Dobrich|Bulgaria|43.57|27.83|ROM|0.21|0||p|2
Ruse|Bulgaria|43.85|25.97|BUL|0.66|0||p|2
Burgas|Bulgaria|42.5|27.47|BUL|0.46|0||p|2
Vidin|Bulgaria|43.99|22.88|BUL|0.84|0||p|1
Stara Zagora|Bulgaria|42.43|25.63|BUL|0.36|0||p|1
Bitola|Macedonia|41.03|21.33|YUG|0.3|0||m|1
Kragujevac|Serbia|44.01|20.91|YUG|0.73|0||h|2
Dubrovnik|Croatia|42.65|18.09|YUG|0.12|0||m|1
Fiume|Croatia|45.33|14.44|ITA|0.54|1||h|2
Zara|Croatia|44.12|15.23|ITA|0.32|0||h|1
Kavala|Greece|40.94|24.41|GRE|0.41|0||h|2
Alexandroupoli|Greece|40.85|25.87|GRE|0.29|0||p|1
Corfu|Greece|39.62|19.92|GRE|0.25|0||h|1
Rhodes|Greece|36.43|28.22|ITA|0.05|0||h|2
Alexandretta|Turkey|36.58|36.17|FRA|0.08|0||h|2
Kayseri|Turkey|38.72|35.49|TUR|0.22|0||m|2
Van|Turkey|38.5|43.38|TUR|0.44|0||m|1
Zonguldak|Turkey|41.45|31.79|TUR|0.59|0|c3|h|2
Arad|Romania|46.18|21.31|ROM|0.45|0||p|1
Suceava|Romania|47.65|26.26|ROM|0.24|0||f|1
Cádiz|Spain|36.53|-6.29|SPA|0.48|2||p|3
Gibraltar|Spain|36.14|-5.35|ENG|0.02|3||u|5
Santander|Spain|43.46|-3.8|SPA|0.4|2|i1|m|2
Palma|Spain|39.57|2.65|SPA|0.4|2||h|2
Las Palmas|Spain|28.1|-15.43|SPA|0.6|1||h|2
Luleå|Sweden|65.58|22.15|SWE|0.25|2||f|2
Visby|Sweden|57.64|18.29|SWE|0.06|1||p|1
Örebro|Sweden|59.27|15.21|SWE|0.6|3|i1|f|2
Rjukan|Norway|59.88|8.59|NOR|0.15|2||m|2
Kristiansand|Norway|58.15|8.0|NOR|0.2|2||m|2
Tromsø|Norway|69.65|18.96|NOR|0.1|1||m|1
Odense|Denmark|55.4|10.39|DEN|0.6|3||p|3
Aalborg|Denmark|57.05|9.92|DEN|0.4|2||p|2
Utrecht|Netherlands|52.09|5.12|HOL|0.9|4||p|3
Eindhoven|Netherlands|51.44|5.47|HOL|0.8|4||p|2
Vlissingen|Netherlands|51.44|3.57|HOL|0.3|3||s|2
Ghent|Belgium|51.05|3.72|BEL|1.0|4||p|3
Charleroi|Belgium|50.41|4.44|BEL|0.8|4|c2|p|2
Esch|Luxembourg|49.5|5.98|LUX|0.08|4|i2|h|1
`;
if (typeof module !== 'undefined') module.exports = PROV_RAW;
