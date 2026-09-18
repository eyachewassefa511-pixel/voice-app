const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// የ MongoDB Atlas ማገናኛ (Username በስኬት ተስተካክሏል)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://eyachewassefa511%40gmail.com:zTMawPLEoR84dCno@cluster0.dahzehc.mongodb.net/agri_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas ጋር በትክክል ተገናኝቷል!'))
    .catch(err => console.error('MongoDB መስራት አልቻለም:', err));

// የቃላት Schema/Model
const TermSchema = new mongoose.Schema({
    term: { type: String, required: true, index: true },
    amharic: { type: String, required: true },
    category: { type: String, default: "General" },
    definition: { type: String }
});

TermSchema.index({ term: 'text', amharic: 'text' });

const Term = mongoose.model('Term', TermSchema);

// የፍለጋ API
app.get('/api/terms', async (req, res) => {
    const query = req.query.q ? req.query.q.trim() : '';
    try {
        if (!query) {
            const initialTerms = await Term.find().limit(20);
            return res.json(initialTerms);
        }

        const results = await Term.find({
            $or: [
                { term: { $regex: query,$options: 'i' } },
                { amharic: { $regex: query,$options: 'i' } }
            ]
        }).limit(50);

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "የፍለጋ ስህተት አጋጥሟል" });
    }
});

// አዲስ ቃል መመዝገቢያ API
app.post('/api/terms', async (req, res) => {
    const { term, amharic, category, definition } = req.body;
    if (!term || !amharic) {
        return res.status(400).json({ error: "እባክዎን ቃሉን እና ትርጉሙን ያስገቡ!" });
    }
    try {
        const newEntry = new Term({ term, amharic, category, definition });
        await newEntry.save();
        res.json({ message: "ቃሉ በትክክል ተመዝግቧል!", entry: newEntry });
    } catch (error) {
        res.status(500).json({ error: "መመዝገብ አልተቻለም" });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});