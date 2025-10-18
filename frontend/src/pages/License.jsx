import { Link } from 'react-router-dom';
import { FileText, Home } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const License = () => {
  useScrollAnimation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="scroll-animate inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          
          <h1 className="scroll-animate text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" style={{transitionDelay: '100ms'}}>
            MIT License
          </h1>
          
          <p className="scroll-animate text-gray-600 dark:text-gray-400 text-lg" style={{transitionDelay: '200ms'}}>
            Open Source Software License
          </p>
        </div>

        {/* License Content */}
        <div className="scroll-animate bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12" style={{transitionDelay: '300ms'}}>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Copyright (c) {new Date().getFullYear()} Resume Builder Project
            </p>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>

            <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="scroll-animate text-center mt-8" style={{transitionDelay: '400ms'}}>
          <Link 
            to="/" 
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default License;
