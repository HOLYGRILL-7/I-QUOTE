import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';

const QuoteGen = () => {
  const [quote, setQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchQuote = useCallback(async () => {
    if (!searchTerm.trim()|| searchTerm.trim().length < 3 ) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://bolls.life/v2/find/KJV?search=${searchTerm}&match_case=false&match_whole=true&page=1`
      );
      const data = response.data;
      // Show only one random 
       if(data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)];
        setQuote(random);
       }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  },[searchTerm]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return (
    <div className="bg-slate-950 flex items-center justify-center h-screen">
      <div className="bg-amber-600 p-6 rounded-lg text-center h-auto w-[40rem]">
        <h1 className="text-white text-3xl font-bold">I-QUOTE</h1>
        <div className="buttons flex flex-row justify-center items-center space-x-3 my-5">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Enter a theme.."
            className="bg-white rounded-lg w-full h-10 italic px-2"
          />
        </div>

        {/* Verse display */}
        <div className="bg-slate-950 rounded-lg p-6 text-amber-600 w-full h-[10em] mt-5">
          {loading ? (
            <div className="flex justify-center">
              <Loader className="animate-spin text-amber-600" size={24} />
            </div>
          ) : quote ? (
            <>
              <p
                className="text-lg italic"
                dangerouslySetInnerHTML={{ __html: quote.text }}
              />
              <p className="text-sm text-gray-300 mt-2">
                {quote.book} {quote.chapter}:{quote.verse}
              </p>
            </>
          ) : searchTerm.trim() ? (
            <p className="italic text-gray-600">
              No verses found for “{searchTerm}”
            </p>
          ) : (
            <p className="italic text-gray-500">
              Seek a verse to find ... ✨
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteGen;
