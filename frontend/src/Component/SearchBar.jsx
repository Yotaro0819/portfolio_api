import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../api/axios';

const SearchBar = ({setResults}) => {
  const [searchType, setSearchType] = useState("user"); // "user" or "post"
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearch = async () => {

    try {
      const res = await axiosInstance.get(`/api/search?type=${searchType}&query=${query}`);
      setResults(res.data.posts || []);
      console.log(res.data.posts);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([])
    }
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
    <div className="relative z-10" style={{width: "300px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(!showDropdown)} // クリックでメニュー表示
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
          }
        }}
        ref={inputRef}
        className="bg-gray-300 h-8 m-1 ml-10 absolute top-1"
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
            left: "40px",
            width: "100%",
            height: "20px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 10,
          }}
        >
          <div
            onClick={() => handleSelectType("user")}
            className="bg-gray-300"
            style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee", borderRadius: "10px 10px 0 0"}}
          >
            Username
          </div>
          <div
            onClick={() => handleSelectType("post")}
            className="bg-gray-300"
            style={{ padding: "10px", cursor: "pointer" , borderRadius: " 0  0 10px 10px" }}
          >
            Post title
          </div>
        </div>
      )}
    </div>
  );
};


export default SearchBar