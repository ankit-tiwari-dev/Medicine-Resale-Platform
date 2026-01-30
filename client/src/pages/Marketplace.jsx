import { useState, useEffect } from 'react';
import MedicineCard from '../components/MedicineCard';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Assets
import img1 from '../assets/pexels-antonella-traversaro-445347-1138746.jpg';
import img2 from '../assets/pexels-karola-g-4021820.jpg';
import img3 from '../assets/pexels-n-voitkevich-7615413.jpg';

const Marketplace = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            image: img1,
            title: "MedAImart verified Medicines",
            subtitle: "Review & Buy with Confidence",
            color: "text-[#32aeb1]"
        },
        {
            id: 2,
            image: img2,
            title: "Big Savings on Essentials",
            subtitle: "Up to 50% off on surplus stock",
            color: "text-[#ef4281]"
        },
        {
            id: 3,
            image: img3,
            title: "Fast & Secure Delivery",
            subtitle: "From local pharmacies to your doorstep",
            color: "text-blue-600"
        }
    ];

    useEffect(() => {
        fetchMedicines();
    }, [search, category]);

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const fetchMedicines = async () => {
        try {
            let query = '/medicines?';
            if (search) query += `search=${search}&`;
            if (category) query += `category=${category}`;

            const response = await api.get(query);
            if (response.data.data && response.data.data.length > 0) {
                setMedicines(response.data.data);
            } else {
                // Fallback Mock Data
                setMedicines([]);
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setMedicines([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* 1. Hero Carousel */}
            <div className="relative h-[400px] lg:h-[500px] bg-gray-900 overflow-hidden">
                <AnimatePresence>
                    <motion.div
                        key={currentSlide}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
                            <div className="max-w-2xl">
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className={`font-bold tracking-wider text-sm uppercase mb-4 block ${slides[currentSlide].color}`}
                                >
                                    MedAImart
                                </motion.span>
                                <motion.h1
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
                                >
                                    {slides[currentSlide].title}
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-gray-200 text-xl mb-8"
                                >
                                    {slides[currentSlide].subtitle}
                                </motion.p>
                                <motion.button
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-[#32aeb1] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-teal-500/30 hover:bg-[#2a9396] transition-all transform hover:-translate-y-1"
                                >
                                    Explore Now
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-[#32aeb1] w-8' : 'bg-white/50 hover:bg-white'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 -mt-20 relative z-20">

                {/* 2. Category Filter Chips (Glassmorphism) */}
                <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 mb-12">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Shop by Category</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Antibiotic', 'Fever', 'Diabetes', 'Vitamins', 'First Aid', 'Pain Relief'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${(category === cat || (cat === 'All' && !category))
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20'
                                    : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Product Grid */}
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Medicines</h2>
                    <div className="hidden lg:block text-sm text-gray-500">
                        Showing {medicines.length} results
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-8">
                        {medicines.length > 0 ? (
                            medicines.map((med) => (
                                <MedicineCard key={med.id} data={med} />
                            ))
                        ) : (
                            <div className="col-span-full py-24 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
                                    <Info className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No medicines found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mt-2">Try adjusting your filters or search for something else.</p>
                                <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-6 text-[#32aeb1] font-bold hover:underline">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
