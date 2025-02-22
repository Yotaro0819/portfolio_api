import React, { useEffect, useRef, useState } from 'react'

const SearchBar = () => {
  const [searchType, setSearchType] = useState("user"); // "user" or "post"
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearch = async () => {
  //   if (!query.trim()) return;

  //   try {
  //     const res = await axios.get(`/api/search?type=${searchType}&query=${query}`);
  //     setResults(res.data);
  //   } catch (error) {
  //     console.error("Search failed:", error);
  //   }
  };

  const handleSelectType = (type) => {
    setSearchType(type);
    setShowDropdown(false); // 選択後にメニューを閉じる
    inputRef.current.focus(); // 入力欄をフォーカス
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current !== event.target
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container m-3" style={{ position: "relative", width: "300px" }}>
      {/* 検索バー */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)} // クリックでメニュー表示
        ref={inputRef}
        className="bg-gray-300"
        placeholder={`Search (${searchType === "user" ? "Username" : "Post title"})`}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {/* カテゴリー選択メニュー */}
      {showDropdown && (
        <div
          className="dropdown"
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            width: "100%",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 10,
          }}
        >
          <div
            onClick={() => handleSelectType("user")}
            className="bg-gray-300"
            style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
          >
            Username
          </div>
          <div
            onClick={() => handleSelectType("post")}
            className="bg-gray-300"
            style={{ padding: "10px", cursor: "pointer" }}
          >
            Post title
          </div>
        </div>
      )}

      {/* 検索ボタン */}
      <button onClick={handleSearch} style={{ marginTop: "10px" }}>検索</button>

      {/* 検索結果表示 */}
      <ul>
        {results.map((item, index) => (
          <li key={index}>{item.name || item.title}</li>
        ))}
      </ul>
    </div>
  );
};


export default SearchBar