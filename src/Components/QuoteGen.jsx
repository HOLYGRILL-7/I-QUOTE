import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import DOMPurify from "dompurify";

const QuoteGen = () => {
  const [quote, setQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    63: "2 John", 64: "3 John", 65: "Jude", 66: "Revelation"
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % matches.length;
    setCurrentIndex(nextIndex);
    setQuote(matches[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + matches.length) % matches.length;
    setCurrentIndex(prevIndex);
    setQuote(matches[prevIndex]);
  };

  const fetchQuote = useCallback(async () => {
    if (!searchTerm.trim() || searchTerm.trim().length < 3) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://bolls.life/v2/find/NKJV?search=${searchTerm}&match_case=false&match_whole=false&limit=128&page=1`,
        { timeout: 10000 } // Added timeout for reliability
      );
      const data = response.data.results;
      console.log('API response:', data); // Debug log
      if (data.length > 0) {
        setMatches(data);
        setCurrentIndex(0);
        setQuote(data[0]);
      } else {
        setMatches([]);
        setQuote(null);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      setMatches([]);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return (
    <div className="bg-slate-950 flex items-center justify-center min-h-screen">
      <div className="bg-amber-600 p-6 rounded-lg text-center h-auto max-w-2xl w-full">
        <h1 className="text-white text-3xl font-bold">I-QUOTE</h1>

        <div className="buttons flex flex-row justify-center items-center space-x-3 my-5">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Enter a theme..."
            className="bg-white rounded-lg w-full h-10 italic px-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Search for a Bible verse by theme"
          />
        </div>

        <div className="bg-slate-950 rounded-lg p-6 text-amber-600 w-full h-auto">
          {loading ? (
            <div className="flex justify-center">
              <Loader
                className="animate-spin text-amber-600"
                size={24}
                aria-label="Loading verse"
              />
            </div>
          ) : quote ? (
            <>
              <p
                className="text-lg italic"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quote.text) }}
              />
              <p className="text-sm text-amber-600 mt-2">
                {bookNames[quote.book]} {quote.chapter}:{quote.verse} (
                {quote.translation || "NKJV"})
              </p>
            </>
          ) : searchTerm.trim() ? (
            <p className="italic text-gray-600">
              No verses found for “{searchTerm}”
            </p>
          ) : (
            <p className="italic text-gray-500">Seek a verse to find ... ✨</p>
          )}
        </div>

        {matches.length > 1 && (
          <div className="flex justify-center mt-3 space-x-4">
            <button
              type="button"
              onClick={handlePrevious}
              className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-500"
              aria-label="View previous verse"
            >
              Peek
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-500"
              aria-label="View next verse"
            >
              Seek
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteGen;