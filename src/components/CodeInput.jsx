import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import './CodeInput.css';

/**
 * CodeInput Component
 * Reusable component for entering verification codes
 * Features: 6 separate inputs, auto-focus, paste support, backspace handling
 */
export default function CodeInput({ onCodeComplete, length = 6 }) {
    const [code, setCode] = useState(Array(length).fill(''));
    const inputsRef = React.useRef([]);

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        // Check if code is complete
        if (newCode.every(digit => digit !== '')) {
            onCodeComplete(newCode.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        // Check if pasted data is numeric and correct length
        if (/^\d+$/.test(pastedData) && pastedData.length === length) {
            const newCode = pastedData.split('');
            setCode(newCode);

            // Focus last input
            inputsRef.current[length - 1]?.focus();

            // Trigger completion callback
            onCodeComplete(pastedData);
        }
    };

    return (
        <div className="code-input-container">
            {code.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="code-input-box"
                    autoFocus={index === 0}
                />
            ))}
        </div>
    );
}
