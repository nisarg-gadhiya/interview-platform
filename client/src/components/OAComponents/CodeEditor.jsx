import React, { useEffect, useRef } from 'react'
import { BsPlay } from 'react-icons/bs'

const CodeEditor = ({
    code,
    language,
    onCodeChange,
    onLanguageChange,
    onSubmit,
    onRun,
    isSubmitting,
    isRunning
}) => {
    const textareaRef = useRef(null)

    useEffect(() => {
        // Auto-save to localStorage every 30 seconds
        const autoSaveTimer = setInterval(() => {
            if (code) {
                localStorage.setItem('oa_code_backup', code)
            }
        }, 30000)

        return () => clearInterval(autoSaveTimer)
    }, [code])

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'php', label: 'PHP' }
    ]

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-150">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-2">
                <h3 className="font-bold text-gray-900">Code Editor</h3>
                <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-green-500"
                >
                    {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Template Suggestions */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
                💡 Tip: Start with a function to solve the problem
            </div>

            {/* Code Area */}
            <div className="flex-1 overflow-hidden">
                <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => onCodeChange(e.target.value)}
                    placeholder={`Write your ${language} code here...\n\n// Example:\nfunction solve(input) {\n  // Your code here\n  return result;\n}`}
                    className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none border-0 bg-[#1e1e1e] text-white"
                    style={{
                        lineHeight: '1.6'
                    }}
                    spellCheck="false"
                />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
                <span>Lines: {code.split('\n').length}</span>
                <span>Characters: {code.length}</span>
            </div>
        </div>
    )
}

export default CodeEditor
