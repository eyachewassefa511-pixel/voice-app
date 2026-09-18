const mongoose = require('mongoose');

// የራስህን MongoDB URI እዚህ ተካ
const MONGO_URI = "የአንተ_MONGODB_CONNECTION_STRING_እዚህ_ይግባ";

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB ተገናኝቷል! ዳታ መጫን ተጀምሯል...'))
    .catch(err => console.error(err));

const TermSchema = new mongoose.Schema({
    term: { type: String, required: true },
    amharic: { type: String, required: true },
    category: { type: String },
    definition: { type: String }
});

const Term = mongoose.model('Term', TermSchema);

// እዚህ ጋር ትላልቅ የ CSV/JSON ዳታዎችን ወይም የ FAO AGROVOC ዝርዝር መጫን ይቻላል
const dataset = [
    { term: "Agronomy", amharic: "አግሮኖሚ (ሰብል ሳይንስ)", category: "Crop Science", definition: "የአፈር አያያዝንና የሰብል ምርታማነትን የሚያጠና የግብርና ሳይንስ።" },
    { term: "Compost", amharic: "ኮምፖስት", category: "Soil Science", definition: "ከእፅዋት ተረፈ-ምርትና ከእንስሳት ፍግ የሚዘጋጅ ተፈጥሯዊ ማዳበሪያ።" },
    { term: "Totipotency", amharic: "ቶቲፖተንሲ", category: "Plant Biotechnology", definition: "አንዲት የእፅዋት ሴል ሙሉ እፅዋትን የመተካት ወይም የመፍጠር ችሎታ።" },
    { term: "Photosynthesis", amharic: "ፎቶሲንቴሲስ (የእፅዋት ምግብ ዝግጅት)", category: "Botany", definition: "እፅዋት የፀሐይ ብርሃንን በመጠቀም ምግባቸውን የሚያዘጋጁበት ሂደት።" }
];

async function seedData() {
    try {
        await Term.insertMany(dataset);
        console.log("✅ ዳታው በስኬት ወደ MongoDB ተጭኗል!");
        process.exit();
    } catch (error) {
        console.error("ስህተት አጋጥሟል:", error);
        process.exit(1);
    }
}

seedData();