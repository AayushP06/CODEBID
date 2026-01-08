import React, { useState } from 'react';
import { api } from '../api';

const SignupView = ({ onSignupSuccess, onBack }) => {
    const [formData, setFormData] = useState({
        teamName: '',
        fullName: '',
        registrationNumber: '',
        branch: '',
        email: '',
        phone: '',
        yearOfStudy: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const branches = [
        'Computer Science Engineering',
        'Information Technology',
        'Electronics and Communication Engineering',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Biotechnology',
        'Food & Safety Engineering',
        'Aerospace Engineering',
        'Other'
    ];

    const years = [1, 2, 3, 4];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.teamName.trim()) {
            newErrors.teamName = 'Team name is required';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.registrationNumber.trim()) {
            newErrors.registrationNumber = 'Registration number is required';
        }

        if (!formData.branch) {
            newErrors.branch = 'Branch is required';
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            console.log('Submitting signup data:', formData);

            const response = await api('/auth/signup', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            console.log('Signup successful:', response);
            
            // Store token
            localStorage.setItem('token', response.token);
            
            // Call success callback
            onSignupSuccess(response.team);

        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ 
                submit: error.message || 'Signup failed. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', padding: '2rem' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '600px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="text-hero" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        JOIN CODEBID
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
                        COMPETITIVE CODING AUCTION PLATFORM
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Team Name */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            Team Name *
                        </label>
                        <input
                            type="text"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            placeholder="e.g., CodeNinjas, AlgoMasters"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: errors.teamName ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        />
                        {errors.teamName && (
                            <div style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {errors.teamName}
                            </div>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: errors.fullName ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        />
                        {errors.fullName && (
                            <div style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {errors.fullName}
                            </div>
                        )}
                    </div>

                    {/* Registration Number */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            Registration Number *
                        </label>
                        <input
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            placeholder="e.g., 21BCE1234, 20IT001"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: errors.registrationNumber ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        />
                        {errors.registrationNumber && (
                            <div style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {errors.registrationNumber}
                            </div>
                        )}
                    </div>

                    {/* Branch */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            Branch *
                        </label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: errors.branch ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        >
                            <option value="">Select your branch</option>
                            {branches.map(branch => (
                                <option key={branch} value={branch} style={{ background: '#1a1a1a' }}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                        {errors.branch && (
                            <div style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {errors.branch}
                            </div>
                        )}
                    </div>

                    {/* Year of Study */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            Year of Study
                        </label>
                        <select
                            name="yearOfStudy"
                            value={formData.yearOfStudy}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        >
                            <option value="">Select year (optional)</option>
                            {years.map(year => (
                                <option key={year} value={year} style={{ background: '#1a1a1a' }}>
                                    Year {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            Email (Optional)
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: errors.email ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        />
                        {errors.email && (
                            <div style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            Phone Number (Optional)
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="1234567890"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: errors.phone ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        />
                        {errors.phone && (
                            <div style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {errors.phone}
                            </div>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div style={{ 
                            color: 'var(--color-primary)', 
                            fontSize: '0.9rem',
                            background: 'rgba(255, 77, 77, 0.1)',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-primary)',
                            textAlign: 'center'
                        }}>
                            {errors.submit}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="hero-btn" 
                        style={{ width: "100%", padding: "1.25rem" }} 
                        disabled={loading}
                    >
                        {loading ? "REGISTERING..." : "REGISTER & JOIN AUCTION"}
                    </button>
                </form>

                {/* Back Button */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button 
                        onClick={onBack}
                        style={{ 
                            background: 'transparent', 
                            color: 'var(--color-text-muted)', 
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                        disabled={loading}
                    >
                        ← Back to Login Options
                    </button>
                </div>

                {/* Info */}
                <div style={{ 
                    marginTop: '2rem', 
                    fontSize: '0.8rem', 
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.4,
                    textAlign: 'center'
                }}>
                    By registering, you'll get 1,000 coins to bid on coding problems.<br/>
                    Win problems by bidding the highest amount!
                </div>
            </div>
        </div>
    );
};

export default SignupView;
 