const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// ዝግጁ የመነሻ ቃላት
let dictionary = [
    { id: 1, term: "Agronomy", amharic: "አግሮኖሚ (ሰብል ሳይንስ)", category: "Crop Science", definition: "የአፈር አያያዝንና የሰብል ምርታማነትን የሚያጠና የግብርና ሳይንስ ቅርንጫፍ።" },
    { id: 2, term: "Compost", amharic: "ኮምፖስት", category: "Soil Science", definition: "ከእፅዋት ተረፈ-ምርትና ከእንስሳት ፍግ በስበሰ የሚዘጋጅ ተፈጥሯዊ ማዳበሪያ።" },
    { id: 3, term: "Coffee Cupping", amharic: "የቡና ቅመሳ (ካፒንግ)", category: "Coffee Quality", definition: "የቡናን መዓዛ፣ ጣዕም፣ አሲዳማነትና ጥራት በስሜት ህዋሳት የመገምገሚያ ዘዴ።" },
    { id: 4, term: "Crop Rotation", amharic: "የሰብል ፈራቃ", category: "Agronomy", definition: "የአፈርን ለምነት ለመጠበቅ በተመሳሳይ መሬት ላይ በየወቅቱ ልዩ ልዩ ሰብሎችን የመዝራት ዘዴ።" },
    { id: 5, term: "Soil Erosion", amharic: "የአፈር መሸርሸር", category: "Soil Science", definition: "በውሃ ወይም በንፋስ ምክንያት ለም የሆነው የላይኛው የአፈር አካል መወሰድ።" }
];

// ቃላትን ለመፈለግ የሚያገለግል API
app.get('/api/terms', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase().trim() : '';
    const filtered = dictionary.filter(item => 
        item.term.toLowerCase().includes(query) || 
        item.amharic.includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    res.json(filtered);
});

// አዲስ ቃል መመዝገቢያ API
app.post('/api/terms', (req, res) => {
    const { term, amharic, category, definition } = req.body;
    if (!term || !amharic) {
        return res.status(400).json({ error: "እባክዎን ቃሉን እና ትርጉሙን ያስገቡ!" });
    }
    const newEntry = { id: dictionary.length + 1, term, amharic, category: category || "General", definition };
    dictionary.push(newEntry);
    res.json({ message: "ቃሉ በትክክል ተመዝግቧል!", entry: newEntry });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});