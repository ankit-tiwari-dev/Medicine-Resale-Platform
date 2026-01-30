import { useState, useRef } from 'react';
import { Upload, X, ScanLine, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

const SellMedicine = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const processFile = async (selectedFile) => {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setIsScanning(true);
        setScannedData(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await api.post('/medicines/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setScannedData(response.data.data); // Assuming backend returns extracted data in 'data'
            toast.success('Medicine scanned successfully!');
        } catch (error) {
            console.error('Scan failed:', error);
            toast.error('Failed to scan image. Please try again.');
            setFile(null);
            setPreview(null);
        } finally {
            setIsScanning(false);
        }
    };

    const handleListingSubmit = async (e) => {
        e.preventDefault();
        // In a real flow, you would verify scan results and confirm the listing here.
        // Since the /upload endpoint likely creates the listing or returns data to verify,
        // this step might confirm and publish.
        // For now, let's assume valid data is enough to "list" or redirect.
        toast.success('Listing created successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Sell Medicine</h1>
                    <p className="text-gray-500 mt-2">Upload a clear image of the medicine strip. Our AI will verify the details.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 h-auto lg:h-[600px]">
                    {/* LEFT COLUMN: Upload & Preview */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div
                            className={`relative flex-1 bg-white rounded-3xl border-2 border-dashed transition-all overflow-hidden ${file ? 'border-primary/50' : 'border-gray-200 hover:border-primary/30'
                                }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                        >
                            {!preview ? (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-center p-6"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Click to upload or drag & drop</h3>
                                    <p className="text-sm text-gray-400 mt-2 max-w-xs">Supported: JPG, PNG. Make sure expiry date and name are visible.</p>
                                </div>
                            ) : (
                                <div className="relative w-full h-full bg-black">
                                    <img src={preview} alt="Upload" className="w-full h-full object-contain" />

                                    {/* Scanning Overlay */}
                                    <AnimatePresence>
                                        {isScanning && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-primary/10 z-10"
                                            >
                                                <motion.div
                                                    className="w-full h-1 bg-primary shadow-[0_0_20px_rgba(37,99,235,0.8)]"
                                                    animate={{ top: ['0%', '100%', '0%'] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                                    style={{ position: 'absolute' }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-3">
                                                        <ScanLine className="w-5 h-5 animate-pulse" />
                                                        <span className="font-medium tracking-wide">Analyzing Image...</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <button
                                        onClick={() => { setFile(null); setPreview(null); setScannedData(null); }}
                                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-20"
                                        disabled={isScanning}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Form */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm h-full flex flex-col border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                {scannedData ? (
                                    <>
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        <span className="text-emerald-700">Scan Complete</span>
                                    </>
                                ) : (
                                    'Medicine Details'
                                )}
                            </h2>

                            {isScanning ? (
                                <div className="space-y-6 animate-pulse">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i}>
                                            <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
                                            <div className="h-12 bg-gray-50 rounded-xl w-full"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <form className="space-y-6 flex-1 flex flex-col" onSubmit={handleListingSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Medicine Name</label>
                                        <input
                                            type="text"
                                            defaultValue={scannedData?.name}
                                            placeholder="e.g. Dolo 650"
                                            className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-900"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Batch No.</label>
                                            <input
                                                type="text"
                                                defaultValue={scannedData?.batchNumber}
                                                placeholder="e.g. BATCH-001"
                                                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                                            <input
                                                type="date"
                                                defaultValue={scannedData?.expiryDate ? new Date(scannedData.expiryDate).toISOString().split('T')[0] : ''}
                                                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">MRP</label>
                                            <input
                                                type="number"
                                                defaultValue={scannedData?.mrp}
                                                placeholder="0.00"
                                                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Selling Price</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6">
                                        <button
                                            type="submit"
                                            disabled={!scannedData}
                                            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold h-14 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Continue to Listing
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellMedicine;
