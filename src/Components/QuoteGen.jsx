import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Loader,
  Copy,
  SquareArrowOutUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const QuoteGen = () => {
  const [quote, setQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const bookNames = {
    1: "Genesis", 2: "Exodus", 3: "Leviticus", 4: "Numbers", 5: "Deuteronomy",
    6: "Joshua", 7: "Judges", 8: "Ruth", 9: "1 Samuel", 10: "2 Samuel",
    11: "1 Kings", 12: "2 Kings", 13: "1 Chronicles", 14: "2 Chronicles",
    15: "Ezra", 16: "Nehemiah", 17: "Esther", 18: "Job", 19: "Psalms",
    20: "Proverbs", 21: "Ecclesiastes", 22: "Song of Solomon", 23: "Isaiah",
    24: "Jeremiah", 25: "Lamentations", 26: "Ezekiel", 27: "Daniel",
    28: "Hosea", 29: "Joel", 30: "Amos", 31: "Obadiah", 32: "Jonah",
    33: "Micah", 34: "Nahum", 35: "Habakkuk", 36: "Zephaniah", 37: "Haggai",
    38: "Zechariah", 39: "Malachi", 40: "Matthew", 41: "Mark", 42: "Luke",
    43: "John", 44: "Acts", 45: "Romans", 46: "1 Corinthians",
    47: "2 Corinthians", 48: "Galatians", 49: "Ephesians", 50: "Philippians",
    51: "Colossians", 52: "1 Thessalonians", 53: "2 Thessalonians",
    54: "1 Timothy", 55: "2 Timothy", 56: "Titus", 57: "Philemon",
    58: "Hebrews", 59: "James", 60: "1 Peter", 61: "2 Peter", 62: "1 John",
    63: "2 John", 64: "3 John", 65: "Jude", 66: "Revelation",
  };

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % matches.length;
    setCurrentIndex(nextIndex);
    setQuote(matches[nextIndex]);
  }, [currentIndex, matches]);

  const handlePrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + matches.length) % matches.length;
    setCurrentIndex(prevIndex);
    setQuote(matches[prevIndex]);
  }, [currentIndex, matches]);

  const fetchQuote = useCallback(async () => {
    if (!searchTerm.trim() || searchTerm.trim().length < 3) return;

    setMatches([]);
    setQuote(null);
    setCurrentIndex(0);
    setLoading(true);

    try {
      const response = await axios.get(
        `https://bolls.life/v2/find/NKJV?search=${searchTerm}&match_case=false&match_whole=false&limit=128&page=1`
      );

      const data = response.data.results;
      if (data.length > 0) {
        setMatches(data);
        setQuote(data[0]);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchQuote();
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm, fetchQuote]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrevious();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  const copyToClipboard = () => {
    if (!quote) return;
    const text = `${quote.text.replace(/<\/?[^>]+(>|$)/g, "")} — ${
      bookNames[quote.book]
    } ${quote.chapter}:${quote.verse} (${quote.translation || "NKJV"})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    if (!quote) return;
    const message = `${quote.text.replace(/<\/?[^>]+(>|$)/g, "")} — ${
      bookNames[quote.book]
    } ${quote.chapter}:${quote.verse}`;
    const url = `https://bible.com/bible/114/${bookNames[
      quote.book
    ]?.replace(/\s/g, "")}.${quote.chapter}.${quote.verse}`;
    const fullMessage = `${message} ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(fullMessage)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to bg-slate-950 flex items-center justify-center h-screen">
      <div className="bg-amber-600 p-6 rounded-lg text-center h-auto w-full max-w-xl mx-4">
        <h1 className="text-white text-3xl font-bold">I-QUOTE</h1>

        <div className="flex justify-center items-center space-x-3 my-5">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Keep your candle lit..."
            className="bg-white rounded-lg w-full h-10 italic px-2 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all duration-300 ease-in-out"
          />
        </div>

        <div className="bg-slate-950 opacity-95 rounded-lg p-6 text-amber-600 w-full h-auto mt-5 relative">
          {quote && (
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-1 text-white hover:bg-amber-500 rounded flex items-center gap-1"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
                {copied && <span className="text-xs text-white">Copied</span>}
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="p-1 text-white hover:bg-green-600 rounded"
                title="Share on WhatsApp"
              >
                <SquareArrowOutUpRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center">
              <Loader className="animate-spin text-amber-600" size={28} />
            </div>
          ) : quote ? (
            <>
              <p
                className="text-lg italic break-words"
                dangerouslySetInnerHTML={{ __html: quote.text }}
              />
              <p className="text-sm text-amber-600 mt-2">
                {bookNames[quote.book]} {quote.chapter}:{quote.verse} (
                {quote.translation || "NKJV"})
              </p>
            </>
          ) : searchTerm.trim().length > 0 ? (
            <p className="italic text-gray-500">Seek a verse to find ... ✨</p>
          ) : (
            <p className="italic text-gray-600">SOLA SCRIPTURA ... ✨</p>
          )}
        </div>

        {quote && matches.length > 1 && (
          <div className="flex justify-center mt-3 space-x-4">
            <button
              onClick={handlePrevious}
              className="group px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-all duration-300 ease-in-out flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4 transform transition-transform duration-300 group-hover:-translate-x-1" />
              Peek
            </button>
            <button
              onClick={handleNext}
              className="group px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-all duration-300 ease-in-out flex items-center gap-1"
            >
              Seek
              <ChevronRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteGen;
