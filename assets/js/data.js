/* =====================================================================
   GROUNDED DATASETS FROM MASALA LAB (KRISH ASHOK, 2020)
===================================================================== */
const CHAPTER_CARDS = [
  { id: 'ch1', sym: 'Ht', hue: '#0ea5e9', num: '01', title: 'Zero-Pressure Cooking', tag: 'Physics & Staples', metric: '121°C peak', summary: 'Thermal scale (0–480°C), 2×2 cooking methods, 15 fat smoke points, cookware matrix, and whistle-free pressure timers.' },
  { id: 'ch2', sym: 'Sp', hue: '#d97706', num: '02', title: 'Science of Spice & Flavour', tag: '23-Spice Graph', metric: '80% nose', summary: 'Interactive 23-spice volatile molecule pairing network, taste modulation map, Scoville chart, and 12 global/Indian blends.' },
  { id: 'ch3', sym: 'Mr', hue: '#c2410c', num: '03', title: 'Brown, Baby, Brown', tag: 'Maillard Lab', metric: '110–170°C', summary: '5-stage onion browning simulator, garlic water-content trap, 6 Maillard aroma classes, and deep-frying diagnostics.' },
  { id: 'ch4', sym: 'pH', hue: '#16a34a', num: '04', title: 'Dropping Acid', tag: 'pH & Layering', metric: 'pH 4.3–4.9', summary: 'Culinary pH meter, 9 Indian acid profilers, homemade yoghurt temps (85°C→45°C), and 4-layer chaat acid architecture.' },
  { id: 'ch5', sym: 'Um', hue: '#7c3aed', num: '05', title: 'Umami, Soda, Rum', tag: 'Myth-Busters', metric: 'T1R1/T1R3', summary: 'Umami glutamate + IMP/GMP synergy calculator, WhatsApp myth-busters, baking soda tricks, and 5 alcohol techniques.' },
  { id: 'ch6', sym: 'Mw', hue: '#0f766e', num: '06', title: 'Taking It to the Next Level', tag: 'Modernist Kitchen', metric: '12 cm wave', summary: 'Microwave 2450 MHz dead-spot visualizer, 10-cut sous vide chart, sodium citrate, xanthan gum, and liquid smoke.' },
  { id: 'ch7', sym: 'Rx', hue: '#b91c1c', num: '07', title: 'Burn the Recipe', tag: '5 Dish Engines', metric: '8-block stack', summary: 'Live regional Gravy Algorithm, 7-bread hydration calculator, 8% brining calculator, Chutney/Raita, Salad & Rice generators.' },
  { id: 'ch8', sym: 'By', hue: '#4f46e5', num: '08', title: 'The Biryani & Methodology', tag: '6-Track Gantt', metric: '5 regions', summary: 'Parallel 6-track biryani planner with kitchen timer, 5-layer dum diagram, regional comparator, and A/B Chapatti Log.' }
];

// Search index for the command palette + home search (every interactive tool)
const SECTION_INDEX = [
  { id: 'sec-thermal', tab: 'ch1', title: 'Thermal spectrum 0–480°C', kw: 'temperature heat thermometer kinetic molecules water steam ice phase protein collagen starch' },
  { id: 'sec-boiling', tab: 'ch1', title: 'Boiling point vs altitude & pressure', kw: 'antoine pressure cooker altitude shimla leh boiling kpa bar mountain' },
  { id: 'sec-quadrant', tab: 'ch1', title: '2×2 cooking method matrix', kw: 'moist dry slow fast braise roast steam fry' },
  { id: 'sec-pressure', tab: 'ch1', title: 'Peak-pressure timer (no whistles)', kw: 'pressure cooker whistle dal chana rajma legumes vegetables baking soda' },
  { id: 'sec-fats', tab: 'ch1', title: 'Fat & oil smoke points', kw: 'oil ghee butter smoke point frying olive coconut' },
  { id: 'sec-cookware', tab: 'ch1', title: 'Cookware material matrix', kw: 'cast iron copper aluminium steel tri-ply non-stick acid rice amylose' },
  { id: 'sec-spice-network', tab: 'ch2', title: '23-spice molecular pairing network', kw: 'spice molecule pairing masala builder cinnamon cumin cardamom limonene pinene structure smiles' },
  { id: 'sec-taste', tab: 'ch2', title: 'Taste modulation map', kw: 'salt sweet sour bitter enhance suppress' },
  { id: 'sec-scoville', tab: 'ch2', title: 'Scoville chilli heat chart', kw: 'chilli capsaicin scoville trpv1 bhut jolokia guntur kashmiri' },
  { id: 'sec-blends', tab: 'ch2', title: '12 spice blend proportions', kw: 'garam masala sambar rasam chai chaat zaatar baharat five spice ras el hanout' },
  { id: 'sec-onion', tab: 'ch3', title: '5-stage onion browning simulator', kw: 'onion caramelize brown stage maillard baking soda' },
  { id: 'sec-allium', tab: 'ch3', title: 'Onion & garlic cut damage', kw: 'garlic onion cut mince paste allicin tears' },
  { id: 'sec-fry', tab: 'ch3', title: 'Deep-frying oil diagnostics', kw: 'deep fry puri vada temperature oil crisp' },
  { id: 'sec-maillard', tab: 'ch3', title: 'Maillard pathway & 6 flavour families', kw: 'maillard furan pyrazine thiophene melanoidin acrylamide browning' },
  { id: 'sec-ph', tab: 'ch4', title: 'Interactive pH scale', kw: 'ph acid alkaline hydrogen ion coca-cola vinegar baking soda' },
  { id: 'sec-acids', tab: 'ch4', title: 'Indian acid profiler', kw: 'tamarind kokum yoghurt tomato amchoor lime vinegar anardana' },
  { id: 'sec-chaat', tab: 'ch4', title: 'Chaat acid layering', kw: 'chaat chutney layer acid' },
  { id: 'sec-umami', tab: 'ch5', title: 'Umami synergy (Yamaguchi model)', kw: 'umami msg glutamate imp gmp synergy mushroom kombu' },
  { id: 'sec-myths', tab: 'ch5', title: 'Myth vs science cards', kw: 'myth whatsapp msg marinade potato salt soda' },
  { id: 'sec-alcohol', tab: 'ch5', title: 'Alcohol cooking techniques', kw: 'alcohol vodka rum deglaze beer wine pakora' },
  { id: 'sec-microwave', tab: 'ch6', title: 'Microwave standing-wave visualizer', kw: 'microwave wave papad 2450 mhz node dead spot' },
  { id: 'sec-mwhacks', tab: 'ch6', title: 'Microwave hacks', kw: 'microwave ghee butter chana pulao herbs' },
  { id: 'sec-sousvide', tab: 'ch6', title: 'Sous vide time & temperature', kw: 'sous vide chicken mutton pork beef vegetables' },
  { id: 'sec-pantry', tab: 'ch6', title: 'Modernist pantry', kw: 'sodium citrate xanthan lecithin bisulphite liquid smoke' },
  { id: 'gen-panel-gravy', tab: 'ch7', gen: 'gravy', title: 'Gravy algorithm generator', kw: 'gravy curry punjabi makhani chettinad malabar mughlai bengali gujarati jain' },
  { id: 'gen-panel-bread', tab: 'ch7', gen: 'bread', title: 'Bread hydration & 8% brine calculators', kw: 'bread chapatti roti naan paratha puri hydration brine salt chicken' },
  { id: 'gen-panel-chutney', tab: 'ch7', gen: 'chutney', title: 'Chutney & raita generator', kw: 'chutney raita' },
  { id: 'gen-panel-salad', tab: 'ch7', gen: 'salad', title: 'Salad & 3:1 dressing generator', kw: 'salad dressing vinaigrette' },
  { id: 'gen-panel-rice', tab: 'ch7', gen: 'rice', title: 'Rice dish algorithms', kw: 'rice pulao khichdi pongal lemon rice' },
  { id: 'sec-gantt', tab: 'ch8', title: '6-track biryani Gantt planner', kw: 'biryani gantt plan tracks' },
  { id: 'sec-timeline', tab: 'ch8', title: 'Interactive biryani preparation timeline', kw: 'timeline scrubber scrub playhead autoplay biryani plan timeline scrub timeline' },
  { id: 'sec-timer', tab: 'ch8', title: 'Kitchen countdown timer', kw: 'timer dum soak brine rest alarm' },
  { id: 'sec-biryani-regions', tab: 'ch8', title: 'Regional biryani matrix', kw: 'hyderabadi awadhi kolkata thalassery ambur' },
  { id: 'sec-log', tab: 'ch8', title: 'Chapatti A/B experiment log', kw: 'log experiment journal ab test hydration' },
  { id: 'sec-spice-quiz', tab: 'ch2', title: 'Spice molecule puzzle quiz', kw: 'quiz puzzle multiple choice molecule masala pairing knowledge check facts' },
  { id: 'sec-blind-taste', tab: 'ch4', title: 'Blind taste pH game', kw: 'game guess pH blind taste drag cursor reveal score' }
];

const SPICE_CATEGORY_COLORS = {
  'Sweet, warming phenols': '#d97706',
  'Warming terpenes': '#b45309',
  'Earthy terpenes': '#65a30d',
  'Fragrant terpenes': '#db2777',
  'Penetrating terpenes': '#0891b2',
  'Citrus terpenes': '#eab308',
  'Sulphurous & meaty': '#7c3aed',
  'Pungent': '#dc2626',
  'Complex flavour': '#ea580c',
  'Toasty pyrazines': '#78716c'
};

const THERMAL_MILESTONES = [
  { t: 0, label: '0°C', title: 'Water Freezes at Sea Level', badge: 'ICE CRYSTAL', regime: 'Phase Change · Solid', desc: 'Hydrogen bonds lock into an orderly hexagonal lattice, making ice less dense than liquid water (pp. 25, 42–43).', tip: 'Defrost frozen meat safely in a 39°C stirred water bath in 10–15 mins without cooking it (p. 61).' },
  { t: 24, label: '24°C', title: 'Coconut Oil Melts', badge: 'SATURATED FAT', regime: 'Lipid Melting Point', desc: 'High saturated fatty acid content keeps coconut oil, ghee, and butter solid below ~24°C (pp. 25, 64).', tip: 'Human taste buds peak between 20°C and 30°C—why room-temp coffee tastes more bitter than hot coffee (p. 71).' },
  { t: 29, label: '29°C', title: 'Chennai Declares Winter', badge: 'HUMOROUS BENCHMARK', regime: 'Ambient Fermentation', desc: 'Warm tropical Indian room temperatures supercharge lactobacteria for idli/dosa batter and yoghurt (pp. 25, 52, 71).', tip: 'In cold climates, preheat an oven, turn it off, and cool to 35°C for idli batter or 45°C for yoghurt.' },
  { t: 50, label: '50°C', title: 'Meat & Fish Proteins Begin to Denature', badge: 'PROTEIN THRESHOLD', regime: 'Gentle Heat', desc: 'Muscle proteins start unfolding. Below 55°C meat is uncooked and may harbour microbes (pp. 25, 59, 152).', tip: 'Brine meat in an 8% salt solution beforehand so muscle tissues hold onto water during heating.' },
  { t: 62, label: '62°C', title: 'Eggs Begin to Set / Juicy Meat Sweet Spot', badge: 'JUICY ZONE', regime: 'Moist / Sous Vide (55–65°C)', desc: 'Egg whites start firming up; meat stays succulent between 55°C and 65°C. Above 65°C proteins tighten and squeeze moisture out (pp. 25, 59).', tip: 'Salt broken eggs 15 minutes before scrambling so proteins uncoil into a fluffier bhurji or omelette (p. 62).' },
  { t: 68, label: '68°C', title: 'Collagen Breaks Down into Gelatin', badge: 'HYDROLYSIS', regime: 'Low & Slow / Sous Vide', desc: 'Tough connective tissue hydrolyzes into luscious gelatin between 65°C and 70°C—the secret to melt-in-the-mouth biryani mutton (pp. 25, 59, 152).', tip: 'Sous vide chicken breast at 64°C for 90 mins or tough mutton cuts at 70°C for 480 mins (p. 154).' },
  { t: 70, label: '70°C', title: 'Vegetable & Rice Starches Gelatinize', badge: 'GELATINIZATION', regime: 'Moist Heat (55–85°C)', desc: 'Amylose escapes raw starch granules and binds water, swelling rice, lentils, and potatoes (pp. 25, 29, 31, 49).', tip: 'Blanch leafy greens briefly at 85–100°C for 30 sec to deactivate polyphenol oxidase and preserve bright chlorophyll green (p. 58).' },
  { t: 100, label: '100°C', title: 'Water Boils at Sea Level', badge: 'MOIST CEILING', regime: 'Open Pot Moist Heat', desc: 'Water turns to steam at 100°C at sea level (92°C in Shimla at 7,500 ft). No Maillard browning can occur while liquid water remains (pp. 32, 44).', tip: 'Use boiling water in an open vessel for rice until starches gelatinize, then simmer low and rest 10 mins for retrogradation (p. 50).' },
  { t: 121, label: '121°C', title: 'Pressure Cooker Peak (+1 bar)', badge: 'PRESSURE PEAK', regime: 'Pressurized Moist Heat', desc: 'Trapped steam raises air pressure by ~1 bar, lifting water’s boiling point to 121°C and cutting cook time by 30–40% (p. 45).', tip: 'Measure elapsed minutes after full pressure—not whistles! You can even pressure-caramelize onions with butter for 20 mins (p. 106).' },
  { t: 154, label: '154°C', title: 'Maillard Reaction Peaking (110–170°C)', badge: 'FLAVOUR MAGIC', regime: 'Dry Heat · Sautéing / Roasting', desc: 'Sugars and amino acids react into furans, furanones, pyrazines, thiophenes, and melanoidins—the brown spectrum of deliciousness (pp. 25, 113–114).', tip: 'Leave food unmoved briefly on hot metal to brown, and add a tiny pinch of baking soda to accelerate browning.' },
  { t: 180, label: '180°C', title: 'Sugar Caramelizes & Deep-Frying Zone', badge: 'CRISP CRUST', regime: 'Dry Heat · Frying (170–190°C)', desc: 'Sucrose caramelizes (160–180°C; fructose at 110°C). At 170–190°C, hot oil instantly dehydrates batter surfaces into a waterproof crisp crust (pp. 33, 116).', tip: 'Use high-smoke-point refined oils or ghee (250°C). Hold freshly fried snacks in a 93°C oven so steam escapes and they stay crisp.' },
  { t: 250, label: '250°C', title: 'Ghee Smoke Point', badge: 'HIGH-HEAT FAT', regime: 'Smoke Point Threshold', desc: 'Ghee handles up to 250°C without smoking (vs. butter at 150°C or extra virgin olive oil at 160°C) (p. 65).', tip: 'Store oils airtight in cool, dark cupboards—light, water, and oxygen cleave fatty acids off glycerol, causing rancidity (p. 66).' },
  { t: 480, label: '480°C', title: 'Tandoor Convection Oven', badge: 'BLAZING DRY HEAT', regime: 'Extreme Convection & Radiation', desc: 'A charcoal tandoor (450–480°C) cooks marinated kebabs and naans so rapidly that interiors stay juicy while exteriors char (pp. 25, 41, 160).', tip: 'Home hack: smoke cooked dishes with a red-hot piece of charcoal + 1 tsp ghee in a covered pot for 2–3 mins (p. 151).' }
];

const QUADRANT_INFO = {
  'moist-slow': '<strong>Moist + Slow (&lt;100°C):</strong> Stewing and braising use small amounts of liquid over long durations to hydrolyze tough connective tissue (collagen → gelatin) in mutton or beef without drying out the surface (pp. 32–34).',
  'moist-fast': '<strong>Moist + Fast (&lt;100°C, 121°C under pressure):</strong> Blanching (30s for greens), poaching (85°C), simmering (90–95°C), steaming (retains nutrients for delicate momos/idlis), boiling, and pressure-cooking (121°C). Remember: zero Maillard browning happens here! (pp. 32–33).',
  'dry-slow': '<strong>Dry + Slow (&gt;100°C):</strong> Roasting, smoking, and barbecuing apply lower dry heat over longer windows—ideal for potatoes or wood-smoked meats where cellulose &amp; lignin break down into sweet, vanillin-like aromas (pp. 33, 151).',
  'dry-fast': '<strong>Dry + Fast (&gt;100°C):</strong> Sautéing (110–150°C), baking (convection air up to 230°C), broiling (infrared waves), and deep-frying (170–190°C). Rapid surface dehydration unleashes the Maillard reaction for crisp, intensely flavoured crusts (pp. 33, 116).'
};

const PRESSURE_ITEMS = [
  { name: 'Broccoli florets', cat: 'veg', mins: 2, soak: 'No soak', hard: false },
  { name: 'Cauliflower florets', cat: 'veg', mins: 2, soak: 'No soak', hard: false },
  { name: 'Beans', cat: 'veg', mins: 3, soak: 'No soak', hard: false },
  { name: 'Colocasia (Arbi)', cat: 'veg', mins: 3, soak: 'No soak', hard: false },
  { name: 'Carrot chunks', cat: 'veg', mins: 4, soak: 'No soak', hard: false },
  { name: 'Beetroot (cubed)', cat: 'veg', mins: 6, soak: 'No soak', hard: false },
  { name: 'Potato (small)', cat: 'veg', mins: 6, soak: 'No soak', hard: false },
  { name: 'Tapioca chunks', cat: 'veg', mins: 8, soak: 'No soak', hard: false },
  { name: 'Potato (large)', cat: 'veg', mins: 10, soak: 'No soak', hard: false },
  { name: 'Moong dal', cat: 'legume', mins: 6, soak: 'Optional', hard: false },
  { name: 'Toor dal', cat: 'legume', mins: 8, soak: 'Optional', hard: false },
  { name: 'Chana dal', cat: 'legume', mins: 15, soak: 'Soak 30 mins', hard: true },
  { name: 'Chickpea (Chana)', cat: 'legume', mins: 20, soak: 'Soak 8 hrs', hard: true },
  { name: 'Black urad dal', cat: 'legume', mins: 20, soak: 'Soak 8 hrs', hard: true },
  { name: 'Rajma (Kidney beans)', cat: 'legume', mins: 20, soak: 'Soak 8 hrs', hard: true }
];

const FATS_DATA = [
  { name: 'Butter', temp: 150, fry: false },
  { name: 'Extra virgin olive oil', temp: 160, fry: false },
  { name: 'Unrefined groundnut oil', temp: 160, fry: false },
  { name: 'Virgin coconut oil', temp: 177, fry: false },
  { name: 'Unrefined sesame oil', temp: 177, fry: false },
  { name: 'Refined olive oil', temp: 200, fry: true },
  { name: 'Vegetable oil (blended)', temp: 220, fry: true },
  { name: 'Refined groundnut oil', temp: 227, fry: true },
  { name: 'Refined coconut oil', temp: 232, fry: true },
  { name: 'Rice bran oil', temp: 232, fry: true },
  { name: 'Refined sesame oil', temp: 232, fry: true },
  { name: 'Palm oil', temp: 235, fry: true },
  { name: 'Ghee', temp: 250, fry: true },
  { name: 'Sunflower oil', temp: 252, fry: true },
  { name: 'Safflower oil', temp: 266, fry: true }
];

const COOKWARE_DATA = [
  { name: 'Aluminium', acidSafe: false, desc: 'Good conductor, cools fast when heat drops, reacts with acids (metallic taste). Cheap.' },
  { name: 'Anodized aluminium', acidSafe: true, desc: 'Advantages of aluminium + does not react with acids. Costlier than plain aluminium.' },
  { name: 'Stainless steel', acidSafe: true, desc: 'Poor conductor, retains heat well, non-reactive with acids. Price depends on steel grade.' },
  { name: 'Non-stick (Teflon)', acidSafe: true, desc: 'Sensitive to high heat (especially on induction); overheated fumes can kill small birds.' },
  { name: 'Ceramic non-stick', acidSafe: true, desc: 'Safer than Teflon (no toxic fumes), great dedicated egg skillet, but coating wears with harsh scrubbing.' },
  { name: 'Seasoned cast iron', acidSafe: false, desc: 'Retains heat insanely well, weighs a ton, reacts with acidic dishes like tomatoes/tamarind.' },
  { name: 'Tri-Ply', acidSafe: true, desc: 'Combines stainless steel non-reactivity with aluminium’s fast heat conduction. Costs an arm and a leg.' },
  { name: 'Copper', acidSafe: false, desc: 'Amazing heat conductor, reacts with acids, costs your entire extended family’s arms and legs.' }
];

// All 23 Spices from pp. 86–89
const SPICES_23 = [
  { id: 'Cinnamon', cat: 'Sweet, warming phenols', molecules: ['Cinnamaldehyde', 'Linalool', 'Eugenol', 'Caryophyllene'], notes: 'Warm, spicy, floral, woody, medicinal', pairs: ['Cumin', 'Cardamom', 'Clove', 'Pepper', 'Star Anise', 'Fennel', 'Shahjeera', 'Black Cardamom', 'Nigella', 'Ginger', 'Saffron', 'Ajwain', 'Fenugreek'] },
  { id: 'Clove', cat: 'Sweet, warming phenols', molecules: ['Eugenol', 'Caryophyllene'], notes: 'Medicinal, woody, warming, spicy, bitter', pairs: ['Cinnamon', 'Fenugreek', 'Pepper', 'Nutmeg', 'Mace'] },
  { id: 'Star Anise', cat: 'Sweet, warming phenols', molecules: ['Anethole', 'Cineole', 'Phellandrene'], notes: 'Sweet liquorice, medicinal, green peppery', pairs: ['Nutmeg', 'Mace', 'Cinnamon', 'Black Cardamom', 'Ginger', 'Pepper', 'Shahjeera', 'Cumin', 'Turmeric'] },
  { id: 'Fennel', cat: 'Sweet, warming phenols', molecules: ['Anethole', 'Limonene', 'Pinene'], notes: 'Sweet liquorice, citrus, herby, woody', pairs: ['Nutmeg', 'Mace', 'Cinnamon', 'Cardamom', 'Pepper', 'Cumin'] },
  { id: 'Nutmeg', cat: 'Warming terpenes', molecules: ['Myristicin', 'Geraniol', 'Eugenol', 'Sabinene'], notes: 'Woody, warm, rosy, medicinal, peppery', pairs: ['Ginger', 'Pepper', 'Curry Leaf', 'Cardamom', 'Clove', 'Star Anise', 'Fennel', 'Shahjeera', 'Coriander', 'Nigella', 'Black Cardamom', 'Ajwain', 'Turmeric'] },
  { id: 'Mace', cat: 'Warming terpenes', molecules: ['Sabinene', 'Terpineol', 'Safrole', 'Eugenol'], notes: 'Citrusy, peppery, floral, sweet warming', pairs: ['Pepper', 'Curry Leaf', 'Coriander', 'Star Anise', 'Clove', 'Fennel', 'Shahjeera'] },
  { id: 'Shahjeera', cat: 'Earthy terpenes', molecules: ['S-Carvone', 'Limonene', 'Sabinene'], notes: 'Spicy menthol, citrus, herby, woody', pairs: ['Star Anise', 'Cinnamon', 'Cardamom', 'Pepper', 'Ginger', 'Nutmeg', 'Mace', 'Coriander', 'Nigella', 'Black Cardamom', 'Saffron', 'Ajwain'] },
  { id: 'Coriander', cat: 'Fragrant terpenes', molecules: ['Linalool', 'Limonene', 'Pinene', 'Cymene'], notes: 'Floral, citrusy, sweet, woody, fresh', pairs: ['Cardamom', 'Nutmeg', 'Mace', 'Ginger', 'Shahjeera', 'Pepper', 'Cumin', 'Nigella', 'Black Cardamom', 'Lemongrass', 'Asafoetida', 'Curry Leaf', 'Saffron', 'Poppy', 'Ajwain', 'Turmeric'] },
  { id: 'Cumin', cat: 'Earthy terpenes', molecules: ['Cuminaldehyde', 'Pinene', 'Cymene'], notes: 'Earthy, herby, woody, fresh citrus', pairs: ['Cinnamon', 'Cardamom', 'Pepper', 'Black Cardamom', 'Coriander', 'Ajwain', 'Nigella', 'Star Anise', 'Fennel', 'Asafoetida', 'Mustard', 'Turmeric', 'Fenugreek'] },
  { id: 'Nigella', cat: 'Earthy terpenes', molecules: ['Nigellone', 'Limonene', 'Pinene', 'Cymene'], notes: 'Mild peppery, herby, citrus, woody', pairs: ['Coriander', 'Shahjeera', 'Pepper', 'Cinnamon', 'Cumin', 'Ajwain', 'Nutmeg', 'Asafoetida', 'Mustard'] },
  { id: 'Black Cardamom', cat: 'Penetrating terpenes', molecules: ['Cineole', 'Eugenol', 'Limonene'], notes: 'Eucalyptus, smoky, medicinal, citrus', pairs: ['Cardamom', 'Nutmeg', 'Cinnamon', 'Coriander', 'Shahjeera', 'Star Anise', 'Cumin', 'Curry Leaf', 'Pepper', 'Turmeric'] },
  { id: 'Cardamom', cat: 'Penetrating terpenes', molecules: ['Cineole', 'a-Fenchyl Acetate', 'Limonene', 'Linalool'], notes: 'Herbal penetrating, minty, citrus, floral', pairs: ['Black Cardamom', 'Nutmeg', 'Ginger', 'Coriander', 'Lemongrass', 'Cinnamon', 'Fennel', 'Shahjeera', 'Cumin', 'Curry Leaf', 'Pepper', 'Ajwain', 'Turmeric'] },
  { id: 'Lemongrass', cat: 'Citrus terpenes', molecules: ['Citral', 'Myrcene', 'Linalool'], notes: 'Citrus, herby, zesty, spicy peppery, floral', pairs: ['Coriander', 'Ginger', 'Pepper', 'Cardamom', 'Curry Leaf'] },
  { id: 'Asafoetida', cat: 'Sulphurous & meaty', molecules: ['Sulphides', 'Organic Acids', 'Phellandrene'], notes: 'Oniony, sulphurous, sour citrus, peppery', pairs: ['Mustard', 'Nigella', 'Coriander', 'Pepper', 'Cumin', 'Curry Leaf'] },
  { id: 'Curry Leaf', cat: 'Sulphurous & meaty', molecules: ['1-Phenylethanethiol', 'Pinene', 'Linalool', 'Cineole'], notes: 'Sulphurous meaty, woody, floral, eucalyptus', pairs: ['Asafoetida', 'Mustard', 'Nutmeg', 'Pepper', 'Coriander', 'Lemongrass', 'Black Cardamom', 'Cardamom', 'Mace', 'Fenugreek'] },
  { id: 'Mustard', cat: 'Sulphurous & meaty', molecules: ['Isothiocyanates', 'Pinene', 'Pyrazines'], notes: 'Hot peppery penetrating, woody, nutty', pairs: ['Ginger', 'Cumin', 'Nigella', 'Asafoetida', 'Curry Leaf', 'Pepper'] },
  { id: 'Pepper', cat: 'Pungent', molecules: ['Piperine', 'Pinene', 'Limonene', 'Myrcene'], notes: 'Hot pungent, woody, citrus, piquant', pairs: ['Mustard', 'Ginger', 'Black Cardamom', 'Nutmeg', 'Cardamom', 'Turmeric', 'Cinnamon', 'Clove', 'Star Anise', 'Fennel', 'Mace', 'Shahjeera', 'Coriander', 'Cumin', 'Nigella', 'Lemongrass', 'Asafoetida', 'Curry Leaf', 'Saffron', 'Ajwain', 'Fenugreek'] },
  { id: 'Ginger', cat: 'Pungent', molecules: ['Gingerol', 'Linalool', 'Citral', 'Cineole'], notes: 'Hot pungent, floral sweet, citrus, penetrating', pairs: ['Pepper', 'Cinnamon', 'Nutmeg', 'Lemongrass', 'Coriander', 'Cardamom', 'Star Anise', 'Shahjeera', 'Mustard', 'Saffron', 'Turmeric'] },
  { id: 'Saffron', cat: 'Complex flavour', molecules: ['Picrocrocin', 'Safranal', 'Cineole', 'Pinene'], notes: 'Musky earthy bitter, honey-like floral, woody', pairs: ['Shahjeera', 'Pepper', 'Coriander', 'Cinnamon', 'Ginger'] },
  { id: 'Poppy', cat: 'Toasty pyrazines', molecules: ['Hexanal', 'Limonene', 'Pyrazines'], notes: 'Fruity green grassy, citrus, nutty smoky', pairs: ['Coriander'] },
  { id: 'Ajwain', cat: 'Earthy terpenes', molecules: ['Vinyl Amyl Ketone', 'Thymol', 'Myrcene', 'Cymene'], notes: 'Earthy creamy, cooling penetrating, peppery', pairs: ['Cinnamon', 'Nigella', 'Nutmeg', 'Pepper', 'Coriander', 'Cardamom', 'Cumin', 'Shahjeera'] },
  { id: 'Turmeric', cat: 'Complex flavour', molecules: ['Turmerone', 'Cineole', 'Citral', 'Zingiberene'], notes: 'Earthy musky woody, penetrating, citrus, sharp', pairs: ['Cumin', 'Black Cardamom', 'Star Anise', 'Nutmeg', 'Cardamom', 'Coriander', 'Ginger', 'Pepper', 'Fenugreek'] },
  { id: 'Fenugreek', cat: 'Complex flavour', molecules: ['Sotolon', 'Caryophyllene', 'Pyrazines'], notes: 'Bittersweet caramel, woody bitter, nutty smoky', pairs: ['Cinnamon', 'Clove', 'Curry Leaf', 'Pepper', 'Cumin', 'Turmeric'] }
];

const KEY_MOLECULES = ['All', 'Pinene', 'Limonene', 'Linalool', 'Cineole', 'Eugenol', 'Cymene', 'Caryophyllene', 'Pyrazines', 'Anethole', 'Sabinene'];

const SCOVILLE_DATA = [
  { name: 'Capsicum', shu: 0, buckets: 0 },
  { name: 'Kashmiri', shu: 2000, buckets: 24 },
  { name: 'Byadagi', shu: 8000, buckets: 95 },
  { name: 'Green chilli', shu: 10000, buckets: 118 },
  { name: 'Gundu / Ramnad', shu: 20000, buckets: 236 },
  { name: 'Guntur', shu: 50000, buckets: 591 },
  { name: 'Kanthari / Bird’s eye', shu: 70000, buckets: 827 },
  { name: 'Bhut Jolokia', shu: 1000000, buckets: 11820 }
];

const SPICE_BLENDS = [
  { id: 'garam', name: 'Garam Masala', region: 'India (North/Pan)', note: 'Finishing aromatic blend—grind fresh in small batches because powdered spices oxidize in weeks (pp. 16, 94).', items: [{ n: 'Coriander', w: 5 }, { n: 'Cumin', w: 5 }, { n: 'Cardamom', w: 4 }, { n: 'Black Cardamom', w: 3 }, { n: 'Cinnamon', w: 3 }, { n: 'Pepper', w: 3 }, { n: 'Clove', w: 2 }, { n: 'Mace', w: 2 }, { n: 'Nutmeg', w: 2 }] },
  { id: 'biryani', name: 'Biryani Masala', region: 'India (Pan)', note: 'Adds shahjeera, star anise, bay leaf, fennel, red chillies, and turmeric to a garam masala core (p. 94).', items: [{ n: 'Coriander', w: 5 }, { n: 'Cumin', w: 5 }, { n: 'Cardamom', w: 4 }, { n: 'Pepper', w: 4 }, { n: 'Shahjeera', w: 3 }, { n: 'Star Anise', w: 3 }, { n: 'Bay Leaf', w: 3 }, { n: 'Cinnamon', w: 3 }, { n: 'Fennel', w: 3 }, { n: 'Black Cardamom', w: 3 }, { n: 'Red Chillies', w: 3 }, { n: 'Clove', w: 2 }, { n: 'Nutmeg', w: 2 }, { n: 'Mace', w: 2 }, { n: 'Turmeric', w: 2 }] },
  { id: 'sambar', name: 'Sambar Powder', region: 'South India', note: 'Dry-roast fenugreek shorter than urad/toor/chana dal—lentils undergo Maillard browning while spices release volatiles (pp. 13, 94).', items: [{ n: 'Coriander', w: 5 }, { n: 'Red Chillies', w: 5 }, { n: 'Toor Dal', w: 4 }, { n: 'Chana Dal', w: 4 }, { n: 'Pepper', w: 3 }, { n: 'Turmeric', w: 2 }, { n: 'Mustard', w: 2 }, { n: 'Asafoetida', w: 2 }, { n: 'Fenugreek', w: 2 }] },
  { id: 'rasam', name: 'Rasam Powder', region: 'South India', note: 'Pepper- and cumin-forward cousin of sambar powder designed for tangy, thin tamarind broths (p. 94).', items: [{ n: 'Coriander', w: 5 }, { n: 'Cumin', w: 5 }, { n: 'Pepper', w: 4 }, { n: 'Red Chillies', w: 4 }, { n: 'Toor Dal', w: 3 }, { n: 'Chana Dal', w: 3 }, { n: 'Turmeric', w: 2 }, { n: 'Asafoetida', w: 2 }] },
  { id: 'chai', name: 'Chai Masala', region: 'India (Pan)', note: 'Warming phenols + penetrating cardamom + pungent pepper and dried ginger (p. 94).', items: [{ n: 'Cardamom', w: 5 }, { n: 'Pepper', w: 5 }, { n: 'Clove', w: 4 }, { n: 'Cinnamon', w: 4 }, { n: 'Fennel', w: 3 }, { n: 'Ginger Powder', w: 3 }, { n: 'Nutmeg', w: 2 }] },
  { id: 'chaat', name: 'Chaat Masala', region: 'North India', note: 'Kala namak supplies hydrogen sulphide (H2S) while amchoor adds dry fruity sourness (p. 94).', items: [{ n: 'Coriander', w: 5 }, { n: 'Cumin', w: 5 }, { n: 'Kala Namak', w: 5 }, { n: 'Red Chillies', w: 4 }, { n: 'Amchoor', w: 3 }, { n: 'Dried Mint', w: 3 }, { n: 'Garam Masala', w: 2 }] },
  { id: 'zaatar', name: 'Za’atar', region: 'Middle East', note: 'Sesame + sumac’s fruity aldehydes + earthy cumin and oregano (p. 95).', items: [{ n: 'Sesame', w: 5 }, { n: 'Cumin', w: 5 }, { n: 'Sumac', w: 5 }, { n: 'Oregano', w: 4 }, { n: 'Salt', w: 2 }] },
  { id: 'baharat', name: 'Baharat', region: 'Turkey / Middle East', note: 'Shares the coriander-cumin-cardamom-cinnamon-clove spine of Indian garam masala plus dried mint (p. 95).', items: [{ n: 'Pepper', w: 5 }, { n: 'Coriander', w: 4 }, { n: 'Cumin', w: 4 }, { n: 'Nutmeg', w: 4 }, { n: 'Dried Mint', w: 3 }, { n: 'Cardamom', w: 3 }, { n: 'Cinnamon', w: 3 }, { n: 'Clove', w: 2 }] },
  { id: 'fivespice', name: 'Five Spice', region: 'China', note: 'Anethole-rich star anise & fennel paired with Sichuan pepper, cinnamon, and clove (p. 95).', items: [{ n: 'Sichuan Pepper', w: 5 }, { n: 'Cinnamon', w: 5 }, { n: 'Star Anise', w: 4 }, { n: 'Clove', w: 4 }, { n: 'Fennel', w: 3 }] },
  { id: 'quatre', name: 'Quatre Épices', region: 'France', note: 'Minimalist 4-spice warming French blend built on pepper, clove, nutmeg, and ginger (p. 95).', items: [{ n: 'Pepper', w: 5 }, { n: 'Clove', w: 4 }, { n: 'Nutmeg', w: 4 }, { n: 'Dried Ginger', w: 3 }] },
  { id: 'adobo', name: 'Adobo', region: 'Mexico', note: 'Demonstrates the addictive power of dehydrated onion + garlic powders with cumin and chilli (p. 95).', items: [{ n: 'Oregano', w: 5 }, { n: 'Cumin', w: 4 }, { n: 'Onion Powder', w: 4 }, { n: 'Pepper', w: 4 }, { n: 'Chilli Powder', w: 4 }, { n: 'Garlic Powder', w: 3 }] },
  { id: 'raselhanout', name: 'Ras El Hanout', region: 'North Africa', note: 'Ginger, cumin, pepper, cinnamon, clove, chillies, and coriander—remarkably close to Indian masalas (p. 95).', items: [{ n: 'Dried Ginger', w: 5 }, { n: 'Cumin', w: 4 }, { n: 'Pepper', w: 3 }, { n: 'Cinnamon', w: 3 }, { n: 'Clove', w: 2 }, { n: 'Red Chillies', w: 2 }, { n: 'Coriander', w: 2 }] }
];

const ONION_STAGES = [
  { name: 'Raw Onion', code: 'STAGE 0', bg: '#f8fafc', circle: '#e9d5ff', chem: '89% water, 9% carbs, 2% protein. Cutting ruptures cells so alliinases create tear-inducing syn-Propanethial-S-oxide (which transforms into meaty MMP when heated!).', dishes: 'Kachumber, salads (soak in cold water to tame pungency while keeping crunch).', time: '0 mins · Cut right before cooking; room-temp enzymes turn pre-cut onions bitter (p. 104).' },
  { name: 'Sweating', code: 'STAGE 1', bg: '#fefce8', circle: '#fef08a', chem: 'Water inside onion cells exceeds 100°C and escapes as steam. Onion wilts slightly but stays opaque with crunch. Adding a pinch of salt speeds dehydration.', dishes: 'Light stir-fries, quick crunchy tadkas.', time: '2–4 mins · Wait for mild sizzle in hot oil (<177°C) before adding onions.' },
  { name: 'Translucent', code: 'STAGE 2', bg: '#fef9c3', circle: '#fde047', chem: 'Most surface & cell water has evaporated; onion is fully wilted with no crunch. Mild sweet onion aroma without deep Maillard complexity.', dishes: 'Milder, creamier curries like white kormas and delicate stews (p. 108).', time: '6–8 mins · Still below full Maillard browning.' },
  { name: 'Light Browning', code: 'STAGE 3', bg: '#ffedd5', circle: '#fb923c', chem: 'Maillard reaction kicks in (>110°C): 2% amino acids react with 9% sugars to generate complex sweet-savoury furans, pyrroles, and melanoidins.', dishes: 'Tikka masala, everyday dal tadka, strong-flavoured gravies (p. 108).', time: '12–18 mins open pan (or ~6–8 mins with a tiny pinch of baking soda!).' },
  { name: 'Golden Brown (Danger Zone)', code: 'STAGE 4', bg: '#fed7aa', circle: '#c2410c', chem: 'Maillard reaction at full tilt! Constant stirring is essential because uneven hot spots quickly scorch into bitter, carcinogenic acrylamide.', dishes: 'Bhuna gosht, Rogan Josh, Kerala Theeyal, rich Dal Makhani (pp. 108, 186).', time: '20–30 mins · Babysit closely; deglaze with a splash of water or alcohol to stop scorching.' },
  { name: 'Caramelized (Jammy)', code: 'STAGE 5', bg: '#7c2d12', circle: '#431407', chem: 'Cell walls completely collapse into jammy extreme Maillardization + true sugar caramelization (~160°C). Deeply sweet, complex, and less oniony.', dishes: 'Gujarati dal (replaces jaggery), onion-peanut-coconut dosa chutney, onion jam toast (pp. 105–108).', time: '45–60 mins open pan · Shortcut: Pressure-caramelize with butter + salt for 20 mins at 121°C (p. 106)!' }
];

const MAILLARD_MOLECULES = [
  { name: 'Furans', note: 'Deep, slightly burnt, caramel-like savoury flavour.', color: '#b45309' },
  { name: 'Furanones', note: 'Subtle sweet aroma associated with freshly baked bread crust.', color: '#d97706' },
  { name: 'Oxazoles & Pyrroles', note: 'Warm, herby, and nutty flavour notes.', color: '#0f766e' },
  { name: 'Thiophenes', note: 'Roasted, meaty, savoury depth (also why Maillard-browned garlic & onions taste meaty).', color: '#b91c1c' },
  { name: 'Pyrazines', note: 'Roasty, toasty notes—like dry-roasted sesame seeds or cumin.', color: '#7c3aed' },
  { name: 'Melanoidins', note: 'The quintessential rich brown pigments in coffee, chocolate, and seared food. (Warning: overheating creates bitter, carcinogenic Acrylamide!)', color: '#431407' }
];

const PH_BENCHMARKS = [
  { id: 'coke', label: 'Coca-Cola (~2.5)', ph: 2.5, title: 'Coca-Cola is more acidic than vinegar!', body: 'A 330g can hides its extreme acidity behind 39g (9 full teaspoons) of sugar. Never drink Coke to cool chilli burn—acid amplifies TRPV1 pain! Use milk or rich fat instead (pp. 83, 122).' },
  { id: 'lime', label: 'Lime / Vinegar (~2.4–3.0)', ph: 2.8, title: 'Strong Culinary Acids (Citric & Acetic)', body: 'Triggers immediate salivation and sharp face-puckering. Use vinegar at half the quantity of lime juice. Never cook lime juice early or it turns bitter (pp. 126–128).' },
  { id: 'beer', label: 'Beer (~4.0)', ph: 4.0, title: 'Where the pH Scale Was Born (1909)', body: 'Søren Sørensen invented the pH scale at Carlsberg Brewery to keep beer consistently around pH 4. Beer works as a culinary acid in batters and cheese dips (pp. 121, 141, 150).' },
  { id: 'dish', label: 'Balanced Dish (4.3–4.9)', ph: 4.6, title: 'The Chef’s Sweet Spot: pH 4.3 – 4.9', body: 'Food scientists testing top restaurant dishes found nearly every balanced, delicious dish sits in this moderately acidic band. Acid acts like a music mixing engineer, separating spices (p. 125).' },
  { id: 'water', label: 'Pure Water (7.0)', ph: 7.0, title: 'Neutral Centre of the Taste Universe', body: 'Exact pH 7.0 is neither acidic nor alkaline. Below 7 is acidic (sour); above 7 is basic/alkaline (bitter/soapy) (p. 121).' },
  { id: 'soda', label: 'Baking Soda (~8.3)', ph: 8.3, title: 'Mildly Alkaline Kitchen Powerhouse', body: 'Because toxic plant alkaloids taste bitter, humans evolved a bias against alkaline tastes. Use baking soda sparingly for pectin breakdown & browning, and neutralize leftovers with an acid like tea (pp. 130–131).' }
];

const ACIDS_LIST = [
  { name: 'Tamarind', role: 'anchor', acid: 'Tartaric acid', band: 'Drummer & Bassist', note: 'Survives long cooking. Simmer 6–8 mins on medium heat until sourness balances. Also cleans tarnished copper pots with salt (pp. 124–125).' },
  { name: 'Kokum & Malabar Tamarind', role: 'anchor', acid: 'Organic fruit acids', band: 'Subtle Rhythm Section', note: 'Botanically unrelated to tamarind; milder and non-fibrous—drop straight into delicate coastal seafood curries without soaking (p. 125).' },
  { name: 'Yoghurt (Dahi)', role: 'anchor', acid: 'Lactic acid', band: 'Creamy Harmonic Pad', note: 'Adds sourness + creaminess. Whisk in starch (besan/cornflour) before heating so the emulsion won’t split (kadhi, pulisheri). Homemade: heat milk 85–90°C, cool to 45°C, culture 4h (pp. 123–124).' },
  { name: 'Tomatoes', role: 'anchor', acid: 'Citric/Malic + Glutamates', band: 'Umami Foundation', note: 'Never discard gooey pulp & seeds—that’s where the glutamates live! Layer fresh tomatoes + tomato paste (or ketchup sachet) + dehydrated tomato powder (pp. 128–129).' },
  { name: 'Tea (Teabag)', role: 'anchor', acid: 'Tannic / Mild Acids', band: 'Stealth Neutralizer', note: 'Inactive until heated in water! Neutralizes unused alkaline baking soda in pressure-cooked chana while lending appetizing dark-brown Maillard-like colour (pp. 16, 131).' },
  { name: 'Amchoor / Raw Mango', role: 'accent', acid: 'Citric & Malic acids', band: 'Lead Guitarist', note: 'Adds bright fruity sourness without moisture—ideal for dry snacks, chaat, and dry sabzis. Layer half amchoor + finishing lime squeeze (pp. 125–126).' },
  { name: 'Lime / Citrus Juices', role: 'accent', acid: 'Citric acid (C6H8O7)', band: 'Lead Vocalist', note: 'Always add at the end (cooking turns citrus bitter) and filter bitter seeds. Hack: squeeze lime 2–3 hrs ahead for nimbu paani or lemon rice so terpenes oxidize into a rounder taste (pp. 126–127).' },
  { name: 'Vinegar', role: 'accent', acid: 'Acetic acid', band: 'Crisp Percussion', note: 'Under-utilized outside Goan cuisine. Use half the volume of lime juice. Apple cider vinegar shines in chutneys; red wine vinegar lifts meats; steep chillies/spices in vinegar (pp. 127–128).' },
  { name: 'Anardana (Dry Pomegranate)', role: 'accent', acid: 'Fruit acids', band: 'Fruity Soloist', note: 'Adds intense, complex fruity tang to Punjabi chana masala and chutneys at the simmering stage (pp. 17, 129).' }
];

const MYTHS_LIST = [
  { id: 'm1', myth: '“MSG is a toxic lab chemical that causes brain damage.”', truth: 'MSG is simply the sodium salt of glutamic acid—chemically identical to glutamates in tomatoes and mushrooms. Human breast milk has 10× more glutamates than cow milk, our bodies hold ~2 kg of it, and MSG has 1/3 the sodium of table salt (pp. 134–135).' },
  { id: 'm2', myth: '“Overnight acid marination penetrates deep and tenderizes meat.”', truth: 'Marinades only coat the surface, and strong acids actually toughen meat proteins if left too long! Brine meat in 8% salt water first for juiciness, then marinate in spices + mild acid for just 30–120 mins (pp. 60, 122, 197).' },
  { id: 'm3', myth: '“Always cook rice in a 1:2 ratio and time pressure cookers by whistles.”', truth: 'Rice absorbs 1:1 water; extra water only offsets evaporation (use the 1-knuckle rule for any batch size!). Whistles fail on 2000W induction stoves—always time elapsed minutes at full 121°C pressure (pp. 46, 50–51).' },
  { id: 'm4', myth: '“Drop a potato or dough ball into over-salted gravy to fix it.”', truth: 'State-of-the-art food science says: you can’t! Potatoes just absorb gravy along with salt, leaving less gravy at the same salt concentration. Only unsalted stock/water dilution truly lowers concentration (p. 76).' },
  { id: 'm5', myth: '“Baking soda is unhealthy; use Eno fruit salt instead.”', truth: 'Eno literally IS baking soda + citric acid! A tiny pinch of baking soda slashes legume cook time by 40%, crisps high-moisture Indian potatoes, keeps blanched greens vivid, and gives restaurant-brown dosas (pp. 136–137).' },
  { id: 'm6', myth: '“Chilli seeds contain all the heat, and water cools chilli burn.”', truth: 'Seeds only taste bitter; the white placenta holds the capsaicin! Capsaicin is fat- and alcohol-soluble, not water-soluble—drink milk or eat coconut fat, never water or acidic Coke (pp. 79, 82–83).' }
];

const ALCOHOL_TECHS = [
  { id: 'deglaze', title: '1 · Pan Deglazing & Extraction', text: 'Add a splash of cheap vodka, brandy, or rum right after cooking onions, ginger, garlic, tomatoes, and spice powders. It lifts stuck Maillard brown bits (fond) off the pan and dissolves fat/alcohol-soluble spice aromas before water goes in (pp. 17, 140).' },
  { id: 'finish', title: '2 · Finishing Wine Splash', text: 'A small splash of inexpensive wine added near the end alongside finishing spices amplifies their volatile aroma delivery to your olfactory cortex. Don’t waste fine Chardonnay—heat destroys delicate wine notes (pp. 140–141).' },
  { id: 'barsnack', title: '3 · The Bar-Snack Paradox', text: 'While a tiny splash of alcohol amplifies flavour, large amounts of alcohol trap aroma molecules and numb TRPV1 heat receptors—explaining why Indian bar snacks are insanely spicy so you can still taste them after two large pegs (pp. 82, 140–141).' },
  { id: 'beer', title: '4 · Beer as Culinary Acid', text: 'Beer’s ABV is too low for strong aroma extraction, but at pH ~4 it works brilliantly as an acidic base—especially when simmered with sodium citrate and grated cheese for desi chilli-chaat cheese slices (pp. 141, 150).' },
  { id: 'pakora', title: '5 · Vodka Crispy Pakora Batter', text: 'Pioneered by Heston Blumenthal: mix maida, salt, and vodka (ethanol + water). Alcohol inhibits chewy gluten formation and prevents surface starches from absorbing excess water, yielding an ultra-dry, shatteringly crisp crust! (p. 141).' }
];

const SOUSVIDE_DATA = [
  { item: 'Chicken · Breast', temp: 64, mins: 90, group: 'tender' },
  { item: 'Chicken · Thigh', temp: 69, mins: 120, group: 'tender' },
  { item: 'Chicken · Legs', temp: 69, mins: 150, group: 'tender' },
  { item: 'Mutton · Tender cuts', temp: 70, mins: 150, group: 'tender' },
  { item: 'Mutton · Tough cuts', temp: 70, mins: 480, group: 'tough' },
  { item: 'Pork · Tender cuts', temp: 60, mins: 120, group: 'tender' },
  { item: 'Pork · Tough cuts', temp: 75, mins: 480, group: 'tough' },
  { item: 'Beef · Tender cuts', temp: 55, mins: 120, group: 'tender' },
  { item: 'Beef · Tough cuts', temp: 75, mins: 480, group: 'tough' },
  { item: 'Vegetables', temp: 85, mins: 40, group: 'tender' }
];

const GRAVY_REGIONS = {
  punjabi: { fat: 'Ghee + oil', aromatics: 'Onions (Stage 3–4 brown), ginger-garlic paste, tomatoes + tomato paste/ketchup', whole: 'Cumin (jeera), black cardamom, bay leaf', baseGravy: 'Generic North Indian onion-tomato base', spiceMix: 'Coriander powder, cumin powder, Kashmiri chilli, turmeric', stock: 'Water or vegetable/chicken stock', acid: 'Amchoor or anardana (optional if tomato-heavy)', finish: 'Garam masala, kasuri methi, fresh coriander, lime squeeze' },
  makhani: { fat: 'Butter + neutral oil', aromatics: 'Coarse onions (Stage 2–3), ginger-garlic, heavy tomatoes + tomato paste', whole: 'Kashmiri whole chillies, black cardamom, cloves, bay leaf, pepper', baseGravy: 'Makhani frozen base (strained cashew/poppy-thickened tomato gravy)', spiceMix: 'Kashmiri chilli, coriander, cumin, turmeric', stock: 'Water + fresh cream/butter enrichment', acid: 'Not needed (tomato paste provides balanced acidity)', finish: 'Butter/cream swirl, crushed kasuri methi, garam masala oil' },
  chettinadu: { fat: 'Sesame oil (gingelly)', aromatics: 'Shallots (sambar onions), garlic, ginger, curry leaves', whole: 'Fennel (saunf), whole red chillies, star anise, stone flower', baseGravy: 'Chettinadu base (shallot-fennel-curry leaf-chicken stock thickened with rice flour)', spiceMix: 'Freshly roasted Chettinadu pepper-fennel-coriander masala', stock: 'Chicken or vegetable stock', acid: 'Tamarind or tomatoes', finish: 'Chettinadu infused sesame oil + crisp curry leaf tempering' },
  malabar: { fat: 'Coconut oil', aromatics: 'Shallots, garlic, ginger, curry leaves', whole: 'Mustard, fenugreek, curry leaves, whole red chillies', baseGravy: 'Malabar base (shallot-garlic-curry leaf simmered in diluted coconut milk)', spiceMix: 'Roasted coriander, fennel, black pepper, turmeric', stock: 'Diluted coconut milk (add thick coconut milk off heat)', acid: 'Kokum / Malabar tamarind or raw mango', finish: 'Coconut oil tempering with shallots, mustard & fresh curry leaves' },
  mughlai: { fat: 'Ghee', aromatics: 'Pureed onions (Stage 2 translucent), ginger, garlic', whole: 'Mace, clove, green cardamom, nutmeg, bay leaf', baseGravy: 'Mughlai white base (pureed alliums + cashew/poppy seed paste + milk)', spiceMix: 'Delicate white pepper + cardamom-mace garam masala', stock: 'Milk or mild stock + cashew paste', acid: 'Yoghurt whisked with starch (add on low heat)', finish: 'Saffron milk, kewra water, cream, toasted nuts' },
  bengali: { fat: 'Mustard oil (heated to lightly smoke)', aromatics: 'Onions, ginger paste, green chillies', whole: 'Panch Phoran (mustard, nigella, fenugreek, fennel, cumin/ajwain)', baseGravy: 'Bengali panch-phoran onion base', spiceMix: 'Cumin, coriander, turmeric, Kashmiri chilli (or soaked mustard paste)', stock: 'Seafood stock or water', acid: 'Tomatoes or mild yoghurt / raw mango', finish: 'Bengali panch-phoran infused mustard oil + pinch of sugar + Bengali gorom moshla' },
  gujarati: { fat: 'Groundnut oil or ghee', aromatics: 'Ginger, green chillies, optional light onion', whole: 'Mustard, cumin, sesame seeds, curry leaves, asafoetida (hing)', baseGravy: 'Gram flour (besan) + yoghurt stabilized base', spiceMix: 'Turmeric, coriander-cumin (dhana-jeera), red chilli', stock: 'Buttermilk / yoghurt + water whisked with besan', acid: 'Lime juice (balanced with jaggery or caramelized onions!)', finish: 'Sesame-mustard-curry leaf tadka + chopped coriander' },
  jain: { fat: 'Ghee or groundnut oil', aromatics: 'Zero onion or garlic—rely on browned ginger, tomatoes & spice layering', whole: 'Cumin (jeera), asafoetida (hing), cloves, cinnamon', baseGravy: 'Tomato-cashew-hing base gravy', spiceMix: 'Turmeric, coriander, roasted cumin, red chilli, fennel', stock: 'Water, vegetable stock, or starch-stabilized yoghurt', acid: 'Amchoor, tomatoes, or lime juice at end', finish: 'Pinch of sugar, kasuri methi, coriander leaves, hing-jeera ghee tadka' }
};

const GRAVY_PREP = {
  legumes: 'Soak 6–8 hrs; pressure-cook separately with a pinch of baking soda + teabag (never salt or cook in acidic gravy upfront, p. 164).',
  veg: 'Wash & chop evenly; steam or lightly par-cook, then brown in fat (or roast at 180°C) BEFORE dropping into gravy for Maillard depth (p. 114, 162).',
  meat: 'Brine in 8% salt water (60m pieces), marinate max 1 hr in yoghurt + spices, then sear/brown in fat and keep internal temp under 70°C (pp. 59, 163).',
  seafood: 'Brine briefly (30 mins in 8% brine), pan-sear quickly, and add right at the end so delicate proteins don’t turn rubbery (p. 164).',
  eggs: 'Boil (8m medium / 12m hard + pinch of baking soda for easy peeling) or sear paneer lightly on mild heat so it never turns rubbery (pp. 59, 165).'
};

const BREADS_DATA = [
  { name: 'Chapatti (Atta)', flour: 'Atta', pct: 100, liquid: 'Water', autolyse: 30, enrich: 'None', leaven: 'None', tip: 'Beginners can start at 80% hydration and climb to 100%. Use warm (not boiling) water for chew, or boiling water for ultra-flaky softness.' },
  { name: 'Paratha (Atta)', flour: 'Atta', pct: 100, liquid: 'Water', autolyse: 30, enrich: 'Yoghurt, oil', leaven: 'None', tip: 'Add 1% salt only AFTER the 30-minute autolysis rest so gluten stays extensible.' },
  { name: 'Puri (Atta)', flour: 'Atta', pct: 50, liquid: 'Water', autolyse: 0, enrich: 'Oil (shortens gluten)', leaven: 'None', tip: 'Zero dusting flour when rolling—dusting flour burns in 170°C frying oil! Use oil to roll instead.' },
  { name: 'Khamiri Roti (Atta)', flour: 'Atta', pct: 100, liquid: 'Water + Milk', autolyse: 30, enrich: 'Sugar', leaven: 'Yeast (½ tsp)', tip: 'Cover with a wet cloth and ferment 30m (Chennai) to 2–3h (Srinagar) or overnight in fridge for complex flavour.' },
  { name: 'Naan (Maida)', flour: 'Maida (or up to 50% Atta)', pct: 70, liquid: 'Water + Yoghurt', autolyse: 30, enrich: 'Milk (optional if rapid rise)', leaven: 'Yeast or Baking Soda + Yoghurt', tip: 'Maida forms stronger gluten than chakki-ground atta. Overnight cold fridge fermentation beats rapid rises.' },
  { name: 'Kulcha (Maida)', flour: 'Maida', pct: 60, liquid: 'Water + Yoghurt', autolyse: 30, enrich: 'None', leaven: 'Yeast or Baking Soda + Yoghurt', tip: 'With chemical leavener (baking soda + yoghurt), rest no more than 30–45 minutes.' },
  { name: 'Bhatura (Maida)', flour: 'Maida', pct: 60, liquid: 'Water + Yoghurt', autolyse: 30, enrich: 'None', leaven: 'Yeast or Baking Soda + Yoghurt', tip: 'Fry at 170–190°C so exterior dehydrates fast into a crisp puffed shell without absorbing oil.' }
];

const BRINE_CUTS = [
  { name: 'Fish (fillets/steaks)', mins: 30 },
  { name: 'Chicken (pieces)', mins: 60 },
  { name: 'Chicken (whole)', mins: 180 },
  { name: 'Pork (pieces)', mins: 60 },
  { name: 'Pork (large cuts)', mins: 240 },
  { name: 'Beef (pieces)', mins: 60 },
  { name: 'Beef (large cuts)', mins: 240 },
  { name: 'Mutton (pieces)', mins: 60 },
  { name: 'Mutton (large cuts)', mins: 240 }
];

const CHUTNEY_COLS = [
  { key: 'cooked', label: 'Cooked (1–2)', opts: ['Beetroot', 'Eggplant', 'Ridge gourd', 'Tomato', 'Cabbage', 'Sweet potato', 'Capsicum', 'Garlic', 'Onion', 'Dates'] },
  { key: 'raw', label: 'Raw (Opt.)', opts: ['None', 'Carrot', 'Raw papaya', 'Pomegranate', 'Raw mango', 'Ginger', 'Plums', 'Pineapple', 'Amla', 'Radish'] },
  { key: 'nutty', label: 'Nutty (Roasted)', opts: ['Coconut', 'Chana dal', 'Peanuts', 'Sesame', 'Niger seed', 'Cashews', 'Walnuts', 'Urad dal'] },
  { key: 'herbs', label: 'Herbs', opts: ['None', 'Coriander', 'Mint', 'Coriander + Mint', 'Basil', 'Chives', 'Lime leaves'] },
  { key: 'salt', label: 'Salt', opts: ['Table salt', 'Kala namak + salt'] },
  { key: 'acid', label: 'Acid', opts: ['Yoghurt (Raita)', 'Lime juice', 'Tamarind', 'Vinegar', 'Orange juice', 'Pineapple juice'] },
  { key: 'sweet', label: 'Sweet', opts: ['None (veggie/fruit sweet)', 'Jaggery', 'Sugar', 'Honey'] }
];

const SALAD_COLS = [
  { key: 'greens', label: 'Greens (1)', opts: ['Baby spinach', 'Lettuce', 'Rocket', 'Coriander + Mint', 'Wilted spinach', 'Basil', 'Fenugreek'] },
  { key: 'veg', label: 'Vegetables (2)', opts: ['Salted Cucumber + Tomato', 'Carrots + Onion', 'Roasted Cauliflower + Beetroot', 'Capsicum + Broccoli', 'Pickled Radish + Pumpkin'] },
  { key: 'fruit', label: 'Fruit (1)', opts: ['Pomegranate', 'Mango', 'Apple', 'Berries', 'Avocado', 'Grapes', 'Watermelon', 'Figs'] },
  { key: 'protein', label: 'Protein (Opt.)', opts: ['Paneer', 'Chickpeas', 'Boiled eggs', 'Sprouts', 'Shredded chicken', 'Tofu', 'Rajma'] },
  { key: 'crunch', label: 'Crunch (1)', opts: ['Fried onions', 'Roasted papad', 'Peanuts', 'Walnuts', 'Almonds', 'Roasted garlic', 'Coconut slices'] },
  { key: 'dressing', label: '3:1 Dressing Style', opts: ['Bengali (Mustard oil + Vinegar + Kala namak + Chilli)', 'South Indian (Sesame oil + Lime + Jaggery + Ginger)', 'Classic Citrus (Olive oil + Orange/Lime + Honey + Pepper)', 'Creamy Desi (Avocado oil + Yoghurt + Jeera + Garlic)'] }
];

const RICE_ALGOS = [
  { id: 'steamed', title: '1 · Plain Steamed Rice', steps: ['Wash rice until water runs clear to strip sticky surface amylopectin and polishing talc.', 'Soak 20–30 mins; add water to 1 index-finger knuckle above rice level + optional 1% salt by total weight.', 'Bring to a rolling boil (gelatinizes starch at 65°C). Once water reaches rice top, lower heat to minimum and lid for 10–15 mins.', 'Check bottom surreptitiously with a fork. Turn off heat and rest LID CLOSED for 10 mins (retrogradation separates every grain). Fluff with a fork, never a spoon!'] },
  { id: 'flavoured', title: '2 · Flavoured Rice (Lemon / Tamarind)', steps: ['Cook plain steamed rice using Algorithm 1 and spread out to cool completely.', 'Build a distinct flavouring mix: whole-spice tadka + acid (lime juice squeezed 2h ahead, or cooked tamarind) + crunch (roasted peanuts/cashews/dal) or full chutney.', 'Fold gently into cooled rice so separated retrograded grains coat cleanly without turning mushy.'] },
  { id: 'lentils', title: '3 · Rice + Lentils (Khichdi / Pongal)', steps: ['Heat fat (ghee) and bloom whole spices (cumin, pepper, ginger).', 'Add prepped rice, lentils, generous water/stock (mushy texture is the goal here!), and salt.', 'Pressure-cook for at least 15 minutes at peak 121°C pressure.', 'Once depressurized, fold in finishing tempering, herbs, or a separate flavourful gravy (e.g., Bisi Bele Bhath).'] },
  { id: 'pulao', title: '4 · One-Pot Pulao', steps: ['Use high-amylose long-grain rice (Basmati 20–25%). Heat fat and bloom whole spices.', 'Sauté finely chopped prepped veggies (so they finish in sync with rice) and/or brined & marinated meat.', 'Stir in washed & soaked rice briefly; add stock/water to 1 index-finger knuckle above rice.', 'Bring to boil, optionally drop in saffron milk / roasted nuts / garam masala when water hits rice level, lid on low 10–15m, rest 10m, fluff with fork.'] }
];

const BIRYANI_TRACKS = [
  { id: 'b1', track: 'Onion Track', start: 0, span: 20, color: '#ea580c', task: 'Chop onions & deep-fry birista in batches at 177°C until just short of dark brown' },
  { id: 'b2', track: 'Spices & Herbs', start: 5, span: 15, color: '#b91c1c', task: 'Dry-roast & freshly grind biryani masala (cardamom, clove, mace, shahjeera)' },
  { id: 'b3', track: 'Spices & Herbs', start: 18, span: 12, color: '#b91c1c', task: 'Prep fresh ginger-garlic paste & chop mint/coriander leaves' },
  { id: 'b4', track: 'Meat Track', start: 0, span: 35, color: '#991b1b', task: 'Brine bone-in meat in 8% salt water (60m chicken / 240m mutton), then wash' },
  { id: 'b5', track: 'Meat Track', start: 35, span: 20, color: '#991b1b', task: 'Marinate meat (yoghurt + lime + biryani masala + ginger-garlic + ghee, max 1–2h)' },
  { id: 'b6', track: 'Meat Track', start: 55, span: 18, color: '#991b1b', task: 'Par-cook marinated meat low & slow (<65–70°C) & strain rendered yakhni fat' },
  { id: 'b7', track: 'Rice Track', start: 40, span: 15, color: '#d97706', task: 'Wash basmati 4–5× until clear & soak 20 mins' },
  { id: 'b8', track: 'Rice Track', start: 58, span: 15, color: '#d97706', task: 'Par-cook rice in salty-as-the-sea water + bouquet garni until full length (raw centre); cool on wide tray' },
  { id: 'b9', track: 'Masala Milk', start: 45, span: 12, color: '#0f766e', task: 'Warm milk 10s in microwave; steep saffron strands, rose/kewra water & attar' },
  { id: 'b10', track: 'Layer & Dum', start: 75, span: 8, color: '#4f46e5', task: 'Line thick pot with bay leaves; stack Meat → ½ Rice + Yakhni → Herbs/Milk/Birista → ½ Rice → Toppings' },
  { id: 'b11', track: 'Layer & Dum', start: 83, span: 11, color: '#4f46e5', task: 'Seal tightly (dough/foil); dum-cook 30 mins lowest heat (or 40–45 mins in 180°C oven)' },
  { id: 'b12', track: 'Layer & Dum', start: 94, span: 6, color: '#059669', task: 'Turn off heat & rest 15 mins sealed for starch retrogradation before serving!' }
];

const BIRYANI_REGIONS = {
  hyderabadi: { name: 'Hyderabadi', rice: 'Wash & soak 20m; par-cook in salted water + bouquet garni of whole spices.', meat: 'Brine meat, marinate in yoghurt & spices. Cook in ghee till gravy coats meat in a thick paste.', milk: 'Warm milk infused with saffron.', special: 'Crisp deep-fried onions (birista) + mint & coriander.' },
  awadhi: { name: 'Awadhi (Lucknowi)', rice: 'Wash & soak 20m; par-cook in salted water + bouquet garni of whole spices.', meat: 'Brine meat; cook in ghee, delicate spices, and yoghurt, then separate yakhni and meat pieces.', milk: 'Saffron, ghee, mace, cardamom powder, and rose water.', special: 'Fried onions (delicate, floral aroma profile).' },
  bengali: { name: 'Bengali (Kolkata)', rice: 'Wash & soak 20m; par-cook in salted water + bouquet garni of whole spices.', meat: 'Brine & marinate in yoghurt + spices; cook in ghee + water and separate yakhni and meat.', milk: 'Saffron, rose water, and sweet attar.', special: 'Fried onions, dried plums (aloo bukhara), rose petals, attar, fried potatoes, and khoya!' },
  thalassery: { name: 'Thalassery (Malabar)', rice: 'In ghee, fry onions & whole spices, add soaked short-grain/khyma rice + salted water and par-cook directly.', meat: 'Brine meat; cook in ghee, add yoghurt & coconut milk, then separate yakhni and meat.', milk: 'Warm milk steeped with saffron.', special: 'Fried onions, roasted cashews, raisins, and pineapple chunks.' },
  ambur: { name: 'Ambur', rice: 'Wash & soak 20m; par-cook in salted water + bouquet garni.', meat: 'Brine meat; cook in oil with onions, tomatoes, red chilli paste/spices, and yoghurt; separate yakhni.', milk: 'None (intensely spicy, minimalist profile).', special: 'None—clean, fiery focus on meat, chilli, and rice.' },
  experimental: { name: 'Experimental (Thai / Mexican)', rice: 'Try cooking rice in diluted coconut milk (Malabar/Thai) or stock.', meat: 'Thai: lemongrass, ginger, shallots, garlic, fish sauce marinade. Mexican: chipotle, cumin, garlic & onion powder.', milk: 'Optional herb-infused oil or coconut cream.', special: 'Thai basil + fried shallots for crunch. Biryani is a modular canvas!' }
};

const INITIAL_LOG = [
  { id: 'l1', date: '2020-03-18', dish: 'Killsbury Atta', base: 400, liquid: 200, outcome: 'Papad' },
  { id: 'l2', date: '2020-03-19', dish: 'Usherwhat Atta', base: 400, liquid: 200, outcome: 'Still papad' },
  { id: 'l3', date: '2020-03-20', dish: 'Killsbury Atta', base: 400, liquid: 300, outcome: 'Kinda okay' },
  { id: 'l4', date: '2020-03-21', dish: 'Killsbury Atta', base: 400, liquid: 400, outcome: 'Perfect! (100% hydration)' },
  { id: 'l5', date: '2020-03-22', dish: 'Usherwhat Atta', base: 400, liquid: 450, outcome: 'Sticky mess' }
];

// =====================================================================
// QUIZ DECKS (CH2 · SPICE MOLECULE PUZZLE)
// Multiple-choice knowledge check using real flavour molecules.
// =====================================================================
const SPICE_QUIZ = [
  {
    q: 'Which molecule is cumin’s signature flavour?',
    choices: [
      { t: 'Cuminaldehyde', c: true },
      { t: 'Myristicin' },
      { t: 'Piperine' },
      { t: 'Capsaicin' }
    ],
    hint: 'Cumin’s major volatile is cuminaldehyde — a pungent, slightly spicy aldehyde (pp. 86–89).'
  },
  {
    q: 'Which molecule dominates the smell of clove (and the heat of chillies)?',
    choices: [
      { t: 'Anethole' },
      { t: 'Eugenol', c: true },
      { t: 'Caryophyllene' },
      { t: 'Piperine' }
    ],
    hint: 'Clove is around 90% eugenol (pp. 86–89); chilli delivers piperine-family heat instead.'
  },
  {
    q: 'What gives cardamom its penetrating, menthol-like character?',
    choices: [
      { t: 'Cineole' },
      { t: 'a-Fenchyl Acetate', c: true },
      { t: 'Eugenol' },
      { t: 'Limonene' }
    ],
    hint: 'Cardamom’s main volatile is the menthol-like ester a-fenchyl acetate (pp. 86–89).'
  },
  {
    q: 'Black pepper’s familiar “pungent, hot bite” comes from which molecule?',
    choices: [
      { t: 'Gingerol' },
      { t: 'Capsaicin' },
      { t: 'Piperine', c: true },
      { t: 'Pyrazines' }
    ],
    hint: 'Pepper contains piperine (p. 86) — a pungent amide, quite different from gingerol’s “hot-but-sweet” receptors.'
  },
  {
    q: 'Capsaicin’s chemical family is best described as?',
    choices: [
      { t: 'Phenylpropene ether' },
      { t: 'Vanilloid alkaloid', c: true },
      { t: 'Furanone lactone' },
      { t: 'Thiophene' }
    ],
    hint: 'Capsaicinoids are vanilloids — a phenolic ring joined to a long greasy hydrocarbon tail (p. 89), which is why they dissolve in fat and alcohol.'
  },
  {
    q: 'Which molecule gives saffron its colour?',
    choices: [
      { t: 'Safranal' },
      { t: 'Cineole' },
      { t: 'Picrocrocin', c: true },
      { t: 'Gingerol' }
    ],
    hint: 'Picrocrocin produces the colour; safranal is the aromatizing compound created from it on threading (p. 89).'
  }
];

// =====================================================================
// BLIND TASTE GAME (CH4 · DROPPING ACID)
// Five anonymized drinks; guess the pH of each, then reveal.
// =====================================================================
const BLIND_TASTES = [
  { id: 'bt1', title: 'Tomato & Basil Cooler', ph: 4.1 },
  { id: 'bt2', title: 'Spiced Mango Lassi', ph: 5.1 },
  { id: 'bt3', title: 'Tamarind & Cumin Soup', ph: 3.4 },
  { id: 'bt4', title: 'Lemon-Kaffir Lime Drink', ph: 2.3 },
  { id: 'bt5', title: 'Watermelon & Lime Agua Fresca', ph: 4.6 }
];
