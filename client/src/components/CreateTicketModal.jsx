import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../redux/slices/ticketSlice';
import { getCategories } from '../redux/slices/categorySlice';

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }) => {
    const dispatch = useDispatch();
    const { categories, isLoading: isCategoriesLoading } = useSelector((state) => state.categories || { categories: [], isLoading: false });
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        files: [],
        category: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            dispatch(getCategories());
        }
    }, [dispatch, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            files: [...prev.files, ...files]
        }));
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await dispatch(createTicket(formData)).unwrap();
            if (onTicketCreated) onTicketCreated();
            onClose();
        } catch (error) {
            console.error('Failed to create ticket:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Blurred background */}
            <div className="absolute inset-0 backdrop-blur-md bg-white/30" onClick={onClose}></div>
            
            {/* Modal content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Create New Ticket</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Dropdown */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent"
                            >
                                <option value="" disabled>
                                    {isCategoriesLoading ? 'Loading categories...' : 'Select a category'}
                                </option>
                                {categories && categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Issue Field */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Issue
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent"
                                placeholder="Brief description of the issue"
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent"
                                placeholder="Detailed description of the issue"
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Attach Files
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--hotpink)] hover:text-[var(--roseberry)] focus-within:outline-none"
                                        >
                                            <span>Upload files</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                multiple
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, PDF up to 10MB
                                    </p>
                                </div>
                            </div>
                            
                            {/* File List */}
                            {formData.files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {formData.files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm text-gray-600 truncate">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-[var(--hotpink)] rounded-lg hover:bg-[var(--roseberry)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--hotpink)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Create Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTicketModal; 