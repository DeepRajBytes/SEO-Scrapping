import  { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const App = () => {
  const [keywords, setKeywords] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyWordError, setkeyWordError] = useState("");
  const handleFetchData = async () => {
    try {
      setLoading(true);
      setkeyWordError("");
      setData("");
      const keywordArray = keywords
        .split("\n")
        .map((kw) => kw.trim())
        .filter((kw) => kw);

      if (keywordArray.length === 0) {
        alert("Please enter valid keywords");
        setLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:3700/scrape", {
        keywords: keywordArray,
      });
      if (response.data.keyWorderror) {
        setkeyWordError(response.data.keyWorderror);
      }
      if (response.data.success) {
        setData(response.data.results);
      } else {
        alert("Error in fetching data");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      alert("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = data.flatMap((item) =>
      item.results.map((res) => ({
        Keyword: res.Keyword,
        Position: res.Position,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "keywords_results.xlsx");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Keyword Scraper UI</h1>
      <textarea
        placeholder="Enter keywords (one per line)"
        rows="10"
        cols="50"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      ></textarea>
      <button
        onClick={handleFetchData}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Data"}
      </button>

      {data.length > 0 && (
        <>
          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Keyword
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Title
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Link
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Position
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) =>
                item.results.map((result, idx) => (
                  <tr key={`${index}-${idx}`}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {result.Keyword}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {result.Title || "N/A"}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {result.Link || "N/A"}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {result.Position || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button
            onClick={exportToExcel}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Export as Excel
          </button>
        </>
      )}

      {keyWordError && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            color: "white",
            backgroundColor: "red",
            borderRadius: "5px",
          }}
        >
          {keyWordError}
        </div>
      )}
    </div>
  );
};

export default App;
