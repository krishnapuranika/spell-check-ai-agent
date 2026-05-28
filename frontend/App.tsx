import React, { useState, useCallback } from 'react';
import { correctText } from './services/gemini.ts';
import { TextArea } from './components/TextArea.tsx';
import { Wand2, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCorrect = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutputText('');
    setCopied(false);

    try {
      const corrected = await correctText(inputText);
      setOutputText(corrected);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleCopy = useCallback(() => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setError(null);
    setCopied(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <Wand2 className="w-10 h-10 text-blue-600" />
            AI Text Corrector
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Instantly fix spelling, grammar, and punctuation errors. Paste your text below and let AI do the rest.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 h-[600px]">
            
            {/* Input Section */}
            <div className="p-6 flex flex-col h-full bg-slate-50/50">
              <TextArea
                label="Original Text"
                placeholder="Type or paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="bg-white"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">
                  {inputText.length} characters
                </span>
                <button
                  onClick={handleClear}
                  disabled={!inputText && !outputText}
                  className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50 transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className="p-6 flex flex-col h-full relative bg-white">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Corrected Text</label>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors bg-blue-50 px-3 py-1 rounded-full"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              
              <div className={`flex-grow p-4 border rounded-xl shadow-sm overflow-auto bg-slate-50 ${error ? 'border-red-300' : 'border-slate-200'}`}>
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-sm font-medium animate-pulse">Analyzing and correcting...</p>
                  </div>
                ) : error ? (
                  <div className="h-full flex flex-col items-center justify-center text-red-500 space-y-2">
                    <AlertCircle className="w-8 h-8" />
                    <p className="text-sm font-medium text-center">{error}</p>
                  </div>
                ) : outputText ? (
                  <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                    {outputText}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                    Your corrected text will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-center">
            <button
              onClick={handleCorrect}
              disabled={!inputText.trim() || isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Correct Text
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-sm text-slate-400">
          Powered by Gemini 2.5 Flash. Results may vary.
        </p>
      </div>
    </div>
  );
}
